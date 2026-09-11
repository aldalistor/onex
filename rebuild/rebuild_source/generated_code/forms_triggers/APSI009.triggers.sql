-- GENERATED ORACLE FORMS TRIGGERS — APSI009.fmx
-- These are Forms Builder trigger bodies, not SQL*Plus statements.
-- Status: SCAFFOLD_ONLY; map exact blocks/items from FMB/source before use.
-- Package wrapper: RB_APSI009_6DA7B

-- PRE-FORM
BEGIN
  RB_APSI009_6DA7B.initialize('APSI009');
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Initialization failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-NEW-FORM-INSTANCE
BEGIN
  RB_APSI009_6DA7B.initialize('APSI009');
END;

-- KEY-COMMIT
BEGIN
  RB_APSI009_6DA7B.save_document(NULL);
  COMMIT_FORM;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    MESSAGE('Save failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- KEY-EXIT
BEGIN
  EXIT_FORM;
END;

-- WHEN-VALIDATE-RECORD
BEGIN
  RB_APSI009_6DA7B.validate_before_save(NULL);
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Validation failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-BUTTON-PRESSED: SAVE
BEGIN
  RB_APSI009_6DA7B.save_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: POST
BEGIN
  RB_APSI009_6DA7B.post_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: REVERSE
BEGIN
  RB_APSI009_6DA7B.reverse_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: PRINT
BEGIN
  RB_APSI009_6DA7B.print_document(NULL);
END;

-- ON-ERROR
BEGIN
  MESSAGE('Oracle Forms error: ' || ERROR_TYPE || '-' || TO_CHAR(ERROR_CODE));
  RAISE FORM_TRIGGER_FAILURE;
END;

-- Observed catalog indicators: procedures=33, triggers=9, tables=92, risks=credentials,ddl_privilege,destructive,windows_native
