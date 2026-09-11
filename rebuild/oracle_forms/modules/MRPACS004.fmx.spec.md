# مواصفة إعادة بناء MRPACS004.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `MRPACS004.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/MRPACS004.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `ACTUAL_PRODUCTIVITY_FNC`
- `ATT_PKG`
- `AVALIVALE_TIME_FNC`
- `BOM_PKG`
- `BTN_CLR_FORM`
- `CHK_BRN_PARAMTRS_PRC`
- `COMMIT_FORM`
- `EXIT_FORM`
- `EXPECTED_PRODUCTION_FNC`
- `FUNC_PKG`
- `GNR_PKG`
- `IAS_ITM_PKG`
- `MPS_PKG`
- `MRPSFC_PKG`
- `MRP_DBS_PKG`
- `MRP_PKG`
- `MRP_UPDATE_AVGCST_PRC`
- `PCM_PKG`
- `PLAND_PRODUCTION_FNC`
- `REP_PKG`
- `RPS_PKG`
- `TOTAL_TIME_FNC`
- `TRAC_PKG`
- `WEIGHT_PKG`

## المكونات المرتبطة
- `IASMENU.MMX`
- `MRPSFC025.FMX`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
