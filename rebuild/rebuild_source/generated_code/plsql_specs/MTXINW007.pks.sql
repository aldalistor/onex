-- GENERATED CODE — MTXINW007.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_MTXINW007_ED9A8 IS
  -- Window: MTXINW007.fmx; Domain: inventory/stock
  -- Observed procedure indicators: 6
  -- Observed trigger indicators: 2
  -- Observed table indicators: 31
  -- Risk flags: destructive,windows_native
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'MTXINW007');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_MTXINW007_ED9A8;
/
