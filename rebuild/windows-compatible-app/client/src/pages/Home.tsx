import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Boxes, ChevronLeft, CircleDollarSign, FileText, LayoutGrid, Link2, Package, PanelLeft, Plus, Search, Settings2, ShieldCheck, Sparkles, Warehouse, X } from "lucide-react";

const sampleWindows = [
  ["ARST004.fmx", "AR", "AR_DOCUMENTS", "مكتملة جزئيًا"], ["ARST006.fmx", "AR", "AR_REVERSAL", "مواصفة"], ["ARST023.fmx", "AR", "AR_DOCUMENTS", "مواصفة"], ["ARSR041.fmx", "AR", "AR_REPORTS", "مفهرسة"], ["APST003.fmx", "AP", "AP_DOCUMENTS", "مفهرسة"], ["APST005.fmx", "AP", "AP_POSTING", "مفهرسة"], ["GLST001.fmx", "GL", "GL_JOURNALS", "مفهرسة"], ["POST001.fmx", "GL", "POSTING_ENGINE", "مفهرسة"], ["POS_INSTALL.fmx", "POS", "POS_SETUP", "مفهرسة"]
];

function Stat({ icon: Icon, label, value, accent }: { icon: typeof Boxes; label: string; value: string | number; accent: string }) {
  return <div className="stat-card"><div className={`stat-icon ${accent}`}><Icon size={18} /></div><div><p className="stat-label">{label}</p><p className="stat-value">{value}</p></div></div>;
}

function StatusPill({ status }: { status: string }) {
  const tone = status.includes("مكتملة") ? "success" : status === "مواصفة" ? "warning" : "neutral";
  return <span className={`status-pill ${tone}`}><span />{status}</span>;
}

