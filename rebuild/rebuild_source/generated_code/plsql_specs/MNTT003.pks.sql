-- GENERATED CODE — MNTT003.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_MNTT003_6B081 IS
  -- Window: MNTT003.fmx; Domain: other
  -- Observed procedure indicators: 46
  -- Observed trigger indicators: 8
  -- Observed table indicators: 199
  -- Risk flags: credentials,destructive,windows_native
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'MNTT003');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_MNTT003_6B081;
/
