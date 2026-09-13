-- GENERATED CODE — ERP_DBA.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_ERP_DBA_2AADA IS
  -- Window: ERP_DBA.fmx; Domain: other
  -- Observed procedure indicators: 139
  -- Observed trigger indicators: 0
  -- Observed table indicators: 519
  -- Risk flags: credentials,ddl_privilege,destructive,dynamic_sql,windows_native,error_handling,session_control,network
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'ERP_DBA');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_ERP_DBA_2AADA;
/
