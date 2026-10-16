import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  BarChart3,
  Check,
  CheckCheck,
  Cog,
  Factory,
  FileText,
  Gauge,
  Image as ImageIcon,
  Inbox,
  Layers3,
  Loader2,
  Mail,
  PackageSearch,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  useCreateBrand,
  useCreateCategory,
  useCreatePost,
  useCreateProduct,
  useCreateSector,
  useCreateSiteSection,
  useCreateSlider,
  useDeleteBrand,
  useDeleteCategory,
  useDeletePost,
  useDeleteProduct,
  useDeleteSector,
  useDeleteSiteSection,
  useDeleteSlider,
  useGetAdminSettings,
  useGetAdminSummary,
  useListAdminBrands,
  useListAdminCategories,
  useListAdminContactMessages,
  useListAdminPosts,
  useListAdminProducts,
  useListAdminSectors,
  useListAdminSiteSections,
  useListAdminSliders,
  useUpdateAdminSettings,
  useUpdateBrand,
  useUpdateCategory,
  useUpdateContactMessage,
  useUpdatePost,
  useUpdateProduct,
  useUpdateSector,
  useUpdateSiteSection,
  useUpdateSlider,
} from "@workspace/api-client-react";
import type { AdminSetting } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-6"><h2 className="font-display text-lg font-semibold">{title}</h2><div className="mt-5 space-y-4">{children}</div></div>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>{hint && <span className="ml-2 text-xs text-muted-foreground/70">{hint}</span>}<div className="mt-1.5">{children}</div></label>;
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary";

