import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Archive,
  BarChart3,
  BookOpen,
  Box,
  Calculator,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  FileBarChart,
  FilePlus2,
  FolderTree,
  GripVertical,
  LayoutDashboard,
  Menu,
  Minus,
  Package,
  PanelLeft,
  Plus,
  Printer,
  Receipt,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

type ModuleKey = "admin" | "finance" | "sales" | "purchasing" | "inventory" | "hr" | "pos" | "reports";
type WindowRecord = { id: string; label: string; module: ModuleKey; kind: "transaction" | "inquiry" | "report" };
type OpenWindow = WindowRecord & { minimized?: boolean };

const modules: Array<{ id: ModuleKey; label: string; code: string; icon: typeof Settings2; windows: WindowRecord[] }> = [
  { id: "admin", label: "الإدارة والنظام", code: "ADMIN", icon: Settings2, windows: [{ id: "ERP_DBA", label: "إدارة النظام", module: "admin", kind: "transaction" }, { id: "ADMT027", label: "المستخدمون والصلاحيات", module: "admin", kind: "transaction" }] },
  { id: "finance", label: "الحسابات العامة", code: "GL", icon: Calculator, windows: [{ id: "GLST001", label: "دليل الحسابات", module: "finance", kind: "transaction" }, { id: "GLST002", label: "القيد اليومي", module: "finance", kind: "transaction" }, { id: "GLSI001", label: "استعلام القيود", module: "finance", kind: "inquiry" }] },
  { id: "sales", label: "المبيعات والعملاء", code: "AR", icon: Receipt, windows: [{ id: "ARST003", label: "تعريف العملاء", module: "sales", kind: "transaction" }, { id: "ARST004", label: "فاتورة المبيعات", module: "sales", kind: "transaction" }, { id: "ARSR041", label: "كشف حساب عميل", module: "sales", kind: "report" }] },
  { id: "purchasing", label: "المشتريات والموردون", code: "AP", icon: ShoppingCart, windows: [{ id: "APST003", label: "فاتورة المشتريات", module: "purchasing", kind: "transaction" }, { id: "APSI002", label: "الموردون", module: "purchasing", kind: "transaction" }] },
  { id: "inventory", label: "المخزون", code: "INV", icon: Package, windows: [{ id: "INVT003", label: "بطاقة الصنف", module: "inventory", kind: "transaction" }, { id: "INVT004", label: "حركة المخزون", module: "inventory", kind: "inquiry" }] },
  { id: "hr", label: "الموارد البشرية", code: "HR", icon: Users, windows: [{ id: "HRSI002", label: "ملف الموظف", module: "hr", kind: "transaction" }, { id: "HRSR002", label: "تقارير الموظفين", module: "hr", kind: "report" }] },
  { id: "pos", label: "نقطة البيع", code: "POS", icon: LayoutDashboard, windows: [{ id: "POSLGN", label: "تشغيل نقطة البيع", module: "pos", kind: "transaction" }, { id: "POST001", label: "مبيعات نقطة البيع", module: "pos", kind: "transaction" }] },
  { id: "reports", label: "التقارير", code: "RPT", icon: FileBarChart, windows: [{ id: "GLSR001", label: "تقارير الحسابات", module: "reports", kind: "report" }, { id: "MRPREP001", label: "تقارير التخطيط والمخزون", module: "reports", kind: "report" }] },
];

const kindLabel = { transaction: "معاملة", inquiry: "استعلام", report: "تقرير" };

function WindowBody({ window }: { window: WindowRecord }) {
  const rows = window.kind === "report" ? ["الفترة", "الفرع", "الحساب / المجموعة", "طريقة العرض"] : ["رقم المستند", "التاريخ", "الحالة", "ملاحظات"];
  return (
    <div className="legacy-window-body">
      <div className="legacy-form-toolbar">
        <button title="جديد"><FilePlus2 size={15} /></button><button title="حفظ"><Archive size={15} /></button><button title="طباعة"><Printer size={15} /></button><span className="toolbar-separator" /><button title="بحث"><Search size={15} /></button><button title="مساعدة"><CircleHelp size={15} /></button>
      </div>
      <div className="legacy-form-caption"><span>{window.label}</span><code>{window.id}</code></div>
      <div className="legacy-form-fields">
        {rows.map((label, index) => <label key={label}><span>{label}</span>{index === 2 ? <select defaultValue="all"><option value="all">الكل</option><option>الرئيسي</option><option>فرع صنعاء</option></select> : <input placeholder={index === 0 ? `${window.id}-000001` : index === 1 ? "2026/09/13" : ""} />}</label>)}
      </div>
      <div className="legacy-grid"><div className="legacy-grid-head"><span>#</span><span>البيان</span><span>القيمة</span><span>الحالة</span></div>{["السجل الأساسي", "التفاصيل والقيود", "الأثر المحاسبي"].map((item, i) => <div className="legacy-grid-row" key={item}><span>{i + 1}</span><span>{item}</span><span>{i === 2 ? "0.00" : "—"}</span><span className="state-ready">جاهز</span></div>)}</div>
      <div className="legacy-form-footer"><span>F10 حفظ</span><span>F7 بحث</span><span>Esc إلغاء</span><strong>نواة العمليات الذرية: قيد المعاملة ← تدقيق ← Outbox</strong></div>
    </div>
  );
}

