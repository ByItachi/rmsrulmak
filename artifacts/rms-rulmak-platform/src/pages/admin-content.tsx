import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  Factory,
  FileText,
  Image as ImageIcon,
  Layers3,
  Loader2,
  PackageSearch,
  Pencil,
  Plus,
  Save,
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
  useListAdminBrands,
  useListAdminCategories,
  useListAdminPosts,
  useListAdminProducts,
  useListAdminSectors,
  useListAdminSiteSections,
  useListAdminSliders,
  useUpdateBrand,
  useUpdateCategory,
  useUpdatePost,
  useUpdateProduct,
  useUpdateSector,
  useUpdateSiteSection,
  useUpdateSlider,
} from "@workspace/api-client-react";
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
  return <AdminOverview />;
}

function AdminOverview() {
  const [location, setLocation] = useLocation();
  const listBrands = useListAdminBrands();
  const listSliders = useListAdminSliders();
  const listPosts = useListAdminPosts();
  const listSections = useListAdminSiteSections();
  const cards = [
    ["Sliderlar", listSliders.data?.length ?? "—", ImageIcon, "/admin/sliders"],
    ["Blog yazıları", listPosts.data?.length ?? "—", FileText, "/admin/posts"],
    ["Markalar", listBrands.data?.length ?? "—", Layers3, "/admin/brands"],
    ["Site bölümleri", listSections.data?.length ?? "—", Factory, "/admin/sections"],
  ];
  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value, Icon, href]) => <button key={String(href)} type="button" onClick={() => setLocation(String(href))} className="group rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary/40">
        <div className="flex justify-between"><span className="text-sm text-muted-foreground">{String(label)}</span>{typeof Icon === "function" && <Icon size={18} className="text-primary" />}</div>
        <p className="mt-5 font-display text-3xl font-semibold">{String(value)}</p>
        <p className="mt-2 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">Yönet →</p>
      </button>)}
    </div>
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-display text-2xl font-semibold">İçerik yönetimi</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Sliderlar, blog yazıları, markalar, kategoriler, sektörler, ürünler ve site bölümleri — tüm içerik bu panelden yönetilir ve veritabanına kaydedilir. Değişiklikler anında sitede görünür.</p>
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