function Row({ children, onEdit, onDelete, editing }: { children: React.ReactNode; onEdit?: () => void; onDelete?: () => void; editing?: boolean }) {
  return <div className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${editing ? "border-primary" : "border-border"}`}><div className="min-w-0 flex-1">{children}</div><div className="flex shrink-0 gap-2">{onEdit && <button type="button" onClick={onEdit} className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-primary" title="Düzenle"><Pencil size={15} /></button>}{onDelete && <button type="button" onClick={onDelete} className="rounded-md p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-600" title="Sil"><Trash2 size={15} /></button>}</div></div>;
}

// ---------------------------------------------------------------------------
// Sliders
// ---------------------------------------------------------------------------

function SlidersAdmin() {
  const list = useListAdminSliders();
  const create = useCreateSlider();
  const update = useUpdateSlider();
  const del = useDeleteSlider();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [href, setHref] = useState("");
  const [placement, setPlacement] = useState("hero");
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/sliders"] }); qc.invalidateQueries({ queryKey: ["/admin/sliders"] }); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !image) return;
    const payload = { title, subtitle, image, href: href || "", placement, position: 0 };
    if (editingId) {
      await update.mutateAsync({ id: Number(editingId), data: payload });
      setEditingId(null);
    } else {
      await create.mutateAsync({ data: payload });
    }
    setTitle(""); setSubtitle(""); setImage(""); setHref(""); setPlacement("hero");
    invalidate();
  };

  const rows = (list.data ?? []).slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  return <div className="space-y-6">
    <Section title={editingId ? "Sliderı düzenle" : "Yeni hero slider"}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Başlık"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Koyo Japon teknolojisi rulmanları" required /></Field>
        <Field label="Yerleşim"><select className={inputCls} value={placement} onChange={(e) => setPlacement(e.target.value)}><option value="hero">Hero (ana sayfa)</option></select></Field>
        <Field label="Görsel yolu" hint="/hero/..."><input className={inputCls} value={image} onChange={(e) => setImage(e.target.value)} placeholder="/hero/slide-koyo.jpg" required /></Field>
        <Field label="Hedef bağlantı"><input className={inputCls} value={href} onChange={(e) => setHref(e.target.value)} placeholder="/kataloglar/teknik/koyo" /></Field>
        <div className="sm:col-span-2"><Field label="Alt başlık (opsiyonel)"><input className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="" /></Field></div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
          <button type="submit" disabled={create.isPending || update.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={15} /> {editingId ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </Section>
    <Section title={`Hero sliderlar (${rows.length})`}>
      <div className="space-y-2.5">
        {rows.map((s) => <Row key={s.id} editing={editingId === s.id} onEdit={() => { setEditingId(s.id); setTitle(s.title); setSubtitle(s.subtitle ?? ""); setImage(s.image); setHref(s.href ?? ""); setPlacement(s.placement ?? "hero"); }} onDelete={() => { if (confirm(`"${s.title}" sliderını sil?`)) { del.mutate({ id: Number(s.id) }, { onSuccess: invalidate }); } }}>
          <div className="flex items-center gap-4"><div className="h-14 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40"><img src={s.image} alt="" className="h-full w-full object-cover" /></div><div><p className="font-semibold">{s.title}</p><p className="mt-0.5 text-xs text-muted-foreground">#{s.position ?? 0} · {s.href || "bağlantı yok"}</p></div></div>
        </Row>)}
        {rows.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Henüz slider yok. Yukarıdan ilk sliderı ekleyin.</p>}
      </div>
    </Section>
  </div>;
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

function PostsAdmin() {
  const list = useListAdminPosts();
  const create = useCreatePost();
  const update = useUpdatePost();
  const del = useDeletePost();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Teknik bilgi");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [readTime, setReadTime] = useState(4);
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/posts"] }); qc.invalidateQueries({ queryKey: ["/admin/posts"] }); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const payload = { title, tag, excerpt, body, readTime };
    if (editingId) {
      await update.mutateAsync({ id: Number(editingId), data: payload });
      setEditingId(null);
    } else {
      await create.mutateAsync({ data: payload });
    }
    setTitle(""); setTag("Teknik bilgi"); setExcerpt(""); setBody(""); setReadTime(4);
    invalidate();
  };

  return <div className="space-y-6">
    <Section title={editingId ? "Yazıyı düzenle" : "Yeni blog yazısı"}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Başlık"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
        <Field label="Etiket"><input className={inputCls} value={tag} onChange={(e) => setTag(e.target.value)} /></Field>
        <Field label="Okuma süresi (dk)"><input type="number" min={1} max={120} className={inputCls} value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} /></Field>
        <Field label="Özet"><input className={inputCls} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /></Field>
        <div className="sm:col-span-2"><Field label="İçerik"><textarea rows={8} className={inputCls} value={body} onChange={(e) => setBody(e.target.value)} /></Field></div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
          <button type="submit" disabled={create.isPending || update.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={15} /> {editingId ? "Güncelle" : "Yayınla"}</button>
        </div>
      </form>
    </Section>
    <Section title={`Blog yazıları (${(list.data ?? []).length})`}>
      <div className="space-y-2.5">
        {(list.data ?? []).map((p) => <Row key={p.id} editing={editingId === p.id} onEdit={() => { setEditingId(p.id); setTitle(p.title); setTag(p.tag ?? "Teknik bilgi"); setExcerpt(p.excerpt ?? ""); setBody(p.body ?? ""); setReadTime(p.readTime ?? 4); }} onDelete={() => { if (confirm(`"${p.title}" yazısını sil?`)) { del.mutate({ id: Number(p.id) }, { onSuccess: invalidate }); } }}>
          <div><p className="font-semibold">{p.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{p.tag} · {p.readTime} dk · {new Date(p.createdAt).toLocaleDateString("tr-TR")}</p></div>
        </Row>)}
      </div>
    </Section>
  </div>;
}

// ---------------------------------------------------------------------------
// Simple item CRUD (brands / categories / sectors)
// ---------------------------------------------------------------------------

function SimpleItemsAdmin({ kind }: { kind: "brand" | "category" | "sector" }) {
  const listBrands = useListAdminBrands();
  const listCats = useListAdminCategories();
  const listSectors = useListAdminSectors();
  const createBrand = useCreateBrand();
  const createCat = useCreateCategory();
  const createSector = useCreateSector();
  const updateBrand = useUpdateBrand();
  const updateCat = useUpdateCategory();
  const updateSector = useUpdateSector();
  const delBrand = useDeleteBrand();
  const delCat = useDeleteCategory();
  const delSector = useDeleteSector();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [position, setPosition] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const data = kind === "brand" ? (listBrands.data ?? []) : kind === "category" ? (listCats.data ?? []) : (listSectors.data ?? []);
  const labels = { brand: "Marka", category: "Kategori", sector: "Sektör" }[kind];

  const invalidate = () => {
    const key = kind === "brand" ? "/admin/brands" : kind === "category" ? "/admin/categories" : "/admin/sectors";
    qc.invalidateQueries({ queryKey: [key] });
    qc.invalidateQueries({ queryKey: ["/sectors"] });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const common = { name, description };
    if (kind === "brand") {
      const payload = { ...common, logoUrl };
      if (editingId) { await updateBrand.mutateAsync({ id: Number(editingId), data: payload }); } else { await createBrand.mutateAsync({ data: payload }); }
    } else if (kind === "category") {
      if (editingId) { await updateCat.mutateAsync({ id: Number(editingId), data: common }); } else { await createCat.mutateAsync({ data: common }); }
    } else {
      const payload = { ...common, position };
      if (editingId) { await updateSector.mutateAsync({ id: Number(editingId), data: payload }); } else { await createSector.mutateAsync({ data: payload }); }
    }
    setName(""); setDescription(""); setLogoUrl(""); setPosition(0); setEditingId(null);
    invalidate();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description ?? "");
    if (kind === "brand") setLogoUrl(item.logoUrl ?? "");
    if (kind === "sector") setPosition(item.position ?? 0);
  };

  const remove = (id: string, itemName: string) => {
    if (!confirm(`"${itemName}" öğesini sil?`)) return;
    if (kind === "brand") delBrand.mutate({ id: Number(id) }, { onSuccess: invalidate });
    else if (kind === "category") delCat.mutate({ id: Number(id) }, { onSuccess: invalidate });
    else delSector.mutate({ id: Number(id) }, { onSuccess: invalidate });
  };

  return <div className="space-y-6">
    <Section title={editingId ? `${labels}ı düzenle` : `Yeni ${labels.toLowerCase()}`}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        {kind === "brand" && <Field label="Logo yolu"><input className={inputCls} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="/brand/reference/idc-logo.jpg" /></Field>}
        {kind === "sector" && <Field label="Sıra"><input type="number" min={0} className={inputCls} value={position} onChange={(e) => setPosition(Number(e.target.value))} /></Field>}
        <div className="sm:col-span-2"><Field label="Açıklama"><textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field></div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {editingId && <button type="button" onClick={() => { setEditingId(null); setName(""); setDescription(""); setLogoUrl(""); setPosition(0); }} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
          <button type="submit" disabled={listBrands.isPending || listCats.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={15} /> {editingId ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </Section>
    <Section title={`${labels}lar (${data.length})`}>
      <div className="space-y-2.5">
        {data.map((item: any) => <Row key={item.id} onEdit={() => startEdit(item)} onDelete={() => remove(item.id, item.name)}>
          <div className="flex items-center gap-3"><p className="font-semibold">{item.name}</p>{item.productCount != null && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{item.productCount} ürün</span>}</div>
        </Row>)}
        {data.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Henüz kayıt yok.</p>}
      </div>
    </Section>
  </div>;
}

// ---------------------------------------------------------------------------
// Site sections
// ---------------------------------------------------------------------------

function SectionsAdmin() {
  const list = useListAdminSiteSections();
  const create = useCreateSiteSection();
  const update = useUpdateSiteSection();
  const del = useDeleteSiteSection();
  const qc = useQueryClient();
  const [key, setKey] = useState("");
  const [page, setPage] = useState("home");
  const [label, setLabel] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/site-sections"] }); qc.invalidateQueries({ queryKey: ["/admin/site-sections"] }); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!key || !label) return;
    const payload = { key, page, label, body };
    if (editingId) {
      await update.mutateAsync({ id: Number(editingId), data: { page, label, body } });
      setEditingId(null);
    } else {
      await create.mutateAsync({ data: payload });
    }
    setKey(""); setPage("home"); setLabel(""); setBody("");
    invalidate();
  };

  return <div className="space-y-6">
    <Section title={editingId ? "Bölümü düzenle" : "Yeni site bölümü"}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Anahtar (key)" hint="benzersiz"><input className={inputCls} value={key} onChange={(e) => setKey(e.target.value)} placeholder="stat_tecrube" required disabled={!!editingId} /></Field>
        <Field label="Sayfa"><select className={inputCls} value={page} onChange={(e) => setPage(e.target.value)}><option value="home">Ana sayfa</option><option value="kurumsal">Kurumsal</option><option value="iletisim">İletişim</option><option value="genel">Genel</option></select></Field>
        <div className="sm:col-span-2"><Field label="Görünen ad"><input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} required /></Field></div>
        <div className="sm:col-span-2"><Field label="İçerik"><textarea rows={4} className={inputCls} value={body} onChange={(e) => setBody(e.target.value)} /></Field></div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
          <button type="submit" disabled={create.isPending || update.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={15} /> {editingId ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </Section>
    <Section title={`Site bölümleri (${(list.data ?? []).length})`}>
      <div className="space-y-2.5">
        {(list.data ?? []).map((s) => <Row key={s.id} editing={editingId === s.id} onEdit={() => { setEditingId(s.id); setKey(s.key); setPage(s.page ?? "home"); setLabel(s.label); setBody(s.body ?? ""); }} onDelete={() => { if (confirm(`"${s.label}" bölümünü sil?`)) { del.mutate({ id: Number(s.id) }, { onSuccess: invalidate }); } }}>
          <div><p className="font-semibold">{s.label}</p><p className="mt-0.5 text-xs text-muted-foreground"><span className="font-mono">{s.key}</span> · {s.page}</p></div>
        </Row>)}
        {list.data?.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Henüz bölüm yok.</p>}
      </div>
    </Section>
  </div>;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export function AdminContent() {
  const [location] = useLocation();
  if (location === "/admin" || location === "/admin/") {
    return <AdminOverview />;
  }
  if (location.startsWith("/admin/sliders")) return <SlidersAdmin />;
  if (location.startsWith("/admin/posts")) return <PostsAdmin />;
  if (location.startsWith("/admin/brands")) return <SimpleItemsAdmin kind="brand" />;
  if (location.startsWith("/admin/categories")) return <SimpleItemsAdmin kind="category" />;
  if (location.startsWith("/admin/sectors")) return <SimpleItemsAdmin kind="sector" />;
  if (location.startsWith("/admin/sections")) return <SectionsAdmin />;
  if (location.startsWith("/admin/products")) return <ProductsAdmin />;
  if (location.startsWith("/admin/inquiries")) return <InquiriesAdmin />;
  if (location.startsWith("/admin/settings")) return <SettingsAdmin />;
  if (location.startsWith("/admin/audit")) return <AuditLogsAdmin />;
  return <AdminOverview />;
}

function KpiCard({ icon: Icon, label, value, sub, tone }: { icon: typeof Gauge; label: string; value: string | number; sub?: string; tone?: "default" | "accent" }) {
  return <div className={`rounded-xl border p-5 ${tone === "accent" ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
    <div className="flex justify-between"><span className="text-sm text-muted-foreground">{label}</span><Icon size={18} className={tone === "accent" ? "text-primary" : "text-primary"} /></div>
    <p data-testid={`kpi-${label}`} className="mt-5 font-display text-3xl font-semibold">{value}</p>
    {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
  </div>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { new: "bg-blue-100 text-blue-700", read: "bg-amber-100 text-amber-700", answered: "bg-green-100 text-green-700" };
  const label: Record<string, string> = { new: "Yeni", read: "Okundu", answered: "Yanıtlandı" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${map[status] ?? "bg-muted text-muted-foreground"}`}>{label[status] ?? status}</span>;
}

function AdminOverview() {
  const [location, setLocation] = useLocation();
  const summary = useGetAdminSummary();
  const d = summary.data;
  const recent = d?.recentMessages ?? [];
  const trend = d?.monthlyMessageTrend ?? [];
  const maxTrend = Math.max(1, ...trend.map((t) => t.count));
  const monthLabel = (m: string) => {
    const [y, mo] = m.split("-");
    const names = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return `${names[Number(mo) - 1] ?? mo} ${y.slice(2)}`;
  };
  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard icon={PackageSearch} label="Ürünler" value={d?.productCount ?? "—"} sub="Katalogdaki toplam ürün" />
      <KpiCard icon={Layers3} label="Markalar" value={d?.brandCount ?? "—"} sub="Distribütörlüğü yapılan marka" />
      <KpiCard icon={Factory} label="Sektörler" value={d?.sectorCount ?? "—"} sub="Endüstriyel çözüm alanı" />
      <KpiCard icon={FileText} label="Blog yazıları" value={d?.postCount ?? "—"} sub="Yayınlanan içerik" />
      <KpiCard icon={ImageIcon} label="Hero sliderlar" value={d?.sliderCount ?? "—"} sub="Ana sayfa görselleri" />
      <KpiCard icon={Mail} label="Yeni mesajlar" value={d?.newMessageCount ?? "—"} tone="accent" sub={`Toplam ${d?.totalMessageCount ?? 0} iletişim`} />
      <KpiCard icon={Inbox} label="Ürün talepleri" value={d?.totalRequestCount ?? "—"} sub="B2B ürün istekleri" />
      <KpiCard icon={Cog} label="Kategoriler" value={d?.categoryCount ?? "—"} sub="Ürün grupları" />
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Eğilim</p><h2 className="mt-2 font-display text-2xl font-semibold">Son 6 ay — iletişim mesajları</h2></div><BarChart3 className="text-muted-foreground" /></div>
        {trend.length === 0 ? <p className="mt-8 text-center text-sm text-muted-foreground">Henüz mesaj verisi yok.</p> : <div className="mt-8 flex h-48 items-end gap-3">
          {trend.map((t) => <div key={t.month} className="flex flex-1 flex-col items-center gap-2"><div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary" style={{ height: `${Math.max(6, (t.count / maxTrend) * 100)}%` }} title={`${t.count} mesaj`} /></div><span className="text-[11px] font-bold text-muted-foreground">{monthLabel(t.month)}</span><span className="text-xs font-bold">{t.count}</span></div>)}
        </div>}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Gelen kutusu</p><h2 className="mt-2 font-display text-2xl font-semibold">Son mesajlar</h2></div><button type="button" onClick={() => setLocation("/admin/inquiries")} className="text-sm font-bold text-primary hover:underline">Tümü →</button></div>
        <div className="mt-5 space-y-3">
          {recent.map((m) => <button key={m.id} type="button" onClick={() => setLocation("/admin/inquiries")} className="flex w-full items-start justify-between gap-3 rounded-lg border border-border p-3.5 text-left transition hover:border-primary/40">
            <div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-bold">{m.fullName}</p><StatusBadge status={m.status} /></div><p className="mt-1 truncate text-xs text-muted-foreground">{m.subject || "—"}</p></div>
            <span className="shrink-0 text-[11px] text-muted-foreground">{new Date(m.createdAt).toLocaleDateString("tr-TR")}</span>
          </button>)}
          {recent.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Henüz iletişim mesajı yok.</p>}
        </div>
      </div>
    </div>
  </div>;
}

function InquiriesAdmin() {
  const list = useListAdminContactMessages();
  const update = useUpdateContactMessage();
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const messages = list.data ?? [];
  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const counts = { all: messages.length, new: messages.filter((m) => m.status === "new").length, read: messages.filter((m) => m.status === "read").length, answered: messages.filter((m) => m.status === "answered").length };
  const setStatus = (id: string, status: string) => {
    update.mutate({ id: Number(id), data: { status } as never }, { onSuccess: () => qc.invalidateQueries({ queryKey: ["/admin/contact-messages"] }) });
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-display text-2xl font-semibold">İletişim mesajları</h2>
      <div className="flex flex-wrap gap-2">
        {(["all", "new", "read", "answered"] as const).map((f) => <button key={f} type="button" data-testid={`filter-${f}`} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === f ? "bg-primary text-white" : "border border-border bg-card text-muted-foreground hover:border-primary/40"}`}>{f === "all" ? "Tümü" : f === "new" ? "Yeni" : f === "read" ? "Okundu" : "Yanıtlandı"} ({counts[f]})</button>)}
      </div>
    </div>
    <div className="space-y-3">
      {filtered.map((m) => <div key={m.id} className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-primary">{m.fullName.charAt(0)}</span><div><p className="font-bold">{m.fullName}{m.company ? <span className="ml-2 text-xs font-normal text-muted-foreground">· {m.company}</span> : null}</p><p className="text-xs text-muted-foreground">{m.email}{m.phone ? ` · ${m.phone}` : ""} · {new Date(m.createdAt).toLocaleString("tr-TR")}</p></div></div>
          <div className="flex items-center gap-2"><StatusBadge status={m.status} /><button type="button" onClick={() => setOpenId(openId === m.id ? null : m.id)} className="rounded-md border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted">{openId === m.id ? "Gizle" : "Oku"}</button></div>
        </div>
        <p className="mt-3 text-sm font-bold text-primary">{m.subject}</p>
        {openId === m.id && <div className="mt-3 rounded-lg bg-muted/50 p-4"><p className="text-sm leading-6">{m.message}</p><div className="mt-4 flex flex-wrap gap-2">
          {(["new", "read", "answered"] as const).map((s) => <button key={s} type="button" data-testid={`status-${s}-${m.id}`} onClick={() => setStatus(m.id, s)} className={`rounded-md px-3 py-1.5 text-xs font-bold ${m.status === s ? "bg-primary text-white" : "border border-border bg-background hover:border-primary/40"}`}>{s === "new" ? "Yeni" : s === "read" ? "Okundu" : "Yanıtlandı"}</button>)}
          <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white"><Send size={13} /> Yanıtla</a>
        </div></div>}
      </div>)}
      {filtered.length === 0 && <div className="rounded-xl border border-border bg-card p-10 text-center"><p className="text-sm text-muted-foreground">Bu filtrede mesaj yok.</p></div>}
    </div>
  </div>;
}

