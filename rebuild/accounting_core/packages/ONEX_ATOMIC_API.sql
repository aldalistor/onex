-- Atomic transaction boundary for every legacy-compatible window.
-- No COMMIT or ROLLBACK is allowed inside these APIs.

CREATE OR REPLACE PACKAGE ONEX_ATOMIC_API IS
  PROCEDURE begin_window(p_window IN VARCHAR2, p_request_id IN VARCHAR2);
  PROCEDURE require_idempotency(p_idempotency_key IN VARCHAR2);
  PROCEDURE audit_event(p_actor IN VARCHAR2, p_action IN VARCHAR2, p_entity_type IN VARCHAR2, p_entity_id IN VARCHAR2, p_request_id IN VARCHAR2, p_before_hash IN VARCHAR2, p_after_hash IN VARCHAR2);
  PROCEDURE enqueue_event(p_aggregate_type IN VARCHAR2, p_aggregate_id IN VARCHAR2, p_event_type IN VARCHAR2, p_payload_json IN CLOB);
  PROCEDURE assert_balanced(p_journal_id IN NUMBER);
  PROCEDURE fail(p_code IN NUMBER, p_message IN VARCHAR2);
END ONEX_ATOMIC_API;
/

CREATE OR REPLACE PACKAGE BODY ONEX_ATOMIC_API IS
  PROCEDURE begin_window(p_window IN VARCHAR2, p_request_id IN VARCHAR2) IS
  BEGIN
    DBMS_APPLICATION_INFO.SET_MODULE(p_window, p_request_id);
    SAVEPOINT ONEX_WINDOW_START;
  END;

  PROCEDURE require_idempotency(p_idempotency_key IN VARCHAR2) IS
    l_count NUMBER;
  BEGIN
    IF p_idempotency_key IS NULL THEN
      fail(-20910,'Idempotency key is required');
    END IF;
    SELECT COUNT(*) INTO l_count FROM ONEX_AR_DOC WHERE IDEMPOTENCY_KEY = p_idempotency_key;
    IF l_count > 0 THEN
      fail(-20911,'Duplicate idempotency key');
    END IF;
  END;

  PROCEDURE audit_event(p_actor IN VARCHAR2, p_action IN VARCHAR2, p_entity_type IN VARCHAR2, p_entity_id IN VARCHAR2, p_request_id IN VARCHAR2, p_before_hash IN VARCHAR2, p_after_hash IN VARCHAR2) IS
  BEGIN
    INSERT INTO ONEX_AUDIT_EVENT(AUDIT_ID,ACTOR,ACTION_CODE,ENTITY_TYPE,ENTITY_ID,REQUEST_ID,BEFORE_HASH,AFTER_HASH)
    VALUES(ONEX_AUDIT_SEQ.NEXTVAL,p_actor,p_action,p_entity_type,p_entity_id,p_request_id,p_before_hash,p_after_hash);
  END;

  PROCEDURE enqueue_event(p_aggregate_type IN VARCHAR2, p_aggregate_id IN VARCHAR2, p_event_type IN VARCHAR2, p_payload_json IN CLOB) IS
  BEGIN
    INSERT INTO ONEX_OUTBOX_EVENT(EVENT_ID,AGGREGATE_TYPE,AGGREGATE_ID,EVENT_TYPE,PAYLOAD_JSON)
    VALUES(ONEX_OUTBOX_SEQ.NEXTVAL,p_aggregate_type,p_aggregate_id,p_event_type,p_payload_json);
  END;

  PROCEDURE assert_balanced(p_journal_id IN NUMBER) IS
    l_debit NUMBER; l_credit NUMBER;
  BEGIN
    SELECT NVL(SUM(DEBIT),0),NVL(SUM(CREDIT),0) INTO l_debit,l_credit FROM ONEX_GL_LINE WHERE JOURNAL_ID=p_journal_id;
    IF l_debit <> l_credit OR l_debit = 0 THEN
      fail(-20912,'Journal is not balanced');
    END IF;
  END;

  PROCEDURE fail(p_code IN NUMBER, p_message IN VARCHAR2) IS
  BEGIN
    RAISE_APPLICATION_ERROR(p_code,p_message);
  END;
END ONEX_ATOMIC_API;
/
