-- GENERATED ORACLE FORMS TRIGGERS — INVR020.fmx
-- These are Forms Builder trigger bodies, not SQL*Plus statements.
-- Status: SCAFFOLD_ONLY; map exact blocks/items from FMB/source before use.
-- Package wrapper: RB_INVR020_103CD

-- PRE-FORM
BEGIN
  RB_INVR020_103CD.initialize('INVR020');
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Initialization failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-NEW-FORM-INSTANCE
BEGIN
  RB_INVR020_103CD.initialize('INVR020');
END;

-- KEY-COMMIT
BEGIN
  RB_INVR020_103CD.save_document(NULL);
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
  RB_INVR020_103CD.validate_before_save(NULL);
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Validation failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-BUTTON-PRESSED: SAVE
BEGIN
  RB_INVR020_103CD.save_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: POST
BEGIN
  RB_INVR020_103CD.post_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: REVERSE
BEGIN
  RB_INVR020_103CD.reverse_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: PRINT
BEGIN
  RB_INVR020_103CD.print_document(NULL);
END;

-- ON-ERROR
BEGIN
  MESSAGE('Oracle Forms error: ' || ERROR_TYPE || '-' || TO_CHAR(ERROR_CODE));
  RAISE FORM_TRIGGER_FAILURE;
END;

-- Observed catalog indicators: procedures=15, triggers=3, tables=82, risks=credentials,destructive
