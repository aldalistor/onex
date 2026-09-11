# مواصفة إعادة بناء ARSR041.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `ARSR041.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/ARSR041.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `ADD_PROC`
- `CLEAR_PROC`
- `DELETE_PROC`
- `EXIT_PROC`
- `FILL_ALL_LIST_PRC`
- `GEN_PKG`
- `GET_INC_PRC`
- `GET_SALES_PRC`
- `IAS_ACTV_PKG`
- `IAS_AR_GET_DATA_REP_PKG`
- `IAS_CHECK_SYS_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_ENC_PASS_FNC`
- `IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC`
- `IAS_INV_MNGMNT_PKG`
- `IAS_ITM_PKG`
- `IAS_PJ_PKG`
- `IAS_USR_PKG`
- `IAS_VNDR_PKG`
- `IMP_F_XLS_PRC`
- `INSERT_DATA_PRC`
- `LIST_PROC`
- `LOV_TRG`
- `LYSERP_LIB`
- `PRE_FORM_PRC`
- `PRINT_PROC`
- `SAVE_PROC`
- `SHOW_SUM_PRC`
- `SYS_SCREEN`
- `S_GEN_PKG`
- `UPDATE_PROC`
- `WIN_API`
- `YSERP_LIB`
- `YSERP_MNU`
- `YS_GEN_PKG`

## المكونات المرتبطة
- `Excel.exe`
- `YSERP_MNU.MMX`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
