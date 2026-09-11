-- GENERATED CODE — EXP_REPORT_TO_EXCEEL.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_EXP_REPORT_TO_EXCEEL_5D757 IS
  -- Window: EXP_REPORT_TO_EXCEEL.fmx; Domain: other
  -- Observed procedure indicators: 0
  -- Observed trigger indicators: 0
  -- Observed table indicators: 7
  -- Risk flags: none
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'EXP_REPORT_TO_EXCEEL');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_EXP_REPORT_TO_EXCEEL_5D757;
/
