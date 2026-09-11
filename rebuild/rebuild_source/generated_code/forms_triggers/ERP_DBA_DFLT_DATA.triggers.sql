-- GENERATED ORACLE FORMS TRIGGERS — ERP_DBA_DFLT_DATA.fmx
-- These are Forms Builder trigger bodies, not SQL*Plus statements.
-- Status: SCAFFOLD_ONLY; map exact blocks/items from FMB/source before use.
-- Package wrapper: RB_ERP_DBA_DFLT_DATA_9D746

-- PRE-FORM
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.initialize('ERP_DBA_DFLT_DATA');
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Initialization failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-NEW-FORM-INSTANCE
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.initialize('ERP_DBA_DFLT_DATA');
END;

-- KEY-COMMIT
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.save_document(NULL);
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
  RB_ERP_DBA_DFLT_DATA_9D746.validate_before_save(NULL);
EXCEPTION
  WHEN OTHERS THEN
    MESSAGE('Validation failed: ' || SQLERRM);
    RAISE FORM_TRIGGER_FAILURE;
END;

-- WHEN-BUTTON-PRESSED: SAVE
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.save_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: POST
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.post_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: REVERSE
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.reverse_document(NULL);
  COMMIT_FORM;
END;

-- WHEN-BUTTON-PRESSED: PRINT
BEGIN
  RB_ERP_DBA_DFLT_DATA_9D746.print_document(NULL);
END;

-- ON-ERROR
BEGIN
  MESSAGE('Oracle Forms error: ' || ERROR_TYPE || '-' || TO_CHAR(ERROR_CODE));
  RAISE FORM_TRIGGER_FAILURE;
END;

-- Observed catalog indicators: procedures=62, triggers=11, tables=1510, risks=credentials,ddl_privilege,destructive,dynamic_sql,windows_native,error_handling,network
