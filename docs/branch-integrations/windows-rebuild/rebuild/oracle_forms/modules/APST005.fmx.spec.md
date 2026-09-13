# مواصفة إعادة بناء APST005.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `APST005.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/APST005.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `ADD_PROC`
- `ATTACH_ITEM_PKG`
- `AUDIT_PRC`
- `B4SAVE_PRC`
- `CHANGE_BILL_TYP_PRC`
- `CHK_B4SAVE_DTL_PRC`
- `CHK_B4SAVE_MST_PRC`
- `CKECK_ITM_VNDR_CNT_PRC`
- `DELETE_PROC`
- `DEL_DET_REC_PRC`
- `ENA_DIS_ITM_PRC`
- `EXIT_PROC`
- `FILL_ALL_LIST_PRC`
- `GEN_PKG`
- `GET_COST_ITM_PRC`
- `GET_ITM_SER_PRC`
- `IAS_ACODE_PKG`
- `IAS_ACTV_PKG`
- `IAS_AP_DOC_SERIAL_PKG`
- `IAS_ATTACH_ITM_PKG`
- `IAS_AUDIT_PKG`
- `IAS_AUD_SYS_PKG`
- `IAS_BRN_PKG`
- `IAS_CC_CODE_PKG`
- `IAS_CHECK_LIGHT_TRANS_FNC`
- `IAS_CHECK_SYS_PKG`
- `IAS_CSHBNK_PKG`
- `IAS_CST_PKG`
- `IAS_DBS_SYS_PKG`
- `IAS_FETCH_DATA_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_DOC_DEL_FNC`
- `IAS_GET_ENC_PASS_FNC`
- `IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC`
- `IAS_ITM_BARCODE_PKG`
- `IAS_ITM_INV_PKG`
- `IAS_ITM_PKG`
- `IAS_PJ_PKG`
- `IAS_POST_IN_SAV_PKG`
- `IAS_PRMTR_PKG`
- `IAS_TRNS_PKG`
- `IAS_USR_PKG`
- `IAS_VNDR_PKG`
- `IAS_WCODE_PKG`
- `IAS_WEIGHT_SYS_PKG`
- `IAS_WEIGHT_SYS_PKGIAS20142CALC_AREA_SIZE_PRC`
- `IAS_WT_PKG`
- `IMP_F_EXCEL_PRC`
- `KEY_LISTVAL_PRC`
- `LIST_PROC`
- `LOV_PKG`
- `LOV_TRG`
- `LYSERP_LIB`
- `POST_FORMS_COMMIT_PRC`
- `PRE_FORM_PRC`
- `PRINT_PROC`
- `SAVE_PROC`
- `SET_POS_PRC`
- `SHOW_BAT_COL1_IN_SCREEN`
- `SHOW_BAT_COL2_IN_SCREEN`
- `SHOW_BAT_COL3_IN_SCREEN`
- `SHOW_BAT_COL4_IN_SCREEN`
- `SHOW_BAT_COL5_IN_SCREEN`
- `SRCH_DTL_PKG`
- `SYS_SCREEN`
- `UPDATE_OTHER_CHARGES_DTL_PRC`
- `UPDATE_PROC`
- `WHEN_NEW_FORM_INSTANCE_PRC`
- `WHEN_TAB_PAGE_CHANGED_PRC`
- `WHEN_TIMER_EXPIRED_PRC`
- `WIN_API`
- `YSERP_LIB`
- `YSERP_MNU`
- `YS_AC_DTL_PKG`
- `YS_GEN_PKG`
- `YS_ITM_LOV_PKG`

## المكونات المرتبطة
- `ERP_CODE_TRNS.FMX`
- `EXCEL.EXE`
- `Excel.exe`
- `INVI010.Fmx`
- `Inv_Itm_Trns.Fmx`
- `Inv_Reevaluation.Fmx`
- `YSERP_MNU.MMX`
- `YS_ICODE_LOV.FMX`
- `calc.exe`
- `invi023.Fmx`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
