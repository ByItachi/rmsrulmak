import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  BarChart3,
  Check,
  CheckCheck,
  Cog,
  ExternalLink,
  Factory,
  FileText,
  FileUp,
  Gauge,
  Image as ImageIcon,
  Inbox,
  Layers3,
  Link2,
  Loader2,
  Mail,
  PackageSearch,
  Palette,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  useCreateAdminMediaAsset,
  useCreateAdminPage,
  useCreateAdminRedirectRule,
  useCreateBrand,
  useCreateCategory,
  useCreatePost,
  useCreateProduct,
  useCreateSector,
  useCreateSiteSection,
  useCreateSlider,
  useDeleteAdminMediaAsset,
  useDeleteAdminPage,
  useDeleteAdminRedirectRule,
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
  useListAdminMediaAssets,
  useListAdminPages,
  useListAdminPosts,
  useListAdminProducts,
  useListAdminRedirectRules,
  useListAdminSectors,
  useListAdminSiteSections,
  useListAdminSliders,
  useListAdminUsers,
  useUpdateAdminMediaAsset,
  useUpdateAdminPage,
  useUpdateAdminRedirectRule,
  useUpdateAdminSettings,
  useUpdateAdminUser,
  useUpdateBrand,
  useUpdateCategory,
  useUpdateContactMessage,
  useUpdatePost,
  useUpdateProduct,
  useUpdateSector,
  useUpdateSiteSection,
  useUpdateSlider,
} from "@workspace/api-client-react";
import type {
  AdminMediaAsset,
  AdminPage,
  AdminRedirectRule,
  AdminSetting,
  AdminUser,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3">
    <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>
    {action}
  </div>;
}

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
    <PageHeader eyebrow="Ana sayfa" title="Hero sliderlar" description="Ana sayfadaki büyük görsel alanı yöneten slaytlar." />
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
    <PageHeader eyebrow="İçerik" title="Blog yazıları" description="Şirket haberleri ve teknik makaleleri yönetin." />
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
  const [partnerType, setPartnerType] = useState<"distributor" | "import">("import");
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
      const payload = { ...common, logoUrl, position, partnerType };
      if (editingId) { await updateBrand.mutateAsync({ id: Number(editingId), data: payload }); } else { await createBrand.mutateAsync({ data: payload }); }
    } else if (kind === "category") {
      if (editingId) { await updateCat.mutateAsync({ id: Number(editingId), data: common }); } else { await createCat.mutateAsync({ data: common }); }
    } else {
      const payload = { ...common, position };
      if (editingId) { await updateSector.mutateAsync({ id: Number(editingId), data: payload }); } else { await createSector.mutateAsync({ data: payload }); }
    }
    setName(""); setDescription(""); setLogoUrl(""); setPosition(0); setPartnerType("import"); setEditingId(null);
    invalidate();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description ?? "");
    if (kind === "brand") { setLogoUrl(item.logoUrl ?? ""); setPosition(item.position ?? 0); setPartnerType(item.partnerType ?? "import"); }
    if (kind === "sector") setPosition(item.position ?? 0);
  };

  const remove = (id: string, itemName: string) => {
    if (!confirm(`"${itemName}" öğesini sil?`)) return;
    if (kind === "brand") delBrand.mutate({ id: Number(id) }, { onSuccess: invalidate });
    else if (kind === "category") delCat.mutate({ id: Number(id) }, { onSuccess: invalidate });
    else delSector.mutate({ id: Number(id) }, { onSuccess: invalidate });
  };

  const pageTitle = kind === "brand" ? "Markalar" : kind === "category" ? "Kategoriler" : "Sektörler";
  return <div className="space-y-6">
    <PageHeader eyebrow="Katalog" title={pageTitle} description={`${labels} kayıtlarını ekleyin, düzenleyin veya kaldırın.`} />
    <Section title={editingId ? `${labels}ı düzenle` : `Yeni ${labels.toLowerCase()}`}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        {kind === "brand" && <Field label="Logo yolu"><input className={inputCls} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="/brand/reference/idc-logo.jpg" /></Field>}
        {kind === "brand" && <Field label="Sıra"><input type="number" min={0} className={inputCls} value={position} onChange={(e) => setPosition(Number(e.target.value))} /></Field>}
        {kind === "brand" && <Field label="Ortaklık tipi"><select className={inputCls} value={partnerType} onChange={(e) => setPartnerType(e.target.value as "distributor" | "import")}><option value="distributor">Resmi Distribütörlük</option><option value="import">Doğrudan İthalat</option></select></Field>}
        {kind === "sector" && <Field label="Sıra"><input type="number" min={0} className={inputCls} value={position} onChange={(e) => setPosition(Number(e.target.value))} /></Field>}
        <div className="sm:col-span-2"><Field label="Açıklama"><textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field></div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {editingId && <button type="button" onClick={() => { setEditingId(null); setName(""); setDescription(""); setLogoUrl(""); setPosition(0); setPartnerType("import"); }} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
          <button type="submit" disabled={listBrands.isPending || listCats.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={15} /> {editingId ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </Section>
    <Section title={`${labels}lar (${data.length})`}>
      <div className="space-y-2.5">
        {data.map((item: any) => <Row key={item.id} onEdit={() => startEdit(item)} onDelete={() => remove(item.id, item.name)}>
          <div className="flex items-center gap-3"><p className="font-semibold">{item.name}</p>{kind === "brand" && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{item.partnerType === "distributor" ? "Resmi Distribütörlük" : "Doğrudan İthalat"}</span>}{item.productCount != null && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{item.productCount} ürün</span>}</div>
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
    <PageHeader eyebrow="İçerik" title="Site bölümleri" description="Sayfa içi metin bloklarını ve istatistik alanlarını yönetin." />
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
  if (location.startsWith("/admin/media")) return <MediaLibraryAdmin />;
  if (location.startsWith("/admin/pages")) return <PagesAdmin />;
  if (location.startsWith("/admin/redirects")) return <RedirectsAdmin />;
  if (location.startsWith("/admin/users")) return <UsersAdmin />;
  if (location.startsWith("/admin/menus")) return <MenusAdmin />;
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
    <PageHeader eyebrow="Panel" title="Genel bakış" description="Katalog ve iletişim verilerinin özeti." />
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
      <div><p className="eyebrow">Gelen kutusu</p><h2 className="mt-2 font-display text-2xl font-semibold">İletişim mesajları</h2></div>
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

const SETTING_GROUPS = ["general", "smtp", "seo", "integrations", "theme"] as const;
const GROUP_LABELS: Record<string, string> = { general: "Genel Ayarlar", smtp: "SMTP Ayarları", seo: "SEO & Google Search Console", integrations: "Google & Meta Entegrasyonları", theme: "Tema ve Renkler" };
const GROUP_ICONS: Record<string, typeof Gauge> = { general: Settings2, smtp: Mail, seo: Search, integrations: Send, theme: Palette };
const GROUP_DESCRIPTIONS: Record<string, string> = { general: "Site kimliği ve iletişim bilgileri.", smtp: "E-posta gönderimi için SMTP sunucu ayarları.", seo: "Arama motoru doğrulama ve meta bilgileri.", integrations: "GA4, GTM, Meta Pixel ve Search Console yapılandırması. Bu değerler siteye izin koşullarıyla birlikte uygulanır.", theme: "Sitenin ana, arka plan ve metin renklerini yönetin. Değişiklikler kaydedildikten sonra ziyaretçiler için anında geçerli olur." };

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
    <PageHeader eyebrow="Katalog" title="Ürünler" description="Ürün kataloğunu ekleyin, düzenleyin veya kaldırın." />
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

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma !== -
          1 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function MediaLibraryAdmin() {
  const list = useListAdminMediaAssets();
  const create = useCreateAdminMediaAsset();
  const update = useUpdateAdminMediaAsset();
  const del = useDeleteAdminMediaAsset();
  const qc = useQueryClient();
  const [folderFilter, setFolderFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editFolder, setEditFolder] = useState("genel");

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/admin/media"] }); };
  const assets = list.data ?? [];
  const folders = Array.from(new Set(assets.map((a) => a.folder ?? "genel")));
  const filtered = folderFilter === "all" ? assets : assets.filter((a) => (a.folder ?? "genel") === folderFilter);

  const onUpload = async (e: FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
    const files = input?.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file);
        await create.mutateAsync({ data: { fileName: file.name, mimeType: file.type || "application/octet-stream", base64, folder: folderFilter === "all" ? "genel" : folderFilter } });
      }
      if (input) input.value = "";
      invalidate();
    } catch (err) {
      window.alert("Yükleme başarısız: " + String((err as Error)?.message ?? "Bilinmeyen hata"));
      void err;
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (a: AdminMediaAsset) => { setEditingId(a.id); setEditTitle(a.title ?? ""); setEditAlt(a.altText ?? ""); setEditFolder(a.folder ?? "genel"); };
  const saveEdit = async () => {
    if (!editingId) return;
    await update.mutate({ id: Number(editingId), data: { title: editTitle || " ", altText: editAlt, folder: editFolder } }, { onSuccess: () => { setEditingId(null); invalidate(); } });
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="eyebrow">Dosyalar</p><h2 className="mt-2 font-display text-2xl font-semibold">Medya kütüphanesi</h2><p className="mt-1 text-sm text-muted-foreground">Görseller ve PDF'ler; ana sayfa, katalog ve içeriklerde kullanılmak üzere buradan yönetilir. Dosyalar otomatik olarak <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/media/&lt;dosya&gt;</code> adresinde yayınlanır.</p></div>
      <div className="flex flex-wrap gap-2">
        {(["all", ...folders]).map((f) => <button key={f} type="button" data-testid={`folder-${f}`} onClick={() => setFolderFilter(f)} className={`rounded-full px-4 py-2 text-xs font-bold ${folderFilter === f ? "bg-primary text-white" : "border border-border bg-card text-muted-foreground hover:border-primary/40"}`}>{f === "all" ? "Tümü" : f}</button>)}
      </div>
    </div>
    <form onSubmit={onUpload} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
      <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm font-semibold text-muted-foreground">
        <FileUp size={18} className="text-primary" /> Dosya seç (PNG, JPG, WebP, SVG, GIF, PDF — çoklu seçim desteklenir)
        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf" multiple className="sr-only" />
      </label>
      <button type="submit" disabled={uploading} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}{uploading ? "Yükleniyor…" : "Yükle"}</button>
    </form>
    {list.data && list.data.length === 0 && <div className="rounded-xl border border-border bg-card p-10 text-center"><p className="text-sm text-muted-foreground">Henüz dosya yüklenmemiş.</p></div>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((a) => {
        const isImage = a.mimeType.startsWith("image/");
        return <div key={a.id} data-testid={`asset-${a.id}`} className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-40 items-center justify-center bg-muted/40">
            {isImage ? <img src={`/api/media/${a.storagePath}`} alt={a.altText || a.fileName} className="h-full w-full object-contain" loading="lazy" /> : <FileText size={40} className="text-muted-foreground" />}
          </div>
          <div className="space-y-2 p-4">
            {editingId === a.id ? <div className="space-y-2">
              <input className={inputCls} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Başlık" />
              <input className={inputCls} value={editAlt} onChange={(e) => setEditAlt(e.target.value)} placeholder="ALT metni (SEO)" />
              <input className={inputCls} value={editFolder} onChange={(e) => setEditFolder(e.target.value)} placeholder="Klasör" />
              <div className="flex gap-2 pt-1"><button type="button" onClick={saveEdit} className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white">Kaydet</button><button type="button" onClick={() => setEditingId(null)} className="rounded-md px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted">İptal</button></div>
            </div> : <div className="flex items-start justify-between gap-2">
              <div className="min-w-0"><p className="truncate text-sm font-bold">{a.title || a.fileName}</p><p className="truncate text-xs text-muted-foreground">{a.fileName} · {formatBytes(a.size)}</p><p className="mt-1 text-[11px] font-semibold text-primary">{a.folder ?? "genel"}</p></div>
              <div className="flex shrink-0 gap-1">
                <button type="button" data-testid={`edit-${a.id}`} title="Düzenle" onClick={() => startEdit(a)} className="rounded p-1.5 text-muted-foreground hover:bg-muted"><Pencil size={14} /></button>
                <a href={`/api/media/${a.storagePath}`} target="_blank" rel="noreferrer" title="Aç" className="rounded p-1.5 text-muted-foreground hover:bg-muted"><ExternalLink size={14} /></a>
                <button type="button" data-testid={`delete-${a.id}`} title="Sil" onClick={() => { if (confirm(`"${a.fileName}" silinsin mi?`)) del.mutate({ id: Number(a.id) }, { onSuccess: invalidate }); }} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
            </div>}
          </div>
        </div>;
      })}
    </div>
  </div>;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
function PagesAdmin() {
  const list = useListAdminPages();
  const create = useCreateAdminPage();
  const update = useUpdateAdminPage();
  const del = useDeleteAdminPage();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [template, setTemplate] = useState("static");
  const [published, setPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/admin/pages"] }); qc.invalidateQueries({ queryKey: ["/pages"] }); };

  const reset = () => { setEditingId(null); setSlug(""); setTitle(""); setContent(""); setTemplate("static"); setPublished(true); setSeoTitle(""); setSeoDescription(""); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!slug || !title) return;
    try {
      if (editingId) {
        await update.mutateAsync({ id: Number(editingId), data: { slug, title, content, template, published, seoTitle, seoDescription } });
      } else {
        await create.mutateAsync({ data: { slug, title, content, template, published, seoTitle, seoDescription } });
      }
      reset();
      invalidate();
    } catch (err) {
      const msg = String((err as Error)?.message ?? "Kaydedilemedi");
      window.alert(msg.includes("409") ? "Bu sayfa adresi zaten kullanımda." : "Kaydedilemedi: " + msg);
      void err;
    }
  };

  const startEdit = (p: AdminPage) => { setEditingId(p.id); setSlug(p.slug); setTitle(p.title); setContent(p.content ?? ""); setTemplate(p.template ?? "static"); setPublished(p.published); setSeoTitle(p.seoTitle ?? ""); setSeoDescription(p.seoDescription ?? ""); };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="eyebrow">Statik içerik</p><h2 className="mt-2 font-display text-2xl font-semibold">Sayfa yönetimi</h2><p className="mt-1 text-sm text-muted-foreground">Site içinde yeni sayfalar oluşturun, mevcut sayfaların içeriğini düzenleyin. Hazır şablonlar ve SEO meta alanları desteklenir.</p></div>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Section title={editingId ? "Sayfayı düzenle" : "Yeni sayfa"}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sayfa adresi (slug)"><input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="ornek-sayfa" /></Field>
            <Field label="Şablon"><select className={inputCls} value={template} onChange={(e) => setTemplate(e.target.value)}><option value="static">Statik metin</option><option value="full-width">Tam genişlik</option><option value="landing">Tanıtım sayfası</option></select></Field>
          </div>
          <Field label="Sayfa başlığı"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
          <Field label="İçerik" hint="Paragrafları boş satırla ayırın; ## başlık, - madde işareti, [metin](adres) bağlantı desteklenir."><textarea rows={8} className={inputCls} value={content} onChange={(e) => setContent(e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SEO başlığı"><input className={inputCls} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></Field>
            <Field label="SEO açıklaması"><input className={inputCls} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></Field>
          </div>
          <label className="flex items-center gap-2.5 text-sm font-semibold"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-primary" /> Yayında</label>
          <div className="flex items-end justify-end gap-3">
            {editingId && <button type="button" onClick={reset} className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">Vazgeç</button>}
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white"><Save size={15} /> {editingId ? "Güncelle" : "Oluştur"}</button>
          </div>
        </form>
      </Section>
      <Section title={`Sayfalar (${(list.data ?? []).length})`}>
        <div className="space-y-2.5">
          {(list.data ?? []).map((p) => <div key={p.id} data-testid={`page-${p.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
            <div className="min-w-0"><p className="truncate font-semibold">{p.title}</p><p className="mt-0.5 text-xs text-muted-foreground">/{p.slug}{!p.published && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Taslak</span>}</p></div>
            <div className="flex shrink-0 gap-1.5">
              <a href={`/${p.slug}`} target="_blank" rel="noreferrer" title="Görüntüle" className="rounded p-1.5 text-muted-foreground hover:bg-muted"><ExternalLink size={14} /></a>
              <button type="button" onClick={() => startEdit(p)} title="Düzenle" className="rounded p-1.5 text-muted-foreground hover:bg-muted"><Pencil size={14} /></button>
              <button type="button" onClick={() => { if (confirm(`"${p.title}" sayfası silinsin mi?`)) del.mutate({ id: Number(p.id) }, { onSuccess: invalidate }); }} title="Sil" className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>)}
          {(list.data ?? []).length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Henüz özel sayfa yok.</p>}
        </div>
      </Section>
    </div>
  </div>;
}

// ---------------------------------------------------------------------------
// Redirect rules
// ---------------------------------------------------------------------------
function RedirectsAdmin() {
  const list = useListAdminRedirectRules();
  const create = useCreateAdminRedirectRule();
  const update = useUpdateAdminRedirectRule();
  const del = useDeleteAdminRedirectRule();
  const qc = useQueryClient();
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [editingId, setEditingId] = useState<string | null>(null);
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/admin/redirects"] }); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fromPath.startsWith("/") || !toPath.startsWith("/")) { window.alert("Yollar / ile başlamalı (örn. /eski-sayfa)."); return; }
    const payload = { fromPath, toPath, statusCode };
    try {
      if (editingId) await update.mutateAsync({ id: Number(editingId), data: payload });
      else await create.mutateAsync({ data: payload });
      setFromPath(""); setToPath(""); setStatusCode(301); setEditingId(null);
      invalidate();
    } catch (err) {
      window.alert(String((err as Error)?.message ?? "Kaydedilemedi"));
      void err;
    }
  };

  return <div className="space-y-6">
    <div><p className="eyebrow">SEO</p><h2 className="mt-2 font-display text-2xl font-semibold">Yönlendirme kuralları</h2><p className="mt-1 text-sm text-muted-foreground">Eski veya taşınan adresleri yeni adreslere 301/302 ile yönlendirin. Kurallar 1 dakikalık önbellekle site genelinde uygulanır.</p></div>
    <Section title={editingId ? "Kuralı düzenle" : "Yeni kural"}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <Field label="Kaynak (from)"><input className={inputCls} value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="/eski-sayfa" required /></Field>
        <Field label="Hedef (to)"><input className={inputCls} value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/yeni-sayfa" required /></Field>
        <Field label="Tür"><select className={inputCls} value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)}><option value={301}>301 — Kalıcı</option><option value={302}>302 — Geçici</option></select></Field>
        <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white"><Save size={15} /> {editingId ? "Güncelle" : "Ekle"}</button>
      </form>
    </Section>
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {(list.data ?? []).map((r) => <div key={r.id} data-testid={`rule-${r.id}`} className="flex items-center justify-between gap-3 border-b border-border/60 p-4 last:border-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2"><code className="rounded bg-muted px-2 py-1 font-mono text-xs">{r.fromPath}</code><Link2 size={14} className="shrink-0 text-muted-foreground" /><code className="rounded bg-muted px-2 py-1 font-mono text-xs text-primary">{r.toPath}</code><span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">{r.statusCode}</span>{!r.enabled && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Kapalı</span>}</div>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" onClick={() => { setEditingId(r.id); setFromPath(r.fromPath); setToPath(r.toPath); setStatusCode(r.statusCode as 301 | 302); }} title="Düzenle" className="rounded p-1.5 text-muted-foreground hover:bg-muted"><Pencil size={14} /></button>
          <button type="button" onClick={() => update.mutate({ id: Number(r.id), data: { fromPath: r.fromPath, toPath: r.toPath, statusCode: r.statusCode as 301 | 302, enabled: !r.enabled } }, { onSuccess: invalidate })} title={r.enabled ? "Kapat" : "Aç"} className="rounded p-1.5 text-muted-foreground hover:bg-muted"><CheckCheck size={14} /></button>
          <button type="button" onClick={() => { if (confirm(`"${r.fromPath}" kuralı silinsin mi?`)) del.mutate({ id: Number(r.id) }, { onSuccess: invalidate }); }} title="Sil" className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
        </div>
      </div>)}
      {(list.data ?? []).length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Henüz yönlendirme kuralı yok.</p>}
    </div>
  </div>;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
const ROLE_LABELS: Record<string, string> = { super_admin: "Süper yönetici", admin: "Yönetici", editor: "İçerik editörü", media_manager: "Medya yöneticisi", viewer: "İzleyici" };

function UsersAdmin() {
  const list = useListAdminUsers();
  const update = useUpdateAdminUser();
  const qc = useQueryClient();
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["/admin/users"] }); };
  const rows = list.data ?? [];
  return <div className="space-y-6">
    <div><p className="eyebrow">Erişim yönetimi</p><h2 className="mt-2 font-display text-2xl font-semibold">Kullanıcılar</h2><p className="mt-1 text-sm text-muted-foreground">Platforma giriş yapan hesaplar ve rolleri. Rol değişiklikleri bir sonraki girişte geçerli olur.</p></div>
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead><tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Kullanıcı</th><th className="px-4 py-3">E-posta</th><th className="px-4 py-3">Rol</th><th className="px-4 py-3">Durum</th><th className="px-4 py-3">Son giriş</th></tr></thead>
        <tbody>
          {rows.map((u) => <tr key={u.id} data-testid={`user-${u.id}`} className="border-b border-border/60 last:border-0">
            <td className="px-4 py-3"><div className="flex items-center gap-3">{u.profileImageUrl ? <img src={u.profileImageUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-bold text-primary">{(u.firstName ?? u.email ?? "?").charAt(0).toUpperCase()}</span>}<div><p className="font-semibold">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</p>{u.id && <p className="text-[11px] text-muted-foreground">{u.id.slice(0, 12)}…</p>}</div></div></td>
            <td className="px-4 py-3 text-muted-foreground">{u.email ?? "—"}</td>
            <td className="px-4 py-3"><select data-testid={`role-${u.id}`} className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-bold" value={u.role} onChange={(e) => update.mutate({ id: u.id, data: { role: e.target.value as AdminUser["role"], isActive: u.isActive } }, { onSuccess: invalidate })}>{Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
            <td className="px-4 py-3"><button type="button" data-testid={`toggle-${u.id}`} onClick={() => update.mutate({ id: u.id, data: { role: u.role, isActive: !u.isActive } }, { onSuccess: invalidate })} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.isActive ? "Aktif" : "Pasif"}</button></td>
            <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("tr-TR") : "—"}</td>
          </tr>)}
          {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Henüz kullanıcı yok.</td></tr>}
        </tbody>
      </table>
    </div>
  </div>;
}

// ---------------------------------------------------------------------------
// Menus (header/footer DB menu builder)
// ---------------------------------------------------------------------------
interface AdminMenuItem { id?: number; label: string; href: string; openInNewTab: boolean; position?: number; children: AdminMenuItem[] }
interface AdminMenu { id: number; label: string; slug: string; position: number; items: AdminMenuItem[] }

function MenusAdmin() {
  const qc = useQueryClient();
  const [menus, setMenus] = useState<AdminMenu[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMenuLabel, setNewMenuLabel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menus");
      const data = (await res.json()) as AdminMenu[];
      setMenus(data);
      setActiveId((prev) => (prev && data.some((m) => m.id === prev) ? prev : (data[0]?.id ?? null)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const active = menus.find((m) => m.id === activeId) ?? null;
  const setActive = (patch: Partial<AdminMenu>) => setMenus((prev) => prev.map((m) => (m.id === activeId ? { ...m, ...patch } : m)));

  const saveItems = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/menus/${active.id}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: active.items.map((i, ix) => ({ label: i.label, href: i.href, openInNewTab: i.openInNewTab, position: ix + 1, children: i.children.map((c, ci) => ({ label: c.label, href: c.href, openInNewTab: c.openInNewTab, position: ci + 1 })) })) }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? "Kaydedilemedi");
      window.alert("Menü kaydedildi ve sitede yayına alındı.");
      await load();
      qc.invalidateQueries({ queryKey: ["public-menus"] });
    } catch (err) {
      window.alert(String((err as Error).message));
    } finally {
      setSaving(false);
    }
  };

  const createMenu = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel.trim()) return;
    const res = await fetch("/api/admin/menus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: newMenuLabel }) });
    if (res.ok) { setNewMenuLabel(""); await load(); }
  };

  const deleteMenu = async (menu: AdminMenu) => {
    if (!window.confirm(`"${menu.label}" menüsü ve tüm öğeleri silinsin mi?`)) return;
    await fetch(`/api/admin/menus/${menu.id}`, { method: "DELETE" });
    await load();
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>;

  return <div className="space-y-6">
    <div><p className="eyebrow">Navigasyon</p><h2 className="mt-2 font-display text-2xl font-semibold">Menü yönetimi</h2><p className="mt-1 text-sm text-muted-foreground">Header ana menüsü ve footer sütunları buradan yönetilir. Değişiklikler kaydedildiğinde site genelinde anında geçerli olur.</p></div>
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="space-y-2">
        {menus.map((m) => <div key={m.id} className={`flex items-center justify-between gap-1 rounded-lg border p-3 text-sm ${m.id === activeId ? "border-primary bg-primary/5 font-bold text-primary" : "border-border bg-card"}`}>
          <button type="button" data-testid={`menu-tab-${m.slug}`} onClick={() => setActiveId(m.id)} className="min-w-0 flex-1 text-left">{m.label}<span className="block text-[10px] font-normal text-muted-foreground">{m.items.length} öğe</span></button>
          <button type="button" onClick={() => void deleteMenu(m)} title="Menüyü sil" className="rounded p-1 text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
        </div>)}
        <form onSubmit={createMenu} className="flex gap-1.5 pt-1">
          <input value={newMenuLabel} onChange={(e) => setNewMenuLabel(e.target.value)} placeholder="Yeni menü adı" className="min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 py-2 text-xs" />
          <button type="submit" title="Menü ekle" className="rounded-md bg-primary px-2.5 text-white"><Plus size={14} /></button>
        </form>
      </div>
      {active ? <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{active.label} <span className="ml-1 font-mono text-xs text-muted-foreground">/{active.slug}</span></h3>
          <button type="button" onClick={() => void saveItems()} disabled={saving} data-testid="button-save-menu" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><Save size={14} />{saving ? "Kaydediliyor..." : "Kaydet"}</button>
        </div>
        <div className="space-y-3">
          {active.items.map((item, ix) => <div key={ix} data-testid={`menu-item-${ix}`} className="rounded-lg border border-border/70 bg-background/50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <input value={item.label} onChange={(e) => { const items = [...active.items]; items[ix] = { ...item, label: e.target.value }; setActive({ items }); }} placeholder="Etiket" className="w-40 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-semibold" />
              <input value={item.href} onChange={(e) => { const items = [...active.items]; items[ix] = { ...item, href: e.target.value }; setActive({ items }); }} placeholder="/sayfa" className="w-48 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs" />
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground"><input type="checkbox" checked={item.openInNewTab} onChange={(e) => { const items = [...active.items]; items[ix] = { ...item, openInNewTab: e.target.checked }; setActive({ items }); }} /> Yeni sekme</label>
              <span className="flex-1" />
              <button type="button" onClick={() => { const items = [...active.items]; items[ix] = { ...item, children: [...item.children, { label: "Yeni alt öğe", href: "/", openInNewTab: false, children: [] }] }; setActive({ items }); }} className="rounded p-1 text-primary hover:bg-primary/10" title="Alt öğe ekle"><Plus size={14} /></button>
              <button type="button" onClick={() => setActive({ items: active.items.filter((_, i2) => i2 !== ix) })} className="rounded p-1 text-red-500 hover:bg-red-50" title="Öğeyi sil"><Trash2 size={14} /></button>
            </div>
            {item.children.length > 0 && <div className="mt-2 space-y-1.5 border-l-2 border-primary/20 pl-3">
              {item.children.map((child, ci) => <div key={ci} className="flex flex-wrap items-center gap-2">
                <input value={child.label} onChange={(e) => { const items = [...active.items]; items[ix].children[ci] = { ...child, label: e.target.value }; setActive({ items }); }} className="w-36 rounded-md border border-border bg-background px-2 py-1 text-xs" />
                <input value={child.href} onChange={(e) => { const items = [...active.items]; items[ix].children[ci] = { ...child, href: e.target.value }; setActive({ items }); }} className="w-44 rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px]" />
                <button type="button" onClick={() => { const items = [...active.items]; items[ix].children = items[ix].children.filter((_, i2) => i2 !== ci); setActive({ items }); }} className="rounded p-1 text-red-500 hover:bg-red-50"><Trash2 size={12} /></button>
              </div>)}
            </div>}
          </div>)}
        </div>
        <button type="button" onClick={() => setActive({ items: [...active.items, { label: "Yeni öğe", href: "/", openInNewTab: false, children: [] }] })} className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:border-primary hover:text-primary"><Plus size={14} /> Öğe ekle</button>
      </div> : <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Düzenlemek için soldan bir menü seçin.</div>}
    </div>
  </div>;
}
