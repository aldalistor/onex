-- GENERATED CODE — SHP_DBA.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_SHP_DBA_D3FC3 IS
  -- Window: SHP_DBA.fmx; Domain: other-finance/operations
  -- Observed procedure indicators: 32
  -- Observed trigger indicators: 40
  -- Observed table indicators: 344
  -- Risk flags: credentials,ddl_privilege,destructive,windows_native,error_handling
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'SHP_DBA');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_SHP_DBA_D3FC3;
/