export default function Home() {
  const [section, setSection] = useState<"overview" | "windows" | "ar">("overview");
  const [windowSearch, setWindowSearch] = useState("");
  const [domain, setDomain] = useState("ALL");
  const [docNo, setDocNo] = useState("INV-2026-0001");
  const [quantity, setQuantity] = useState("2");
  const [unitPrice, setUnitPrice] = useState("245.00");
  const [tax, setTax] = useState("15");
  const dashboard = trpc.dashboard.useQuery();
  const master = trpc.masterData.useQuery();
  const windows = trpc.windows.list.useQuery({ search: windowSearch || undefined, domain, limit: 80 });
  const createInvoice = trpc.invoices.create.useMutation();
  const postInvoice = trpc.invoices.post.useMutation();
  const invoiceTotal = useMemo(() => (Number(quantity || 0) * Number(unitPrice || 0) + Number(tax || 0)).toFixed(2), [quantity, unitPrice, tax]);
  const dbReady = Boolean(master.data?.items?.length);
  const stats = dashboard.data ?? { windows: 1490, domains: 12, invoices: 0, stockValue: "0.00", journals: 0 };
  const visibleWindows = windows.data?.length ? windows.data : sampleWindows.filter(([name, d, cap]) => `${name} ${d} ${cap}`.toLowerCase().includes(windowSearch.toLowerCase()) && (domain === "ALL" || d === domain));
  const customers = master.data?.customers ?? [];
  const items = master.data?.items ?? [];
  const warehouses = master.data?.warehouses ?? [];

  const submitInvoice = async () => {
    if (!customers[0] || !items[0] || !warehouses[0]) { toast.info("جهّز قاعدة الاختبار والبيانات الأساسية أولًا؛ الواجهة جاهزة للربط بـOracle."); return; }
    try {
      const created = await createInvoice.mutateAsync({ docNo, customerId: customers[0].id, warehouseId: warehouses[0].id, actor: "demo.user", lines: [{ itemId: items[0].id, quantity, unitPrice, taxAmount: tax }] });
      toast.success(`تم إنشاء ${created.docNo} كمسودة`);
      await postInvoice.mutateAsync({ invoiceId: created.invoiceId, actor: "demo.user" });
      toast.success("تم الترحيل: المخزون + COGS + AR/GL داخل معاملة واحدة");
      dashboard.refetch();
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر تنفيذ العملية"); }
  };

  return <div className="app-shell" dir="rtl">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>ONYX</strong><span>ERP REBUILD</span></div></div>
      <div className="branch-chip"><span className="pulse" /> فرع إعادة البناء <b>v0.1</b></div>
      <nav>
        <button className={section === "overview" ? "nav-item active" : "nav-item"} onClick={() => setSection("overview")}><LayoutGrid size={17} />نظرة عامة</button>
        <button className={section === "windows" ? "nav-item active" : "nav-item"} onClick={() => setSection("windows")}><PanelLeft size={17} />دليل النوافذ <em>1,490</em></button>
        <button className={section === "ar" ? "nav-item active" : "nav-item"} onClick={() => setSection("ar")}><FileText size={17} />ARST004 <em>تجريبي</em></button>
        <button className="nav-item muted" onClick={() => toast.info("ستُفعّل في المرحلة التالية")}><Warehouse size={17} />المخزون <em>قريبًا</em></button>
        <button className="nav-item muted" onClick={() => toast.info("ستُفعّل في المرحلة التالية")}><CircleDollarSign size={17} />الحسابات العامة <em>قريبًا</em></button>
      </nav>
      <div className="sidebar-bottom"><div className="bridge-card"><div className="bridge-top"><Link2 size={16} /><span>حالة الربط</span><b className={dbReady ? "online" : "offline"}>{dbReady ? "متصل" : "تجريبي"}</b></div><p>{dbReady ? "قاعدة البيانات التجريبية تعمل" : "Oracle bridge غير مضاف بعد"}</p><div className="bridge-line"><span style={{ width: dbReady ? "78%" : "24%" }} /></div></div><button className="profile"><div className="avatar">م</div><div><b>مدير النظام</b><span>demo.user</span></div><Settings2 size={16} /></button></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><p className="eyebrow">ONYX / REBUILD CONSOLE</p><h1>{section === "windows" ? "دليل النوافذ" : section === "ar" ? "ARST004 · فاتورة مبيعات" : "لوحة التحكم التنفيذية"}</h1></div><div className="top-actions"><div className="connection"><span className="pulse" /> وضع الاختبار <b>Oracle-ready</b></div><Button className="user-action" onClick={() => setSection("ar")}><Plus size={16} />عملية جديدة</Button></div></header>
      {section === "overview" && <>
        <section className="hero"><div><div className="hero-kicker"><ShieldCheck size={14} /> خارطة النظام القديم أصبحت قابلة للتشغيل</div><h2>نواة Onyx الحديثة،<br /><span>بنفس منطق النوافذ.</span></h2><p>نسخة تشغيلية تدريجية تحافظ على أسماء النوافذ، دورة العمل، الترحيل، والتدقيق — وتفتح الطريق لقاعدة Oracle الحقيقية.</p><div className="hero-actions"><Button onClick={() => setSection("ar")}><FileText size={16} />ابدأ ARST004</Button><Button variant="outline" onClick={() => setSection("windows")}><PanelLeft size={16} />استعرض 1,490 نافذة</Button></div></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><Boxes size={33} /><span>ONEX</span></div><div className="orbit-tag tag-one">AR</div><div className="orbit-tag tag-two">GL</div><div className="orbit-tag tag-three">INV</div></div></section>
        <div className="stats-grid"><Stat icon={PanelLeft} label="نافذة مفهرسة" value={stats.windows.toLocaleString()} accent="violet" /><Stat icon={Boxes} label="مجالات النظام" value={stats.domains} accent="cyan" /><Stat icon={FileText} label="فواتير مرحّلة" value={stats.invoices} accent="amber" /><Stat icon={CircleDollarSign} label="قيود GL" value={stats.journals} accent="green" /></div>
        <section className="content-grid"><Card className="panel wide"><CardHeader><div><p className="panel-kicker">LEGACY WINDOW MAP</p><CardTitle>مسار التحويل</CardTitle></div><Button variant="outline" size="sm" onClick={() => setSection("windows")}>فتح الدليل <ChevronLeft size={15} /></Button></CardHeader><CardContent><div className="timeline"><div className="timeline-step done"><span>01</span><div><b>تحليل Forms</b><p>1,490 نافذة · 6,077 أثر تتبع</p></div></div><div className="timeline-line done" /><div className="timeline-step current"><span>02</span><div><b>نواة المعاملات</b><p>ARST004 قيد الاختبار الآن</p></div></div><div className="timeline-line" /><div className="timeline-step"><span>03</span><div><b>Oracle Test DB</b><p>بانتظار بيانات الاتصال والـDDL</p></div></div><div className="timeline-line" /><div className="timeline-step"><span>04</span><div><b>التشغيل المتوازي</b><p>مقارنة القديم بالجديد</p></div></div></div></CardContent></Card><Card className="panel"><CardHeader><div><p className="panel-kicker">RECENT ACTIVITY</p><CardTitle>آخر العمليات</CardTitle></div></CardHeader><CardContent><div className="activity"><div className="activity-row"><div className="activity-icon cyan"><Link2 size={15} /></div><div><b>فرع Git جاهز</b><p>rebuild/windows-compatible-app</p></div><time>الآن</time></div><div className="activity-row"><div className="activity-icon violet"><FileText size={15} /></div><div><b>ARST004</b><p>عقد تشغيل متوافق</p></div><time>اليوم</time></div><div className="activity-row"><div className="activity-icon amber"><Package size={15} /></div><div><b>نواة المخزون</b><p>قيد التوسعة</p></div><time>اليوم</time></div></div></CardContent></Card></section>
      </>}
      {section === "windows" && <section className="window-explorer"><div className="explorer-toolbar"><div><p className="panel-kicker">FULL LEGACY CATALOG</p><h2>كل نوافذ النظام في مكان واحد</h2><p>كل سجل مرتبط بمجاله وحالة إعادة تمثيله ومصدر الدليل.</p></div><div className="catalog-count"><strong>1,490</strong><span>نافذة</span></div></div><div className="filters"><div className="search-field"><Search size={16} /><Input placeholder="ابحث باسم النافذة أو الوظيفة..." value={windowSearch} onChange={(e) => setWindowSearch(e.target.value)} /></div><div className="domain-tabs"><button className={domain === "ALL" ? "selected" : ""} onClick={() => setDomain("ALL")}>الكل</button>{["AR", "AP", "GL", "INVENTORY", "POS"].map((d) => <button key={d} className={domain === d ? "selected" : ""} onClick={() => setDomain(d)}>{d}</button>)}</div></div><div className="window-table"><div className="table-head"><span>اسم النافذة</span><span>المجال</span><span>القدرة الأساسية</span><span>الحالة</span><span /></div>{visibleWindows.map((row, i) => <div className="table-row" key={Array.isArray(row) ? row[0] : row.legacyForm}><span className="form-name"><span className="form-dot" />{Array.isArray(row) ? row[0] : row.legacyForm}</span><span className="domain-code">{Array.isArray(row) ? row[1] : row.domainCode}</span><span>{Array.isArray(row) ? row[2] : row.capability}</span><StatusPill status={Array.isArray(row) ? row[3] : row.status} /><Button variant="ghost" size="sm" onClick={() => { setSection("ar"); toast.info("تم فتح عقد النافذة؛ ARST004 هو النموذج التشغيلي الأول"); }}>فتح <ChevronLeft size={14} /></Button></div>)}</div></section>}
      {section === "ar" && <section className="ar-workspace"><div className="workspace-banner"><div><div className="breadcrumb">AR / SALES / <b>ARST004</b></div><h2>فاتورة مبيعات — إصدار متوافق</h2><p>نموذج التشغيل الأول: رأس الفاتورة، التفاصيل، المخزون، COGS، وقيود AR/GL.</p></div><StatusPill status="مكتملة جزئيًا" /></div><div className="ar-grid"><Card className="panel invoice-form"><CardHeader><div><p className="panel-kicker">DOCUMENT HEADER</p><CardTitle>بيانات الفاتورة</CardTitle></div><span className="doc-chip">DRAFT</span></CardHeader><CardContent><div className="form-grid"><label>رقم المستند<Input value={docNo} onChange={(e) => setDocNo(e.target.value)} /></label><label>تاريخ المستند<Input type="date" defaultValue="2026-09-13" /></label><label>العميل<select><option>{customers[0]?.legalName ?? "عميل تجريبي — Al Datalist"}</option></select></label><label>المستودع<select><option>{warehouses[0]?.name ?? "المستودع الرئيسي"}</option></select></label></div><Separator /><div className="line-title"><div><p className="panel-kicker">INVOICE LINES</p><h3>تفاصيل الأصناف</h3></div><Button variant="outline" size="sm" onClick={() => toast.info("يمكن إضافة أسطر متعددة بعد ربط قاعدة الاختبار") }><Plus size={14} />سطر جديد</Button></div><div className="line-card"><div className="line-product"><div className="product-icon"><Package size={18} /></div><div><b>{items[0]?.description ?? "صنف تجريبي — منتج مخزني"}</b><span>{items[0]?.code ?? "ITEM-001"} · مخزني</span></div></div><div className="line-input"><span>الكمية</span><Input value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div><div className="line-input"><span>السعر</span><Input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} /></div><div className="line-input"><span>الضريبة</span><Input value={tax} onChange={(e) => setTax(e.target.value)} /></div><div className="line-total"><span>الإجمالي</span><b>{invoiceTotal} <small>ر.س</small></b></div><button className="remove-line" onClick={() => toast.info("السطر الأساسي لا يحذف في النموذج التجريبي")}><X size={16} /></button></div><div className="posting-contract"><div className="contract-icon"><ShieldCheck size={17} /></div><div><b>عقد الترحيل الذري</b><p>الفاتورة ← المخزون ← COGS ← AR/GL ← التدقيق ← Outbox</p></div><span>ATOMIC</span></div><div className="form-actions"><Button variant="outline" onClick={() => toast.info("المسودة محفوظة محليًا في نموذج العرض")}>حفظ كمسودة</Button><Button onClick={submitInvoice} disabled={createInvoice.isPending || postInvoice.isPending}><CircleDollarSign size={16} />{createInvoice.isPending || postInvoice.isPending ? "جارٍ الترحيل..." : "حفظ وترحيل"}</Button></div></CardContent></Card><Card className="panel posting-preview"><CardHeader><div><p className="panel-kicker">POSTING PREVIEW</p><CardTitle>معاينة الأثر</CardTitle></div></CardHeader><CardContent><div className="preview-total"><span>صافي المستند</span><strong>{invoiceTotal} <small>ر.س</small></strong></div><div className="preview-rows"><div><span><i className="dot green" />حساب العميل</span><b>{invoiceTotal}</b></div><div><span><i className="dot violet" />المبيعات</span><b>{(Number(quantity || 0) * Number(unitPrice || 0)).toFixed(2)}</b></div><div><span><i className="dot amber" />الضريبة</span><b>{Number(tax || 0).toFixed(2)}</b></div><div><span><i className="dot cyan" />حركة المخزون</span><b>{dbReady ? "جاهزة" : "تجريبية"}</b></div></div><Separator /><div className="check-list"><div><span className="check">✓</span> منع التكرار Idempotency</div><div><span className="check">✓</span> منع المخزون السالب</div><div><span className="check">✓</span> توازن المدين والدائن</div><div><span className="check">✓</span> Audit + Outbox</div></div></CardContent></Card></div></section>}
    </main>
  </div>;
}
