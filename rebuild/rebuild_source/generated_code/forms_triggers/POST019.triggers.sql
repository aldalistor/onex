-- GENERATED ORACLE FORMS TRIGGERS — POST019.fmx
-- These are Forms Builder trigger bodies, not SQL*Plus statements.
-- Status: SCAFFOLD_ONLY; map exact blocks/items from FMB/source before use.
-- Package wrapper: RB_POST019_8B74D

-- PRE-FORM
BEGIN
  RB_POST019_8B74D.initialize('POST019');
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Initialization failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-NEW-FORM-INSTANCE
BEGIN
  RB_POST019_8B74D.initialize('POST019');
END;

-- KEY-COMMIT
BEGIN
  RB_POST019_8B74D.save_document(NULL);
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
  RB_POST019_8B74D.validate_before_save(NULL);
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Validation failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-BUTTON-PRESSED: SAVE
BEGIN
  RB_POST019_8B74D.save_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: POST
BEGIN
  RB_POST019_8B74D.post_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: REVERSE
BEGIN
  RB_POST019_8B74D.reverse_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: PRINT
BEGIN
  RB_POST019_8B74D.print_document(NULL);
END;

-- ON-ERROR
BEGIN
  MESSAGE('Oracle Forms error: ' || ERROR_TYPE || '-' || TO_CHAR(ERROR_CODE));
  RAISE FORM_TRIGGER_FAILURE;
END;

-- Observed catalog indicators: procedures=43, triggers=9, tables=215, risks=credentials,ddl_privilege,destructive,dynamic_sql,windows_native