const SETTING_GROUPS = ["general", "smtp", "seo", "integrations"] as const;
const GROUP_LABELS: Record<string, string> = { general: "Genel Ayarlar", smtp: "SMTP Ayarları", seo: "SEO & Google Search Console", integrations: "Google & Meta Entegrasyonları" };
const GROUP_ICONS: Record<string, typeof Gauge> = { general: Settings2, smtp: Mail, seo: Search, integrations: Send };
const GROUP_DESCRIPTIONS: Record<string, string> = { general: "Site kimliği ve iletişim bilgileri.", smtp: "E-posta gönderimi için SMTP sunucu ayarları.", seo: "Arama motoru doğrulama ve meta bilgileri.", integrations: "GA4, GTM, Meta Pixel ve Search Console yapılandırması. Bu değerler siteye izin koşullarıyla birlikte uygulanır." };

function SettingsAdmin() {
  const list = useGetAdminSettings();
  const update = useUpdateAdminSettings();
  const qc = useQueryClient();
  const [activeGroup, setActiveGroup] = useState<(typeof SETTING_GROUPS)[number]>("general");
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (list.data) {
      const v: Record<string, string> = {};
      for (const s of list.data) v[s.key] = s.value ?? "";
      setValues(v);
    }
  }, [list.data]);

  const byGroup = (list.data ?? []).reduce<Record<string, AdminSetting[]>>((acc, s) => { (acc[s.group] ??= []).push(s); return acc; }, {});
  const activeSettings = byGroup[GROUP_LABELS[activeGroup]] ?? [];
  const save = async () => {
    const payload: Record<string, string> = {};
    for (const [k, v] of Object.entries(values)) if (v !== undefined) payload[k] = v;
    await update.mutateAsync({ data: payload });
    qc.invalidateQueries({ queryKey: ["/admin/settings"] });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="eyebrow">Yapılandırma</p><h2 className="mt-2 font-display text-2xl font-semibold">Site ayarları</h2></div>
      <button type="button" data-testid="save-settings" onClick={save} disabled={update.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{update.isPending ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}{saved ? "Kaydedildi" : "Kaydet"}</button>
    </div>
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <div className="h-fit space-y-1.5 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28">
        {SETTING_GROUPS.map((g) => { const Icon = GROUP_ICONS[g]; return <button key={g} type="button" data-testid={`tab-${g}`} onClick={() => setActiveGroup(g)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold ${activeGroup === g ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><Icon size={17} />{GROUP_LABELS[g]}</button>; })}
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">{GROUP_LABELS[activeGroup]}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{GROUP_DESCRIPTIONS[activeGroup]}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {activeSettings.map((s) => <Field key={s.key} label={s.label}>
              {s.key === "smtp_pass" ? <input type="password" className={inputCls} value={values[s.key] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [s.key]: e.target.value }))} /> : <input className={inputCls} value={values[s.key] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [s.key]: e.target.value }))} />}
            </Field>)}
            {activeSettings.length === 0 && <p className="col-span-full py-8 text-center text-sm text-muted-foreground">Bu grupta ayar bulunamadı.</p>}
          </div>
        </div>
        {activeGroup === "seo" && <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-bold text-amber-800">Google Search Console nasıl çalışır?</p><p className="mt-2 text-sm leading-6 text-amber-700">Doğrulama kodunu (meta etiket) yukarıdaki alana yapıştırın. Kod, site <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">&lt;head&gt;</code> bölümüne otomatik eklenir ve Search Console doğrulaması tamamlanır. Meta başlık/açıklama alanları SEO varsayılanı olarak kullanılır.</p></div>}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h3 className="font-display text-lg font-semibold">Veritabanı yedeği</h3><p className="mt-1 text-sm text-muted-foreground">Tüm içerik ve ayarların PostgreSQL dökümünü oluşturur. Yedekler <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">backups/</code> klasöründe, herkese açık web dizininin dışında saklanır.</p></div>
            <button type="button" data-testid="backup-button" onClick={async () => {
              try {
                const res = await fetch('/api/admin/backup', { method: 'POST' });
                const data = await res.json();
                window.alert(data.ok ? `Yedek oluşturuldu: ${data.fileName} (${(data.sizeBytes / 1024 / 1024).toFixed(1)} MB)` : `Yedekleme başarısız: ${data.error}`);
              } catch (err) {
                window.alert('Yedekleme isteği gönderilemedi.');
                void err;
              }
            }} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white">Yedek oluştur</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

