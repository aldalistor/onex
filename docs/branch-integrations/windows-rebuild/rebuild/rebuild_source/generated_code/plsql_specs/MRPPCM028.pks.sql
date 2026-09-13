-- GENERATED CODE — MRPPCM028.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_MRPPCM028_C5FF2 IS
  -- Window: MRPPCM028.fmx; Domain: MRP/treasury
  -- Observed procedure indicators: 13
  -- Observed trigger indicators: 57
  -- Observed table indicators: 159
  -- Risk flags: ddl_privilege,destructive,windows_native,error_handling,session_control
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'MRPPCM028');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_MRPPCM028_C5FF2;
/
