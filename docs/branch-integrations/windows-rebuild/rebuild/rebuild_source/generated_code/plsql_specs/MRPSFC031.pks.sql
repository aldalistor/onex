-- GENERATED CODE — MRPSFC031.fmx
-- Source evidence: FMX catalog / Reverse Engineering specification
-- Status: SCAFFOLD_ONLY; verify exact package signatures before deployment.
-- Generated: 2026-09-11

CREATE OR REPLACE PACKAGE RB_MRPSFC031_46BF8 IS
  -- Window: MRPSFC031.fmx; Domain: MRP/treasury
  -- Observed procedure indicators: 10
  -- Observed trigger indicators: 3
  -- Observed table indicators: 117
  -- Risk flags: credentials,ddl_privilege,destructive,dynamic_sql,windows_native,session_control
  PROCEDURE initialize(p_form_name IN VARCHAR2 DEFAULT 'MRPSFC031');
  PROCEDURE validate_before_save(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE save_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE update_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE delete_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE post_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE reverse_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  PROCEDURE print_document(p_record_key IN VARCHAR2 DEFAULT NULL);
  FUNCTION is_valid(p_record_key IN VARCHAR2 DEFAULT NULL) RETURN BOOLEAN;
  FUNCTION status RETURN VARCHAR2;
END RB_MRPSFC031_46BF8;
/
