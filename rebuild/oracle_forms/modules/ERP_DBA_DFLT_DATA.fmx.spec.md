# مواصفة إعادة بناء ERP_DBA_DFLT_DATA.fmx

> هذه مواصفة Reverse Engineering قابلة للتتبع وليست ملف FMB ثنائيًا. إنشاء FMB مطابق يتطلب المصدر الأصلي أو Forms Builder.

## تعريف الوحدة
- اسم الوحدة: `ERP_DBA_DFLT_DATA.fmx.fmb`
- الدليل: `reverse_engineering/focus_forms/ERP_DBA_DFLT_DATA.fmx.md`
- النمط المستهدف: Oracle Forms 12c/Forms Builder مع قاعدة Oracle الحالية
- RTL: العربية أولًا مع دعم الإنجليزية

## الإجراءات المرصودة
- `DTS_INSRT_DATA_PKG`
- `DTS_INSRT_FORM_DTL_PKG`
- `FAS_INSRT_DATA_PKG`
- `FAS_INSRT_FORM_DTL_PKG`
- `FMS_INSRT_DATA_PKG`
- `FMS_INSRT_FORM_DTL_PKG`
- `FNG_GRN_PKG`
- `FNG_INSRT_DATA_PKG`
- `FNG_INSRT_FORM_DTL_PKG`
- `GET_GRP_BY_FLD_FNC`
- `GET_TYPE_NM_FNC`
- `GLS_INSRT_DATA_PKG`
- `GLS_INSRT_FORM_DTL_PKG`
- `HRS_AFR_PKG`
- `HRS_ARTCL_PKG`
- `HRS_EVL_PKG`
- `HRS_GNR_PKG`
- `HRS_INSRT_DATA_PKG`
- `HRS_INSRT_FORM_DTL_PKG`
- `HRS_MDCL_PKG`
- `HRS_SNCTN_PKG`
- `IAS_ACODE_PKG`
- `IAS_BRN_PKG`
- `IAS_CC_CODE_PKG`
- `IAS_CSHBNK_PKG`
- `IAS_DBS_SYS_PKG`
- `IAS_FORM_DTL_PKG`
- `IAS_GEN_PKG`
- `IAS_INSRT_SFLAGS1_PRC`
- `IAS_ITM_PKG`
- `IAS_PJ_PKG`
- `IAS_USR_PKG`
- `IAS_VNDR_PKG`
- `IAS_WCODE_PKG`
- `INSERT_ONLINE_PRC`
- `INSRT_FORM_DTL_PKG`
- `INSRT_FORM_PRIV_PRC`
- `INSRT_LIST_PRC`
- `INSRT_LOV_PRC`
- `INSRT_SFLAGS_PRC`
- `INSRT_S_MSGS_PRC`
- `LOGIN_PRC`
- `LST_APPRVD_SCREEN`
- `MRP_INSRT_DATA_PKG`
- `MRP_INSRT_FORM_DTL_PKG`
- `MTX_INSRT_DATA_PKG`
- `MTX_INSRT_FORM_DTL_PKG`
- `PMS_INSRT_DATA_PKG`
- `PMS_INSRT_FORM_DTL_PKG`
- `REM_INSRT_DATA_PKG`
- `REM_INSRT_FORM_DTL_PKG`
- `REP_FORM`
- `SHL_INSRT_DATA_PKG`
- `SHL_INSRT_FORM_DTL_PKG`
- `SHP_INSRT_DATA_PKG`
- `SHP_INSRT_FORM_DTL_PKG`
- `V_CR_FRM_PKG`
- `YSERP_LIB`
- `YS_AC_DTL_PKG`
- `YS_APPRVD_PKG`
- `YS_EMP_PKG`
- `YS_GEN_PKG`

## المكونات المرتبطة
- `ERP_DBA_DFLT_DATA_LNG.FMX`
- `IASGLT019.FMX`

## حالة التنفيذ
- تصميم/تتبع: جاهز كبداية.
- كود PL/SQL المصدر: مطلوب من PKB/PKS أو قاعدة اختبار.
- عناصر الواجهة والـBlocks: مطلوب تأكيدها من FMB أو لقطة تشغيلية.
- اختبارات المطابقة: يجب تنفيذها مقابل النظام القديم.

## قاعدة عدم التغيير
- لا يتم تغيير قواعد الترحيل أو حالات المستند دون اختبار مقارنة مع Oracle Forms القديم.
