-- GENERATED ORACLE FORMS TRIGGERS — HRSS016.fmx
-- These are Forms Builder trigger bodies, not SQL*Plus statements.
-- Status: SCAFFOLD_ONLY; map exact blocks/items from FMB/source before use.
-- Package wrapper: RB_HRSS016_EAC28

-- PRE-FORM
BEGIN
  RB_HRSS016_EAC28.initialize('HRSS016');
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Initialization failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-NEW-FORM-INSTANCE
BEGIN
  RB_HRSS016_EAC28.initialize('HRSS016');
END;

-- KEY-COMMIT
BEGIN
  RB_HRSS016_EAC28.save_document(NULL);
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
  RB_HRSS016_EAC28.validate_before_save(NULL);
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Validation failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-BUTTON-PRESSED: SAVE
BEGIN
  RB_HRSS016_EAC28.save_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: POST
BEGIN
  RB_HRSS016_EAC28.post_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: REVERSE
BEGIN
  RB_HRSS016_EAC28.reverse_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: PRINT
BEGIN
  RB_HRSS016_EAC28.print_document(NULL);
END;

-- ON-ERROR
BEGIN
  MESSAGE('Oracle Forms error: ' || ERROR_TYPE || '-' || TO_CHAR(ERROR_CODE));
  RAISE FORM_TRIGGER_FAILURE;
END;

-- Observed catalog indicators: procedures=32, triggers=10, tables=49, risks=credentials,ddl_privilege,destructive,windows_native
