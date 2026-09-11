-- ARST004_required_objects.sql
-- Checklist only; do not execute blindly. Extract exact DDL from test Oracle.
SELECT owner, object_type, object_name
FROM dba_objects
WHERE owner IN ('IAS_SYS','YSPOS1')
  AND (object_name LIKE 'IAS%'
       OR object_name IN ('ITEM_MOVEMENT','SALES_ORDER','QUOTATION','VOUCHER_DETAIL'))
ORDER BY owner, object_type, object_name;

-- Required evidence: IAS_BILL_MST, IAS_BILL_DTL, IAS_RT_BILL_MST,
-- IAS_RT_BILL_DTL, IAS_WHTRNS_MST, IAS_OUTGOING_MST, IAS_RESERVE_DTL,
-- IAS_ITM_ATTACH_OTHRS and the exact package specs used by ARST004.
