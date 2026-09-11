-- GENERATED CODE — MTXCAT001.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_MTXCAT001_6B4F2 IS
  -- Window: MTXCAT001.fmx; Domain: inventory/stock
  -- Observed procedure indicators: 17
  -- Observed trigger indicators: 5
  -- Observed table indicators: 107
  -- Risk flags: destructive,windows_native
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'MTXCAT001');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_MTXCAT001_6B4F2;
/
