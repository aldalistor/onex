-- GENERATED CODE — GENS012_11-10-2016.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_GENS012_11_10_2016_CC335 IS
  -- Window: GENS012_11-10-2016.fmx; Domain: other
  -- Observed procedure indicators: 57
  -- Observed trigger indicators: 10
  -- Observed table indicators: 250
  -- Risk flags: credentials,ddl_privilege,destructive,windows_native,network
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'GENS012_11-10-2016');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_GENS012_11_10_2016_CC335;
/