export default function WindowWorkbench() {
  const [, setLocation] = useLocation();
  const [expanded, setExpanded] = useState<ModuleKey | null>("finance");
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([{ ...modules[1].windows[0] }]);
  const [activeId, setActiveId] = useState("GLST001");
  const [query, setQuery] = useState("");
  const [sidebar, setSidebar] = useState(true);

  const filteredModules = useMemo(() => modules.map((module) => ({ ...module, windows: module.windows.filter((w) => `${w.id} ${w.label}`.toLowerCase().includes(query.toLowerCase())) })).filter((module) => module.windows.length || module.label.includes(query)), [query]);
  const active = openWindows.find((window) => window.id === activeId) ?? openWindows[0];

  function openWindow(window: WindowRecord) {
    setOpenWindows((current) => current.some((item) => item.id === window.id) ? current.map((item) => item.id === window.id ? { ...item, minimized: false } : item) : [...current, window]);
    setActiveId(window.id);
  }
  function closeWindow(id: string) {
    setOpenWindows((current) => current.filter((item) => item.id !== id));
    setActiveId((current) => current === id ? (openWindows.find((item) => item.id !== id)?.id ?? "") : current);
  }

  return <div className="workbench-shell" dir="rtl">
    <header className="workbench-menubar"><button className="workbench-brand" onClick={() => setLocation("/")}><span className="brand-mark">ON</span><span><b>YS ERP</b><small>Oracle Forms Workbench</small></span></button><button className="menubar-item"><Menu size={15} /> النظام</button><button className="menubar-item"><FolderTree size={15} /> النوافذ</button><button className="menubar-item"><FileBarChart size={15} /> التقارير</button><button className="menubar-item"><Settings2 size={15} /> الإعدادات</button><span className="menubar-spacer" /><span className="connection-state"><i /> متصل بالنواة</span><button className="icon-button" title="مساعدة"><CircleHelp size={17} /></button></header>
    <div className="workbench-toolbar"><button className="toolbar-main" onClick={() => setSidebar((v) => !v)}><PanelLeft size={16} /> شجرة النظام</button><span className="toolbar-path">النظام الرئيسي <ChevronLeft size={14} /> مساحة تشغيل النوافذ</span><span className="toolbar-spacer" /><label className="window-search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث عن نافذة أو رمز..." /></label><button className="icon-button"><GripVertical size={16} /></button></div>
    <div className="workbench-layout">
      {sidebar && <aside className="workbench-sidebar"><div className="sidebar-title"><div><span>قائمة النظام</span><small>MODULE NAVIGATOR</small></div><button className="icon-button"><ChevronDown size={15} /></button></div><div className="tree-root"><BookOpen size={17} /><div><b>YS Enterprise Resource Planning</b><small>الإصدار 6.20 · بيئة التشغيل</small></div></div>{filteredModules.map((module) => { const Icon = module.icon; const isOpen = expanded === module.id; return <div className="module-tree" key={module.id}><button className="module-row" onClick={() => setExpanded(isOpen ? null : module.id)}><Icon size={16} /><span><b>{module.label}</b><small>{module.code} · {module.windows.length} نوافذ معروضة</small></span>{isOpen ? <ChevronDown size={15} /> : <ChevronLeft size={15} />}</button>{isOpen && <div className="module-children">{module.windows.map((window) => <button key={window.id} className={`tree-window ${activeId === window.id ? "selected" : ""}`} onClick={() => openWindow(window)}><span className="window-dot" /><span><b>{window.label}</b><small>{window.id} · {kindLabel[window.kind]}</small></span><Plus size={13} /></button>)}</div>}</div>})}</aside>}
      <main className="workbench-main"><div className="open-tabs">{openWindows.map((window) => <button key={window.id} className={`open-tab ${activeId === window.id ? "active" : ""}`} onClick={() => setActiveId(window.id)}><span className="tab-icon"><Box size={13} /></span><span>{window.id}</span><X size={13} onClick={(event) => { event.stopPropagation(); closeWindow(window.id); }} /></button>)}<span className="open-tabs-spacer" /><span className="session-label"><ShieldCheck size={14} /> جلسة آمنة</span></div><div className="window-stage">{active ? <section className="legacy-window"><div className="legacy-titlebar"><div><span className="legacy-app-icon"><Calculator size={14} /></span><b>{active.label}</b><small>{active.id} · {kindLabel[active.kind]}</small></div><div className="legacy-controls"><button onClick={() => setOpenWindows((items) => items.map((item) => item.id === active.id ? { ...item, minimized: true } : item))}><Minus size={14} /></button><button onClick={() => closeWindow(active.id)}><X size={14} /></button></div></div><WindowBody window={active} /></section> : <div className="empty-workbench"><LayoutDashboard size={44} /><h2>مساحة تشغيل النظام</h2><p>اختر نافذة من شجرة النظام لفتحها في جلسة العمل.</p></div>}</div><footer className="workbench-status"><span><i className="status-green" /> جاهز</span><span>المستخدم: administrator</span><span>الفرع: الرئيسي</span><span className="status-spacer" /><span>F4 قائمة النوافذ</span><span>F10 حفظ</span><span>الإصدار 6.20</span></footer></main>
    </div>
  </div>;
}
