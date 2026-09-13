-- GENERATED CODE — ADMT027.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_ADMT027_DFFDF IS
  -- Window: ADMT027.fmx; Domain: admin/system
  -- Observed procedure indicators: 238
  -- Observed trigger indicators: 14
  -- Observed table indicators: 1511
  -- Risk flags: credentials,ddl_privilege,destructive,dynamic_sql,windows_native,error_handling,session_control,network
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'ADMT027');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_ADMT027_DFFDF;
/
