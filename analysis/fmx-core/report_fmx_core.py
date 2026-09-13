#!/usr/bin/env python3
import json
from pathlib import Path
A=Path('/tmp/fmx-review/analysis')
core=json.loads((A/'fmx_core_windows.json').read_text(encoding='utf-8'))
summary=json.loads((A/'fmx_summary.json').read_text(encoding='utf-8'))
lines=['# تحليل ملفات FMX — النوافذ الأساسية','', '## النتيجة التنفيذية','',f"تم تحليل **{summary['forms']:,} ملف FMX**. جرى تحديد **{summary['core_forms']} نافذة أساسية أو إدارية** للتحليل التفصيلي. ملفات FMX مترجمة، ولذلك يصف هذا التقرير البنية القابلة للاستخراج ويصنف المنطق الظاهر، ولا يدّعي استعادة المصدر الأصلي الكامل لكل Trigger أو Package.",'', '## النوافذ الأساسية المحللة','', '| النافذة | الوحدة | الحجم | السلاسل | المكتبات | الوحدات البرمجية | مراجع الجداول | SQL ظاهر | عناصر مرشحة |','|---|---|---:|---:|---:|---:|---:|---:|---:|']
for x in core:
 lines.append(f"| `{x['id']}` | {x['category']} | {x['bytes']:,} | {x['string_count']:,} | {len(x['libraries'])} | {len(x['program_units'])} | {len(x['table_references'])} | {len(x['sql_fragments'])} | {len(x['candidate_items_and_blocks'])} |")
lines += ['', '## قراءة الهيكل المستخرج','', '> يتكرر في معظم النوافذ نمط Oracle Forms القياسي: مكتبة مشتركة، حزمة تهيئة، معالجات قبل فتح النموذج وبعده، ثم أزرار العرض والطباعة والإلغاء. هذا النمط هو أساس النواة الذرية في تطبيق الويب.', '', '| النمط | الدلالة في النظام القديم | المقابل المقترح في Web |','|---|---|---|','| `GEN_PKG` / `FUNC_PKG` | مكتبة أو حزمة وظائف مشتركة | طبقة خدمات ومساعدات مشتركة |','| `/NSPC.../PRE_FORM_PRC` | تحقق وتجهيز قبل فتح النافذة | `beforeOpen()` |','| `/NSPC.../WHEN_NEW_FORM_INSTANCE_PRC` | تهيئة الحالة والسياق | `onInit()` |','| `/NSPC.../POST_FORMS_COMMIT_PRC` | إجراءات بعد الحفظ | `afterCommit()` |','| `/NSPC.../EXIT_PROC` | الخروج والتنظيف | `onClose()` |','| `VIEW_BTN`, `SCREEN_BTN`, `PRINT_DOC_BTN`, `CANCEL_BTN` | أدوات تشغيل متكررة | شريط أدوات موحد |','| SQL ظاهر داخل FMX | استعلامات اختيار/تهيئة/تحقق | API/استعلام typed في الخادم |']
for x in core:
 lines += ['', f"## `{x['id']}`", '', f"**الوحدة:** {x['category']}  \n**الملف:** `{x['file']}`  \n**الحجم:** {x['bytes']:,} بايت  \n**عدد السلاسل القابلة للاستخراج:** {x['string_count']:,}", '', '### المكتبات والبرامج المرئية']
 lines += [f'- `{v}`' for v in x['libraries'][:30]] or ['- لا توجد مكتبات مرئية في العينة']
 lines += ['', '### معالجات وأسماء الوحدات المرئية']
 lines += [f'- `{v}`' for v in x['triggers_and_handlers'][:30]] or ['- لم تُستخرج معالجات مسماة مباشرة']
 lines += ['', '### الجداول المشار إليها']
 lines += [f'- `{v}`' for v in x['table_references'][:40]] or ['- لم يُستخرج اسم جدول صريح']
 lines += ['', '### عينات SQL أو نصوص منطقية']
 lines += [f'> `{v[:240]}`' for v in x['sql_fragments'][:8]] or ['- لا توجد SQL واضحة في الملف']
 lines += ['', '### عناصر وكتل مرشحة']
 lines += [f'`{v}`' for v in x['candidate_items_and_blocks'][:80]]
lines += ['', '## الملفات الناتجة','', '| الملف | الاستخدام |','|---|---|','| `fmx_windows.json` | التفاصيل الكاملة لجميع النوافذ |','| `fmx_core_windows.json` | التفاصيل التفصيلية للنوافذ الأساسية |','| `fmx_window_summary.csv` | سجل مسطح لاستيراد البيانات |','| `fmx_navigation_edges.csv` | علاقات المرشحين بين النوافذ حسب المكتبات والجداول |','| `fmx_module_summary.json` | ملخص الوحدات والجداول والمكتبات المتكررة |','| `fmx_summary.json` | أرقام التحليل الآلي |','', '## حدود الثقة','', 'العلاقات الناتجة من المكتبات أو الجداول هي علاقات مشاركة واعتماد وليست بالضرورة انتقالًا مباشرًا من نافذة إلى أخرى. يلزم تأكيد التنقل المباشر من ملف القائمة `MMX` أو من تشغيل النظام القديم. كما أن أسماء العناصر المستخرجة من FMX مصنفة كمرشحة حتى تُراجع مع شاشة فعلية أو ملف مصدر FMB.']
(A/'FMX_CORE_ANALYSIS_AR.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(A/'FMX_CORE_ANALYSIS_AR.md')
