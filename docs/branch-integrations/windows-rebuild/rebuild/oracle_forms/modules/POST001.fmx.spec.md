# مواصفة إعادة بناء POST001.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `POST001.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/POST001.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `ADD_DOC_PROC`
- `ADD_PROC`
- `B4SAVE_PRC`
- `CALC_INSRT_POS_POINT_PRC`
- `CALC_POS_POINT_RPLC_PRC`
- `CALL_DEL_ITM_PRC`
- `CHECK_AVL_QTY_PRC`
- `CHK_B4SAVE_DTL_PRC`
- `CHK_B4SAVE_MST_PRC`
- `CUSTOMER_DISPLAYED_PRC`
- `DELETE_PROC`
- `DEL_DET_REC_PRC`
- `DEL_POS_TMP_TBL_PRC`
- `ENA_DIS_ITM_PRC`
- `EXIT_PROC`
- `FILL_ALL_LIST_PRC`
- `GEN_PKG`
- `GET_BLNC_CST_FNC`
- `IAS_BRN_PKG`
- `IAS_CST_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_ENC_PASS_FNC`
- `IAS_GET_SALESDISC_PRC`
- `IAS_GET_SALESDISC_PRCYSPOS2IAS_GET_SALESDISC_PRC`
- `IAS_ITM_PKG`
- `IAS_POS_DISTIBUTED_DB_PKG`
- `IAS_PRMTR_PKG`
- `IAS_QT_PRM_PKG`
- `IAS_QT_PRM_SCR_PKG`
- `IAS_SMS_MAIL_PKG`
- `IAS_SMS_MAIL_PKGYSPOS2INSRT_MSG_ALRT_PRC`
- `IAS_USR_PKG`
- `IAS_WCODE_PKG`
- `KEY_LISTVAL_PRC`
- `LIST_PROC`
- `LOV_TRG`
- `LYSPOS_LIB`
- `POST_FORMS_COMMIT_PRC`
- `POS_MNU_PKG`
- `POS_PKG`
- `POS_POINT_PKG`
- `PRE_FORM_PRC`
- `PRINT_F_SCR_PRC`
- `PRINT_PROC`
- `REP_FORM`
- `SAVE_PROC`
- `SEND_MSG_PRC`
- `SET_POS_PRC`
- `SYS_SCREEN`
- `UPDATE_PROC`
- `WHEN_NEW_FORM_INSTANCE_PRC`
- `WHEN_TAB_PAGE_CHANGED_PRC`
- `WHEN_TIMER_EXPIRED_PRC`
- `YSPOS_LIB`
- `YSPOS_MNU`
- `YS_GEN_PKG`

## المكونات المرتبطة
- `POSADVS.FMX`
- `YSComUsb.Dll`
- `YSPOS_MNU.MMX`
- `YSPOS_MNU.mmx`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
