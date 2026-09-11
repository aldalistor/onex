# مواصفة إعادة بناء ERP_Update_New_Version6.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `ERP_Update_New_Version6.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/ERP_Update_New_Version6.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `ADD_PROC`
- `CALL_DOC_ALRT_PRC`
- `CHK_CST_CR_LMT_PRC`
- `CHK_DUP_FLD_FNC`
- `CRT_ALTR_DBS_PRC`
- `DBA_CREATE_LGHT_PKG`
- `DELETE_PROC`
- `DIS_ENA_CONS_FK_PRC`
- `DTS_FORM_DTL_PRC`
- `DTS_TABLE_PRC`
- `ENA_DIS_ITM_PRC`
- `EXIT_PROC`
- `FAS_POSTING_PKG`
- `FILL_ALL_LIST_PRC`
- `FNG_GRN_PKG`
- `GEN_PKG`
- `GET_FRMT_FLD_FNC`
- `GET_GRP_BY_FLD_FNC`
- `GET_MSG_TXT_FNC`
- `HRS_EVL_PKG`
- `HRS_GNR_PKG`
- `HRS_POSTING_PKG`
- `HRS_SNCTN_PKG`
- `IAS_AC_CC_LMT_PKG`
- `IAS_AUDIT_OTHR_PKG`
- `IAS_AUDIT_PKG`
- `IAS_AUD_SYS_PKG`
- `IAS_BRN_PKG`
- `IAS_CHECK_DBS_PKG`
- `IAS_CHECK_SYS_PKG`
- `IAS_CSHBNK_PKG`
- `IAS_DBS_SYS_PKG`
- `IAS_DRTMP_TRG`
- `IAS_FORM_DTL_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_ENC_PASS_FNC`
- `IAS_GET_ENC_PASS_FNCIAS20141IAS_GET_ENC_PASS_FNC`
- `IAS_GL_LMT_PKG`
- `IAS_GL_TRNS_PKG`
- `IAS_INSRT_LABELS1_PRC`
- `IAS_INSRT_LABELS2_PRC`
- `IAS_INSRT_MSGS1_PRC`
- `IAS_ITM_PKG`
- `IAS_JRS_POST_PKG`
- `IAS_LGHT_DP_TRG`
- `IAS_LGHT_SFLGS_TRG`
- `IAS_LGHT_WCODE_TRG`
- `IAS_MEASURMENTS_PKG`
- `IAS_POSTING_AP_PKG`
- `IAS_POSTING_AR_PKG`
- `IAS_POSTING_DOC_PKG`
- `IAS_POSTING_GL_PKG`
- `IAS_POSTING_GRNT_PKG`
- `IAS_POSTING_INV_PKG`
- `IAS_POSTING_JRS_PKG`
- `IAS_POSTING_PKG`
- `IAS_POSTING_SHP_PKG`
- `IAS_PRMTR_PKG`
- `IAS_REPLICA_DATA_PKG`
- `IAS_SHP_POST_PKG`
- `IAS_SMAN_PKG`
- `IAS_SMS_MAIL_PKG`
- `IAS_USR_PKG`
- `INSRT_ALERT_SYS_PRC`
- `INSRT_FORM_DTL_PKG`
- `INSRT_MSGS_PRC`
- `INSRT_MSG_ALRT_PRC`
- `LIST_PROC`
- `LOV_TRG`
- `LYSERP_LIB`
- `POST_FORMS_COMMIT_PRC`
- `PRE_FORM_PRC`
- `PRE_HALF_ADD_PRC`
- `PRINT_PROC`
- `SAVE_PROC`
- `SHOW_BAT_COL1_IN_SCREEN`
- `SHOW_BAT_COL2_IN_SCREEN`
- `SHOW_BAT_COL3_IN_SCREEN`
- `SHOW_BAT_COL4_IN_SCREEN`
- `SHOW_BAT_COL5_IN_SCREEN`
- `SYS_SCREEN`
- `S_DBS_SYS_PKG`
- `UPDATE_PROC`
- `WHEN_NEW_FORM_INSTANCE_PRC`
- `WHEN_TAB_PAGE_CHANGED_PRC`
- `WHEN_TIMER_EXPIRED_PRC`
- `YSERP_LIB`
- `YSERP_MNU`
- `YS_AC_DTL_PKG`
- `YS_APPRVD_PKG`
- `YS_DBS_SYS_PKG`
- `YS_EMP_PKG`
- `YS_GEN_PKG`
- `YS_PRMTR_PKG`
- `YS_SCR_PKG`
- `YS_SRL_SCR_PKG`

## المكونات المرتبطة
- `IASGLT019.FMX`
- `YSERP_MNU.MMX`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