type AuditRow = { id: string; actorEmail: string; module: string; action: string; entityId: string | null; statusCode: number; meta: Record<string, unknown>; createdAt: string };

function AuditLogsAdmin() {
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
        else setError(String(data?.error ?? "Yüklenemedi"));
      })
      .catch(() => setError("Audit log yüklenemedi."));
  }, []);
  useEffect(refresh, [refresh]);
  const statusColor = (code: number) => code < 400 ? "bg-green-100 text-green-700" : code < 500 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  const methodColor = (m: string) => m === "GET" ? "bg-blue-100 text-blue-700" : m === "POST" ? "bg-green-100 text-green-700" : m === "DELETE" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700";
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="eyebrow">Denetim izi</p><h2 className="mt-2 font-display text-2xl font-semibold">Güvenlik & audit log</h2></div>
      <button type="button" data-testid="refresh-audit" onClick={refresh} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-bold hover:bg-muted">Yenile</button>
    </div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead><tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Tarih</th><th className="px-4 py-3">Kullanıcılar</th><th className="px-4 py-3">Yöntem</th><th className="px-4 py-3">Modül</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3">IP</th></tr></thead>
        <tbody>
          {rows?.map((r) => <tr key={r.id} className="border-b border-border/60 last:border-0">
            <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{new Date(r.createdAt).toLocaleString("tr-TR")}</td>
            <td className="px-4 py-3 font-semibold">{r.actorEmail}</td>
            <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-bold ${methodColor(r.action)}`}>{r.action}</span></td>
            <td className="px-4 py-3 font-mono text-xs">{r.module}{r.entityId ? ` / ${r.entityId}` : ""}</td>
            <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-bold ${statusColor(r.statusCode)}`}>{r.statusCode}</span></td>
            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{String(r.meta?.ip ?? "—")}</td>
          </tr>)}
          {rows && rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Henüz kayıt yok. Sisteme giriş yapan yöneticilerin işlemleri burada görünür.</td></tr>}
        </tbody>
      </table>
    </div>
  </div>;
}

