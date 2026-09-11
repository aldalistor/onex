-- GENERATED CODE — FASI002.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_FASI002_B5E11 IS
  -- Window: FASI002.fmx; Domain: GL/finance
  -- Observed procedure indicators: 41
  -- Observed trigger indicators: 8
  -- Observed table indicators: 111
  -- Risk flags: credentials,ddl_privilege,destructive,windows_native
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'FASI002');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_FASI002_B5E11;
/
