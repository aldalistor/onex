-- Atomic AR window API used by ARST004/ARST006/ARST023 compatibility wrappers.
-- The caller owns COMMIT/ROLLBACK. This package never commits.

CREATE OR REPLACE PACKAGE ONEX_AR_WINDOW_API IS
  PROCEDURE create_invoice(
    p_company_id IN NUMBER,
    p_branch_id IN NUMBER,
    p_period_id IN NUMBER,
    p_customer_id IN NUMBER,
    p_doc_no IN VARCHAR2,
    p_doc_date IN DATE,
    p_currency_code IN CHAR,
    p_subtotal IN NUMBER,
    p_tax_total IN NUMBER,
    p_discount_total IN NUMBER,
    p_created_by IN VARCHAR2,
    p_source_form IN VARCHAR2,
    p_source_id IN VARCHAR2,
    p_idempotency_key IN VARCHAR2,
    p_doc_id OUT NUMBER
  );
  PROCEDURE post_invoice(p_doc_id IN NUMBER, p_actor IN VARCHAR2, p_request_id IN VARCHAR2);
  PROCEDURE reverse_invoice(p_doc_id IN NUMBER, p_actor IN VARCHAR2, p_request_id IN VARCHAR2);
END ONEX_AR_WINDOW_API;
/

