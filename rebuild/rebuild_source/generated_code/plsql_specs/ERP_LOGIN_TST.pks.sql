-- GENERATED CODE — ERP_LOGIN_TST.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_ERP_LOGIN_TST_30E34 IS
  -- Window: ERP_LOGIN_TST.fmx; Domain: other
  -- Observed procedure indicators: 27
  -- Observed trigger indicators: 5
  -- Observed table indicators: 261
  -- Risk flags: credentials,ddl_privilege,destructive,windows_native,session_control,network
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'ERP_LOGIN_TST');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_ERP_LOGIN_TST_30E34;
/
