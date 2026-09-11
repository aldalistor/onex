-- GENERATED ORACLE FORMS TRIGGERS — ADMINVI017.fmx
-- These are Forms Builder trigger bodies, not SQL*Plus statements.
-- Status: SCAFFOLD_ONLY; map exact blocks/items from FMB/source before use.
-- Package wrapper: RB_ADMINVI017_B75BD

-- PRE-FORM
BEGIN
  RB_ADMINVI017_B75BD.initialize('ADMINVI017');
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Initialization failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-NEW-FORM-INSTANCE
BEGIN
  RB_ADMINVI017_B75BD.initialize('ADMINVI017');
END;

-- KEY-COMMIT
BEGIN
  RB_ADMINVI017_B75BD.save_document(NULL);
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
  RB_ADMINVI017_B75BD.validate_before_save(NULL);
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Validation failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-BUTTON-PRESSED: SAVE
BEGIN
  RB_ADMINVI017_B75BD.save_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: POST
BEGIN
  RB_ADMINVI017_B75BD.post_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: REVERSE
BEGIN
  RB_ADMINVI017_B75BD.reverse_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: PRINT
BEGIN
  RB_ADMINVI017_B75BD.print_document(NULL);
END;

-- ON-ERROR
BEGIN
  MESSAGE('Oracle Forms error: ' || ERROR_TYPE || '-' || TO_CHAR(ERROR_CODE));
  RAISE FORM_TRIGGER_FAILURE;
END;

-- Observed catalog indicators: procedures=36, triggers=8, tables=146, risks=credentials,ddl_privilege,destructive,dynamic_sql,windows_native
