-- YSERP_REBUILD_WRAPPERS.pls
-- Human-readable PLL rebuild template; not a compiled PLL.
-- Replace package signatures only after extracting PKS/PKB from Oracle test schema.

PACKAGE ys_bill_rebuild IS
  FUNCTION validate_header(p_bill_ser NUMBER) RETURN BOOLEAN;
  FUNCTION validate_detail(p_bill_ser NUMBER) RETURN BOOLEAN;
  PROCEDURE save_bill(p_bill_ser NUMBER);
  PROCEDURE post_bill(p_bill_ser NUMBER);
  PROCEDURE reverse_bill(p_bill_ser NUMBER);
END ys_bill_rebuild;
/

PACKAGE BODY ys_bill_rebuild IS
  FUNCTION validate_header(p_bill_ser NUMBER) RETURN BOOLEAN IS
  BEGIN
    -- TODO: call IAS_BILL_API/IAS_CST_PKG after obtaining exact signatures.
    RETURN TRUE;
  END;

  FUNCTION validate_detail(p_bill_ser NUMBER) RETURN BOOLEAN IS
  BEGIN
    -- TODO: validate IAS_BILL_DTL, stock, price, discount and tax rules.
    RETURN TRUE;
  END;

  PROCEDURE save_bill(p_bill_ser NUMBER) IS
  BEGIN
    IF NOT validate_header(p_bill_ser) OR NOT validate_detail(p_bill_ser) THEN
      RAISE_APPLICATION_ERROR(-20001, 'Bill validation failed');
    END IF;
    -- TODO: invoke exact legacy-compatible posting API.
  END;

  PROCEDURE post_bill(p_bill_ser NUMBER) IS
  BEGIN
    -- TODO: call exact inventory/AR/GL posting packages.
    NULL;
  END;

  PROCEDURE reverse_bill(p_bill_ser NUMBER) IS
  BEGIN
    -- TODO: use reversal, never destructive delete for posted documents.
    NULL;
  END;
END ys_bill_rebuild;
/
