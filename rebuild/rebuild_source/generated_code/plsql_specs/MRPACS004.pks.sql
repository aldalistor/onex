-- GENERATED CODE — MRPACS004.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_MRPACS004_BC49E IS
  -- Window: MRPACS004.fmx; Domain: MRP/treasury
  -- Observed procedure indicators: 24
  -- Observed trigger indicators: 1
  -- Observed table indicators: 1816
  -- Risk flags: credentials,ddl_privilege,destructive,dynamic_sql,windows_native,error_handling,network
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'MRPACS004');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_MRPACS004_BC49E;
/
