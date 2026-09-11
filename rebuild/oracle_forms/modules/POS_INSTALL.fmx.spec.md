# مواصفة إعادة بناء POS_INSTALL.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `POS_INSTALL.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/POS_INSTALL.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `CHECK_UPGRADE_ONYX_PRC`
- `CREATE_JOB_PROC`
- `CREATE_MV_BRN_PRC`
- `CREATE_MV_LOG_PRC`
- `CREATE_PKG_PRC`
- `CREATE_PK_FUN_PRC`
- `CREATE_SYNONYMS_4ONYX_PRC`
- `CREATE_SYNONYMS_4POS_PRC`
- `CREATE_TBLSPACE_PRC`
- `CREATE_TS_PRC`
- `EXIT_PROC`
- `FILL_ALL_LIST_PRC`
- `GEN_PKG`
- `GET_BL_CST_FNC`
- `GIVE_GRANT_PRC`
- `IAS_DBS_SYS_PKG`
- `IAS_ENCDEC_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_ALL_FLD_TBL_FNC`
- `IAS_INSRT_S_MSG_PRC`
- `IAS_POS_PKG`
- `INSRT_FORM_POS_DTL_PRC`
- `INSRT_POS_INIT_DATA_PRC`
- `INSRT_SFLGS_PRC`
- `INSRT_S_MSGS_PRC`
- `LPOSSTP_LIB`
- `POSSTP_LIB`
- `POS_FILEDS_PKG`
- `POS_INSRT_DATA_PKG`
- `POS_PACKAGE_PKG`
- `POS_PROCDRE_FUNC_PKG`
- `POS_TABLE_PKG`
- `POS_VIEW_PKG`
- `PRE_FORM_PRC`
- `REFRES_JOB_PROC`
- `REP_FORM`
- `SYNCHRONIZE_DATA_SALES_PROC`
- `SYNCHRONIZE_DATA_TRANSFER_PROC`
- `UPDATE_DFLT_PROFILE_PRC`
- `YS_GEN_PKG`

## المكونات المرتبطة

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
