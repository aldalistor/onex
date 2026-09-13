# مواصفة إعادة بناء GLST001.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `GLST001.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/GLST001.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `ADD_PROC`
- `AUDIT_PRC`
- `B4SAVE_PRC`
- `CALL_OBJCT_PKG`
- `CALL_OBJ_PRC`
- `CALL_SCREEN`
- `CHECK_CR_LIMIT_PRC`
- `CHECK_MISSING_PRC`
- `CHK_B4SAVE_DTL_PRC`
- `CHK_B4SAVE_MST_PRC`
- `CHK_BDGT_BLNC_PRC`
- `CHK_CR_LIMIT_AF_SAV_PRC`
- `DATE_LOV_WINDOW`
- `DELETE_PROC`
- `DEL_DET_REC_PRC`
- `DMY_EXEC_TRG`
- `DSPLY_MNDTRY_FLD_PRC`
- `ENA_DIS_ITM_PRC`
- `EXIT_PROC`
- `FILL_ALL_LIST_PRC`
- `FILL_OBJ_CALL_PRC`
- `GEN_PKG`
- `GET_BL_CST_FNC`
- `GET_BL_CST_FNCIAS20142GET_BL_CST_FNC`
- `GET_BL_CST_VND_FNC`
- `GET_BL_CST_VND_FNCIAS20142GET_BL_CST_VND_FNC`
- `IAS_ACODE_PKG`
- `IAS_ACTV_PKG`
- `IAS_AUDIT_PKG`
- `IAS_AUD_SYS_PKG`
- `IAS_BRN_PKG`
- `IAS_CC_CODE_PKG`
- `IAS_CHECK_LIGHT_TRANS_FNC`
- `IAS_CHECK_SYS_PKG`
- `IAS_CHK_BRN_UP_DEL_FNC`
- `IAS_CHK_BRN_UP_DEL_FNCIAS20142IAS_CHK_BRN_UP_DEL_FNC`
- `IAS_CHK_LGHT_BRN_FNC`
- `IAS_CHK_LGHT_BRN_FNCIAS20142IAS_CHK_LGHT_BRN_FNC`
- `IAS_CSHBNK_PKG`
- `IAS_CST_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_DOC_DEL_FNC`
- `IAS_GET_ENC_PASS_FNC`
- `IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC`
- `IAS_GL_LMT_PKG`
- `IAS_INSTALLMENT_AP_PKG`
- `IAS_INSTALLMENT_AR_PKG`
- `IAS_PJ_PKG`
- `IAS_POST_IN_SAV_PKG`
- `IAS_PRMTR_PKG`
- `IAS_USR_PKG`
- `IAS_VNDR_PKG`
- `KEY_LISTVAL_PRC`
- `LIST_PROC`
- `LOV_PKG`
- `LOV_TRG`
- `LYSERP_LIB`
- `POSITION_PRC`
- `POST_FORMS_COMMIT_PRC`
- `PRE_FORM_PRC`
- `PRINT_PROC`
- `REM_GEN_PKG`
- `SAVE_PROC`
- `SET_POS_PRC`
- `SHW_VT_PRC`
- `SRCH_DTL_PKG`
- `SYS_SCREEN`
- `UPDATE_PROC`
- `WHEN_NEW_FORM_INSTANCE_PRC`
- `WHEN_TAB_PAGE_CHANGED_PRC`
- `WHEN_TIMER_EXPIRED_PRC`
- `WIN_API`
- `YSERP_LIB`
- `YSERP_MNU`
- `YS_AC_DTL_PKG`
- `YS_EMP_PKG`
- `YS_GEN_PKG`

## المكونات المرتبطة
- `ADMT030.Fmx`
- `APST005.Fmx`
- `APST010.Fmx`
- `APST013.Fmx`
- `ARST004.Fmx`
- `ARST006.Fmx`
- `ARST016.Fmx`
- `ERP_CODE_TRNS.FMX`
- `Excel.exe`
- `GLST001.Fmx`
- `GLST002.Fmx`
- `GLST004.Fmx`
- `InvT003.Fmx`
- `InvT004.Fmx`
- `YSERP_MNU.MMX`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
