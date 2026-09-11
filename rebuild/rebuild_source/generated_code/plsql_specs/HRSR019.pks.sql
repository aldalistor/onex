-- GENERATED CODE — HRSR019.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_HRSR019_22D4C IS
  -- Window: HRSR019.fmx; Domain: HR
  -- Observed procedure indicators: 25
  -- Observed trigger indicators: 4
  -- Observed table indicators: 110
  -- Risk flags: credentials,destructive,dynamic_sql,windows_native
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'HRSR019');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_HRSR019_22D4C;
/