// ---------------------------------------------------------------------------
// Products (read-only list + create)
// ---------------------------------------------------------------------------

function ProductsAdmin() {
  const list = useListAdminProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();
  const qc = useQueryClient();
  const listBrands = useListAdminBrands();
  const listCats = useListAdminCategories();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/admin/products"] }); qc.invalidateQueries({ queryKey: ["/products"] }); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code || !brandId || !categoryId) return;
    const payload = { name, code, brandId: Number(brandId), categoryId: Number(categoryId), shortDescription, description, imageUrl };
    if (editingId) {
      await update.mutateAsync({ id: Number(editingId), data: payload });
      setEditingId(null);
    } else {
      await create.mutateAsync({ data: payload });
    }
    setName(""); setCode(""); setBrandId(""); setCategoryId(""); setShortDescription(""); setDescription(""); setImageUrl("");
    invalidate();
  };

  return <div className="space-y-6">
    <Section title={editingId ? "Ürünü düzenle" : "Yeni ürün"}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Ürün adı"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Kod"><input className={inputCls} value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
        <Field label="Marka"><select className={inputCls} value={brandId} onChange={(e) => setBrandId(e.target.value)} required><option value="">Seçin…</option>{(listBrands.data ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
        <Field label="Kategori"><select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required><option value="">Seçin…</option>{(listCats.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <div className="sm:col-span-2"><Field label="Kısa açıklama"><input className={inputCls} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} /></Field></div>
        <div className="sm:col-span-2"><Field label="Detaylı açıklama"><textarea rows={4} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field></div>
        <Field label="Görsel yolu"><input className={inputCls} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></Field>
        <div className="flex items-end justify-end gap-3">
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={15} /> {editingId ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </Section>
    <Section title={`Ürünler (${(list.data ?? []).length})`}>
      <div className="space-y-2.5">
        {(list.data ?? []).map((p) => <Row key={p.id} editing={editingId === p.id} onEdit={() => { setEditingId(p.id); setName(p.name); setCode(p.code); setBrandId(String(p.brandId)); setCategoryId(String(p.categoryId)); setShortDescription(p.shortDescription ?? ""); setDescription(p.description ?? ""); setImageUrl(p.imageUrl ?? ""); }} onDelete={() => { if (confirm(`"${p.name}" ürününü sil?`)) { del.mutate({ id: Number(p.id) }, { onSuccess: invalidate }); } }}>
          <div><p className="font-semibold">{p.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{p.code} · {p.brandId} / {p.categoryId}</p></div>
        </Row>)}
        {list.data?.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Henüz ürün yok.</p>}
      </div>
    </Section>
  </div>;
}
