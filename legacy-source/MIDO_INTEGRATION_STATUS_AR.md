# حالة دمج Mido داخل ONEX

تم فحص مستودعي `aldalistor/mido` و`aldalistor/Meedo-2` وفروع Mido المرحلية. مستودع Mido لا يحتوي ملفات FMX جديدة مستقلة؛ جرد Forms فيه يثبت وجود 1,490 ملف FMX، وهي نفس المجموعة الموجودة في ONEX Catalog.

| المصدر | الحالة | الاستخدام داخل ONEX |
|---|---|---|
| Mido accounting/business cores | مدمج كمصدر مرجعي | قواعد القيود، الفواتير، دورة المستند، الإقفال، الذمم |
| Mido Oracle migrations | مدمج كمصدر SQL مرجعي | مخطط الأمن والفترات والمبيعات والمخزون والتقارير |
| Mido forms inventory | مدمج | مطابقة عدد النوافذ وحالات الجرد |
| Mido Oracle import status | مدمج كحالة تدقيق | 936 جدولًا، 200 View، 13 Sequence، مع تحذيرات الاستيراد |
| Mido Electron shell | محفوظ كمصدر Windows | مرجع للمثبت والتشغيل المحلي؛ لا يستبدل WebDev runtime |
| FMX/FMB binaries | غير موجودة في Mido Git | لا يمكن توليد منطق Forms الحرفي بدون الملفات الأصلية |

الحالة النهائية: **Catalog كامل 1,490 نافذة؛ طبقات Mido التشغيلية مدمجة كمصادر؛ منطق FMB الداخلي يتطلب ملفات Oracle الأصلية**.
