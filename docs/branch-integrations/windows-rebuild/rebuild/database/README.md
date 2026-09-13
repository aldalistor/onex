# Oracle database compatibility

المشروع يستهدف إبقاء Oracle الحالية كمصدر حقيقة في المرحلة الأولى. لا يوجد اتصال أو كلمة مرور داخل المستودع.

## المطلوب

- DDL للجداول والـViews والـSequences.
- PKS/PKB وTriggers وFunctions.
- قاموس `DBA_OBJECTS` و`DBA_TAB_COLUMNS` للمخططات `IAS_SYS` و`YSPOS1`.
- نسخة اختبار منفصلة لاستيراد `ias.dmp` باستخدام أداة Oracle Legacy Import متوافقة.

## منع المخاطر

لا تستورد dump إلى الإنتاج. لا تنشر `ias.dmp` أو ملفات TNS أو كلمات المرور.
