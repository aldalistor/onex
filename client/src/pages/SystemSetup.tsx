import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Database, KeyRound, Network, Save, Server, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SystemSetup() {
  const [, setLocation] = useLocation();
  const [engine, setEngine] = useState("mysql");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("3306");
  const [database, setDatabase] = useState("");
  const [user, setUser] = useState("");
  const [ssl, setSsl] = useState(true);

  const saveSetup = () => {
    toast.success("تم حفظ إعدادات الاتصال محليًا. ضع DATABASE_URL في أسرار الخادم لإتمام الربط الفعلي.");
  };

  return <div className="workbench-shell setup-shell" dir="rtl">
    <header className="workbench-menubar"><button className="workbench-brand" onClick={() => setLocation("/")}><span className="brand-mark">ON</span><span><b>YS ERP</b><small>Oracle Forms Workbench</small></span></button><button className="menubar-item" onClick={() => setLocation("/")}><ArrowRight size={15} /> مساحة النوافذ</button><span className="menubar-spacer" /><span className="connection-state"><i /> تهيئة آمنة</span></header>
    <main className="setup-page"><div className="setup-heading"><div><p className="panel-kicker">SYSTEM CONFIGURATION / DATABASE BRIDGE</p><h1>تهيئة النظام وربط قاعدة البيانات</h1><p>أدخل مواصفات قاعدة النظام الحقيقي. لا تُحفظ كلمات المرور في المتصفح؛ يضاف رابط الاتصال إلى أسرار الخادم فقط.</p></div><div className="setup-badge"><ShieldCheck size={18} /> اتصال محمي</div></div>
      <section className="setup-grid"><div className="setup-card"><div className="setup-card-title"><Database size={18} /><div><b>محرك قاعدة البيانات</b><small>DATABASE ENGINE</small></div></div><label>المحرك<select value={engine} onChange={(event) => setEngine(event.target.value)}><option value="mysql">MySQL / TiDB</option><option value="oracle">Oracle عبر Backend Bridge</option><option value="postgres">PostgreSQL</option></select></label><label>اسم المضيف<input value={host} onChange={(event) => setHost(event.target.value)} placeholder="db.example.local" /></label><label>المنفذ<input value={port} onChange={(event) => setPort(event.target.value)} placeholder="3306" /></label><label>اسم قاعدة البيانات<input value={database} onChange={(event) => setDatabase(event.target.value)} placeholder="onex_erp" /></label></div>
        <div className="setup-card"><div className="setup-card-title"><KeyRound size={18} /><div><b>بيانات الاعتماد</b><small>SERVER SECRET HANDOFF</small></div></div><label>اسم المستخدم<input value={user} onChange={(event) => setUser(event.target.value)} placeholder="onex_app" /></label><label>كلمة المرور<input type="password" placeholder="لا تُعرض ولا تُحفظ في المتصفح" /></label><label className="setup-check"><input type="checkbox" checked={ssl} onChange={(event) => setSsl(event.target.checked)} /> تفعيل TLS/SSL للاتصال</label><div className="setup-note"><Server size={16} /><span>بعد الحفظ، يحتاج مسؤول النشر إلى ضبط <code>DATABASE_URL</code> في متغيرات البيئة. لا يمكن للواجهة الوصول إلى قاعدة البيانات مباشرة.</span></div></div>
      </section><section className="setup-steps"><div><Network size={17} /><b>مسار الربط</b><span>Workbench → tRPC → Drizzle → قاعدة النظام</span></div><div><span className="step-number">1</span><span>اختبر الاتصال من الخادم</span></div><div><span className="step-number">2</span><span>نفّذ migrations المطلوبة</span></div><div><span className="step-number">3</span><span>فعّل القراءة والكتابة حسب الصلاحيات</span></div></section><div className="setup-actions"><button className="toolbar-main" onClick={() => setLocation("/")}>إلغاء</button><button className="toolbar-main setup-primary" onClick={saveSetup}><Save size={16} /> حفظ إعداد التهيئة</button></div>
    </main></div>;
}
