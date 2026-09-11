-- GENERATED CODE — GLSR012.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_GLSR012_DEDF4 IS
  -- Window: GLSR012.fmx; Domain: GL/finance
  -- Observed procedure indicators: 30
  -- Observed trigger indicators: 5
  -- Observed table indicators: 276
  -- Risk flags: credentials,ddl_privilege,destructive,dynamic_sql,windows_native,error_handling
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'GLSR012');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_GLSR012_DEDF4;
/