CREATE OR REPLACE PACKAGE BODY ONEX_AR_WINDOW_API IS
  PROCEDURE create_invoice(
    p_company_id IN NUMBER, p_branch_id IN NUMBER, p_period_id IN NUMBER,
    p_customer_id IN NUMBER, p_doc_no IN VARCHAR2, p_doc_date IN DATE,
    p_currency_code IN CHAR, p_subtotal IN NUMBER, p_tax_total IN NUMBER,
    p_discount_total IN NUMBER, p_created_by IN VARCHAR2, p_source_form IN VARCHAR2,
    p_source_id IN VARCHAR2, p_idempotency_key IN VARCHAR2, p_doc_id OUT NUMBER
  ) IS
    l_total NUMBER := NVL(p_subtotal,0)+NVL(p_tax_total,0)-NVL(p_discount_total,0);
  BEGIN
    ONEX_ATOMIC_API.begin_window(p_source_form,'CREATE:'||p_idempotency_key);
    ONEX_ATOMIC_API.require_idempotency(p_idempotency_key);
    IF p_subtotal IS NULL OR p_subtotal < 0 OR p_tax_total IS NULL OR p_tax_total < 0 OR p_discount_total IS NULL OR p_discount_total < 0 THEN
      ONEX_ATOMIC_API.fail(-20920,'Invalid invoice amounts');
    END IF;
    INSERT INTO ONEX_AR_DOC(DOC_ID,COMPANY_ID,BRANCH_ID,PERIOD_ID,CUSTOMER_ID,DOC_TYPE,DOC_NO,DOC_DATE,CURRENCY_CODE,EXCHANGE_RATE,STATUS,SUBTOTAL,TAX_TOTAL,DISCOUNT_TOTAL,GRAND_TOTAL,BASE_GRAND_TOTAL,SOURCE_FORM,SOURCE_ID,IDEMPOTENCY_KEY,CREATED_BY)
    VALUES(ONEX_AR_DOC_SEQ.NEXTVAL,p_company_id,p_branch_id,p_period_id,p_customer_id,'INVOICE',p_doc_no,p_doc_date,p_currency_code,1,'DRAFT',p_subtotal,p_tax_total,p_discount_total,l_total,l_total,p_source_form,p_source_id,p_idempotency_key,p_created_by)
    RETURNING DOC_ID INTO p_doc_id;
    ONEX_ATOMIC_API.audit_event(p_created_by,'CREATE','AR_DOC',TO_CHAR(p_doc_id),NULL,NULL,STANDARD_HASH(TO_CHAR(p_doc_id)||TO_CHAR(l_total),'SHA256'));
    ONEX_ATOMIC_API.enqueue_event('AR_DOC',TO_CHAR(p_doc_id),'AR_DOC_CREATED','{"source_form":"'||p_source_form||'"}');
  EXCEPTION WHEN OTHERS THEN
    ROLLBACK TO ONEX_WINDOW_START;
    RAISE;
  END create_invoice;

  PROCEDURE post_invoice(p_doc_id IN NUMBER, p_actor IN VARCHAR2, p_request_id IN VARCHAR2) IS
    l_company NUMBER; l_branch NUMBER; l_period NUMBER; l_currency CHAR(3); l_total NUMBER; l_status VARCHAR2(20); l_journal NUMBER;
  BEGIN
    ONEX_ATOMIC_API.begin_window('ARST004',p_request_id);
    SELECT COMPANY_ID,BRANCH_ID,PERIOD_ID,CURRENCY_CODE,GRAND_TOTAL,STATUS INTO l_company,l_branch,l_period,l_currency,l_total,l_status
      FROM ONEX_AR_DOC WHERE DOC_ID=p_doc_id FOR UPDATE;
    IF l_status NOT IN ('APPROVED','DRAFT') THEN ONEX_ATOMIC_API.fail(-20921,'Document cannot be posted from current status'); END IF;
    INSERT INTO ONEX_GL_JOURNAL(JOURNAL_ID,COMPANY_ID,BRANCH_ID,PERIOD_ID,SOURCE_DOC_ID,JOURNAL_NO,JOURNAL_DATE,STATUS)
      VALUES(ONEX_GL_JOURNAL_SEQ.NEXTVAL,l_company,l_branch,l_period,p_doc_id,'AR-'||TO_CHAR(p_doc_id),TRUNC(SYSDATE),'POSTED') RETURNING JOURNAL_ID INTO l_journal;
    INSERT INTO ONEX_GL_LINE(JOURNAL_LINE_ID,JOURNAL_ID,LINE_NO,ACCOUNT_CODE,DEBIT,CREDIT,CURRENCY_CODE,AMOUNT_CURRENCY)
      SELECT ONEX_GL_LINE_SEQ.NEXTVAL,l_journal,1,c.AR_ACCOUNT_CODE,l_total,0,l_currency,l_total FROM ONEX_AR_DOC d JOIN ONEX_CUSTOMER c ON c.CUSTOMER_ID=d.CUSTOMER_ID WHERE d.DOC_ID=p_doc_id;
    INSERT INTO ONEX_GL_LINE(JOURNAL_LINE_ID,JOURNAL_ID,LINE_NO,ACCOUNT_CODE,DEBIT,CREDIT,CURRENCY_CODE,AMOUNT_CURRENCY)
      SELECT ONEX_GL_LINE_SEQ.NEXTVAL,l_journal,x.LINE_NO,x.REVENUE_ACCOUNT_CODE,0,x.LINE_TOTAL,l_currency,x.LINE_TOTAL
      FROM (SELECT ROW_NUMBER() OVER (ORDER BY l.DOC_LINE_ID)+1 LINE_NO,l.REVENUE_ACCOUNT_CODE,l.LINE_TOTAL
              FROM ONEX_AR_DOC_LINE l WHERE l.DOC_ID=p_doc_id) x;
    ONEX_ATOMIC_API.assert_balanced(l_journal);
    UPDATE ONEX_AR_DOC SET STATUS='POSTED',POSTED_BY=p_actor,POSTED_AT=SYSTIMESTAMP WHERE DOC_ID=p_doc_id;
    ONEX_ATOMIC_API.audit_event(p_actor,'POST','AR_DOC',TO_CHAR(p_doc_id),p_request_id,NULL,STANDARD_HASH('POSTED:'||TO_CHAR(p_doc_id),'SHA256'));
    ONEX_ATOMIC_API.enqueue_event('AR_DOC',TO_CHAR(p_doc_id),'AR_DOC_POSTED','{"journal_id":'||TO_CHAR(l_journal)||'}');
  EXCEPTION WHEN OTHERS THEN
    ROLLBACK TO ONEX_WINDOW_START;
    RAISE;
  END post_invoice;

  PROCEDURE reverse_invoice(p_doc_id IN NUMBER, p_actor IN VARCHAR2, p_request_id IN VARCHAR2) IS
    l_status VARCHAR2(20);
  BEGIN
    ONEX_ATOMIC_API.begin_window('ARST006',p_request_id);
    SELECT STATUS INTO l_status FROM ONEX_AR_DOC WHERE DOC_ID=p_doc_id FOR UPDATE;
    IF l_status <> 'POSTED' THEN ONEX_ATOMIC_API.fail(-20922,'Only posted invoices can be reversed'); END IF;
    UPDATE ONEX_AR_DOC SET STATUS='REVERSED' WHERE DOC_ID=p_doc_id;
    ONEX_ATOMIC_API.audit_event(p_actor,'REVERSE','AR_DOC',TO_CHAR(p_doc_id),p_request_id,NULL,STANDARD_HASH('REVERSED:'||TO_CHAR(p_doc_id),'SHA256'));
    ONEX_ATOMIC_API.enqueue_event('AR_DOC',TO_CHAR(p_doc_id),'AR_DOC_REVERSED','{}');
  EXCEPTION WHEN OTHERS THEN
    ROLLBACK TO ONEX_WINDOW_START;
    RAISE;
  END reverse_invoice;
END ONEX_AR_WINDOW_API;
/
