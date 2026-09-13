# ARST004 — مواصفة إعادة بناء FMB

> هذه ليست FMB ثنائية؛ إنها مواصفة تنفيذية مبنية على الأدلة المستخرجة من `ARST004.fmx`.

## الهوية

- الوحدة: `ARST004.fmb`
- المجال: AR / Sales Invoice
- العملية: فاتورة بيع، تعديل، حذف، مردود/ارتباطات، ترحيل، تدقيق وطباعة
- الأدلة: `oracle_forms/reverse_engineering/focus_forms/ARST004.fmx.md`

## Data Blocks المقترحة

### BILL_MST

الجدول: `IAS_BILL_MST`  
المفتاح: `BILL_SER`  
حقول مرصودة: `BILL_DOC_TYPE`, `CASH_NO`, `C_CODE`, `CR_CARD_NO`, `A_CODE`, `BILL_CURRENCY`, `BILL_RATE`, `STOCK_RATE`, `C_NAME`, `DISC_AMT`, `OTHR_AMT`, `BILL_AMT`, `W_CODE`, `R_CODE`, `REP_CODE`, `REF_NO`, `CC_CODE`, `PJ_NO`, `ACTV_NO`, `BILL_POST`, `AUDIT_REF`, `PAID_BILL`, `REC_INV_BILL`.

### BILL_DTL

الجدول: `IAS_BILL_DTL`  
العلاقة: `BILL_MST.BILL_SER = BILL_DTL.BILL_SER`  
حقول مرصودة: `I_CODE`, `ITM_UNT`, `I_QTY`, `P_QTY`, `P_SIZE`, `FREE_QTY`, `EXPIRE_DATE`, `BATCH_NO`, `W_CODE`, `CC_CODE`, `PJ_NO`, `ACTV_NO`, `I_PRICE`, `I_PRICE_VAT`, `DIS_PER`, `DIS_AMT_DTL`, `BARCODE`, `SERVICE_ITEM`.

## Program Units المطلوبة

- `B4SAVE_PRC`
- `CHK_B4SAVE_MST_PRC`
- `CHK_B4SAVE_DTL_PRC`
- `SAVE_PROC`
- `UPDATE_PROC`
- `DELETE_PROC`
- `PRINT_PROC`
- `POST_FORMS_COMMIT_PRC`
- `GET_TR_QTY_FNC`
- `GET_BL_CST_VND_FNC`
- `IAS_GET_SALESFREEQTY_PRC`
- `IAS_GET_SALESDISC_PRC`
- `IAS_LAST_SALE_PRICE_PRC`
- `IAS_INSRT_OUT_BILLS_PKG`
- `IAS_POST_IN_SAV_PKG`
- `IAS_ITM_INV_PKG`
- `IAS_AUDIT_PKG`

## Triggers التي يجب إعادة تنفيذها

- `WHEN-NEW-FORM-INSTANCE`
- `PRE-FORM`
- `WHEN-VALIDATE-ITEM`
- `WHEN-VALIDATE-RECORD`
- `KEY-COMMIT`
- `KEY-EXIT`
- `WHEN-BUTTON-PRESSED`
- `WHEN-TIMER-EXPIRED`
- `ON-ERROR`

## قواعد الحفظ والـCommit

1. تحقق من العميل والحساب والمخزن ومركز التكلفة.
2. تحقق من الصنف والكمية والسعر والخصم والضريبة.
3. تحقق من حدود الائتمان وحالة العميل.
4. تحقق من عدم ترحيل الفاتورة مسبقًا.
5. احفظ الرأس والتفاصيل ضمن معاملة واحدة.
6. استدعِ حزم المخزون والـAR والـAudit من طبقة wrapper.
7. لا تحذف مستندًا مرحلًا؛ استخدم الإلغاء/العكس حسب قواعد النظام.
8. قارن أثر المخزون وAR وGL مع النظام القديم.
