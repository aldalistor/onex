# مواصفة إعادة بناء SHPDBA.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `SHPDBA.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/SHPDBA.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `CREATE_TS_PRC`
- `CRT_FAS_DEPR_PKG`
- `CRT_FAS_POSTING_PKG`
- `CRT_GNR_CMNT_PRC`
- `FAS_DEPR_PKG`
- `FAS_GNR_PKG`
- `FAS_POSTING_PKG`
- `FAS_TRNS_PKG`
- `GEN_PKG`
- `GLS_COMMENT_PKG`
- `GLS_CONSTRAINT_PKG`
- `GLS_FUNCTION_PKG`
- `GLS_INDEX_PKG`
- `GLS_INSRT_DATA_PKG`
- `GLS_INSRT_FORM_DTL_PKG`
- `GLS_PACKAGE_PKG`
- `GLS_PROCEDURE_PKG`
- `GLS_SEQUENCE_PKG`
- `GLS_SYNONYM_PKG`
- `GLS_TABLE_FILED_PKG`
- `GLS_TABLE_PKG`
- `GLS_TRIGGER_PKG`
- `GLS_VIEW_PKG`
- `HRS_POSTING_PKG`
- `IAS_DBS_SYS_PKG`
- `IAS_POSTING_GL_PKG`
- `IAS_POSTING_JRS_PKG`
- `IAS_POSTING_PKG`
- `IAS_POSTING_SHP_PKG`
- `INSERT_SCREEN`
- `LYSERP_LIB`
- `OLD_CRT_FAS_DEPR_PKG`
- `OLD_CRT_FAS_GNR_PKG`
- `OLD_CRT_FAS_POSTING_PKG`
- `OLD_CRT_FAS_TRNS_PKG`
- `OLD_CRT_GNR_CMNT_PRC`
- `POST_IN_SAVE_PKG`
- `SHP_COMMENT_PKG`
- `SHP_CONSTRAINT_PKG`
- `SHP_FUNCTION_PKG`
- `SHP_INDEX_PKG`
- `SHP_INSRT_DATA_PKG`
- `SHP_INSRT_FORM_DTL_PKG`
- `SHP_PACKAGE_PKG`
- `SHP_POSTING_PKG`
- `SHP_PROCEDURE_PKG`
- `SHP_SEQUENCE_PKG`
- `SHP_SYNONYM_PKG`
- `SHP_S_SCR_LBL_PKG`
- `SHP_TABLE_FILED_PKG`
- `SHP_TABLE_PKG`
- `SHP_TRIGGER_PKG`
- `SHP_VIEW_PKG`
- `YSERP_LIB`
- `YS_GEN_PKG`
- `YS_GNR_PKG`

## المكونات المرتبطة

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
