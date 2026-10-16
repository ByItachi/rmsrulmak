import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  ChevronDown,
  Download,
  FileText,
  Loader2,
  LogOut,
  Trash2,
  Upload,
} from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { PageIntro } from "@/components/page-intro";

type Catalog = {
  id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  fileName: string;
  fileSize: number;
  published: boolean;
  createdAt: string;
  downloadUrl: string;
};

type UploadUrl = {
  uploadURL: string;
  objectPath: string;
};

const brandOptions = ["IDC", "Gates", "Dunlop", "NTN", "NSK", "Genel"];
const categoryOptions = [
  "Genel katalog",
  "Ürün kataloğu",
  "Teknik doküman",
  "Bakım kılavuzu",
];

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error || "İstek tamamlanamadı. Tekrar deneyin.");
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("tr-TR", {
    maximumFractionDigits: 1,
  })} MB`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest<Catalog[]>("/api/catalogs")
      .then((result) => {
        if (active) setCatalogs(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Kataloglar yüklenemedi.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="shell-grid border-b border-border bg-muted/35">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <p className="eyebrow">Teknik dokümanlar</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.06] tracking-[-.045em] md:text-6xl">
            Kataloglar ve ürün dokümanları
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            Marka ve ürün gruplarına göre katalogları açın, ihtiyacınız olan PDF
            dosyasını indirin.
          </p>
        </div>
      </section>
      <main className="mx-auto min-h-[380px] max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 size={17} className="animate-spin" /> Kataloglar yükleniyor
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
          >
            {error}
          </div>
        ) : catalogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
            <FileText className="mx-auto text-primary" size={30} />
            <h2 className="mt-4 font-display text-xl font-semibold">
              Henüz yayınlanmış katalog yok
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Yeni kataloglar eklendikçe bu sayfadan açıp PDF olarak
              indirebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {catalogs.map((catalog) => (
              <details
                key={catalog.id}
                data-testid={`catalog-row-${catalog.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 marker:hidden sm:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg font-semibold">
                      {catalog.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {catalog.brand} <span aria-hidden="true">·</span>{" "}
                      {catalog.category}
                    </span>
                  </span>
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  {catalog.description && (
                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                      {catalog.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                      PDF <span aria-hidden="true">·</span>{" "}
                      {formatFileSize(catalog.fileSize)}{" "}
                      <span aria-hidden="true">·</span>{" "}
                      {formatDate(catalog.createdAt)}
                    </p>
                    <a
                      href={catalog.downloadUrl}
                      data-testid={`catalog-download-${catalog.id}`}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                    >
                      <Download size={16} /> PDF indir
                    </a>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export function CatalogAdminPage() {
  const { user, isLoading: authLoading, isAuthenticated, login, logout } =
    useAuth();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCatalogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCatalogs(await apiRequest<Catalog[]>("/api/catalogs/admin"));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Katalog listesi yüklenemedi.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) void loadCatalogs();
  }, [isAuthenticated, loadCatalogs]);

  async function uploadCatalog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Lütfen bir PDF dosyası seçin.");
      setSaving(false);
      return;
    }
    if (!/\.pdf$/i.test(file.name) || file.size > 50 * 1024 * 1024) {
      setError("Yalnızca 50 MB'a kadar PDF dosyaları yüklenebilir.");
      setSaving(false);
      return;
    }

    try {
      const { uploadURL, objectPath } = await apiRequest<UploadUrl>(
        "/api/catalogs/uploads/request-url",
        {
          method: "POST",
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            contentType: "application/pdf",
          }),
        },
      );
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error("PDF dosyası depoya yüklenemedi. Tekrar deneyin.");
      }

      await apiRequest<Catalog>("/api/catalogs", {
        method: "POST",
        body: JSON.stringify({
          title: String(formData.get("title") || "").trim(),
          brand: String(formData.get("brand") || "Genel"),
          category: String(formData.get("category") || "Genel katalog"),
          description: String(formData.get("description") || "").trim(),
          fileName: file.name,
          fileSize: file.size,
          objectPath,
          published: formData.get("published") === "on",
        }),
      });

      form.reset();
      setMessage("Katalog yüklendi.");
      await loadCatalogs();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Katalog yüklenemedi.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateCatalog(
    event: FormEvent<HTMLFormElement>,
    catalogId: string,
  ) {
    event.preventDefault();
    setBusyId(catalogId);
    setMessage("");
    setError("");
    const data = new FormData(event.currentTarget);

    try {
      await apiRequest<Catalog>(`/api/catalogs/${catalogId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: String(data.get("title") || "").trim(),
          brand: String(data.get("brand") || "").trim(),
          category: String(data.get("category") || "").trim(),
          description: String(data.get("description") || "").trim(),
          published: data.get("published") === "on",
        }),
      });
      setMessage("Katalog bilgileri güncellendi.");
      await loadCatalogs();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Katalog güncellenemedi.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteCatalog(catalog: Catalog) {
    if (!window.confirm(`“${catalog.title}” kataloğu ve PDF dosyası silinsin mi?`)) {
      return;
    }
    setBusyId(catalog.id);
    setMessage("");
    setError("");
    try {
      await apiRequest<void>(`/api/catalogs/${catalog.id}`, {
        method: "DELETE",
      });
      setMessage("Katalog ve PDF dosyası silindi.");
      await loadCatalogs();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Katalog silinemedi.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (authLoading) {
    return (
      <main className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-5">
        <Loader2 className="animate-spin text-primary" />
      </main>
    );
  }

  if (!isAuthenticated) {
    const hasAccessDenied = new URLSearchParams(window.location.search).has(
      "access",
    );
    return (
      <>
      <PageIntro eyebrow="Katalog yönetimi" title="Yetkili giriş gerekli" description="PDF kataloglarını eklemek ve yayın durumlarını yönetmek için yetkili personel hesabınızla giriş yapın." />
      <main className="mx-auto max-w-xl px-5 py-20 lg:py-28">
        <section className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-10">
          <p className="eyebrow">Personel alanı</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">
            Katalog yönetimi
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            PDF kataloglarını eklemek ve yayın durumlarını yönetmek için yetkili
            personel hesabınızla giriş yapın.
          </p>
          {hasAccessDenied && (
            <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-800">
              Bu hesap katalog yönetimi için yetkili değil. İzinli iş hesabıyla
              giriş yapın.
            </p>
          )}
          <button
            type="button"
            data-testid="button-catalog-admin-login"
            onClick={() =>
              login(`${window.location.pathname}${window.location.search}`)
            }
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Yönetici girişi <Check size={16} />
          </button>
        </section>
      </main>
      </>
    );
  }

  return (
    <>
    <PageIntro eyebrow="Personel alanı" title="Katalog yönetimi" description="PDF kataloglarını ekleyin, yayın durumunu değiştirin veya kaldırın." />
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{user?.email}</span> · PDF ekleyin, yayın durumunu değiştirin veya kaldırın.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary"
        >
          <LogOut size={16} /> Çıkış yap
        </button>
      </div>

      {message && (
        <p role="status" className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Upload size={19} />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold">Yeni katalog ekle</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF dosyası, en fazla 50 MB.
            </p>
          </div>
        </div>
        <form onSubmit={uploadCatalog} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold">
            Katalog adı
            <input
              required
              minLength={2}
              maxLength={180}
              name="title"
              data-testid="input-catalog-title"
              placeholder="Örn. Gates Endüstriyel Kayış Kataloğu"
              className="field"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Marka
            <select
              name="brand"
              data-testid="select-catalog-brand"
              className="field"
              defaultValue="IDC"
            >
              {brandOptions.map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Doküman grubu
            <select
              name="category"
              data-testid="select-catalog-category"
              className="field"
              defaultValue="Genel katalog"
            >
              {categoryOptions.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold">
            PDF dosyası
            <input
              required
              type="file"
              name="file"
              accept="application/pdf,.pdf"
              data-testid="input-catalog-file"
              className="field file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-bold file:text-primary"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold md:col-span-2">
            Kısa açıklama
            <textarea
              name="description"
              maxLength={1000}
              rows={3}
              data-testid="input-catalog-description"
              placeholder="Bu katalog hangi ürün veya uygulamaları kapsıyor?"
              className="field resize-y"
            />
          </label>
          <label className="flex items-start gap-3 text-sm md:col-span-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked
              data-testid="input-catalog-published"
              className="mt-1 accent-primary"
            />
            <span>
              <span className="block font-semibold">Sitede yayınla</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                İşaretli kataloglar ziyaretçilere açılır ve indirilebilir.
              </span>
            </span>
          </label>
          <button
            type="submit"
            disabled={saving}
            data-testid="button-catalog-upload"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 md:col-span-2"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {saving ? "Yükleniyor..." : "Kataloğu yükle"}
          </button>
        </form>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Arşiv</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              Yüklenen kataloglar
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {catalogs.length} kayıt
          </span>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Arşiv yükleniyor
          </div>
        ) : catalogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Henüz katalog eklenmemiş.
          </div>
        ) : (
          <div className="space-y-3">
            {catalogs.map((catalog) => (
              <details
                key={catalog.id}
                data-testid={`admin-catalog-${catalog.id}`}
                className="group rounded-xl border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-5 marker:hidden">
                  <FileText size={19} className="shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{catalog.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {catalog.brand} · {catalog.category} · {formatFileSize(catalog.fileSize)}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      catalog.published
                        ? "bg-green-100 text-green-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {catalog.published ? "Yayında" : "Taslak"}
                  </span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="border-t border-border p-5">
                  <form
                    onSubmit={(event) => updateCatalog(event, catalog.id)}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <label className="space-y-2 text-xs font-semibold">
                      Katalog adı
                      <input
                        required
                        minLength={2}
                        maxLength={180}
                        name="title"
                        defaultValue={catalog.title}
                        className="field"
                      />
                    </label>
                    <label className="space-y-2 text-xs font-semibold">
                      Marka
                      <select
                        name="brand"
                        defaultValue={catalog.brand}
                        className="field"
                      >
                        {[...brandOptions, ...(brandOptions.includes(catalog.brand) ? [] : [catalog.brand])].map(
                          (brand) => (
                            <option key={brand}>{brand}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label className="space-y-2 text-xs font-semibold">
                      Doküman grubu
                      <select
                        name="category"
                        defaultValue={catalog.category}
                        className="field"
                      >
                        {[...categoryOptions, ...(categoryOptions.includes(catalog.category) ? [] : [catalog.category])].map(
                          (category) => (
                            <option key={category}>{category}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label className="space-y-2 text-xs font-semibold md:col-span-2">
                      Kısa açıklama
                      <textarea
                        name="description"
                        maxLength={1000}
                        rows={2}
                        defaultValue={catalog.description}
                        className="field resize-y"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm md:col-span-2">
                      <input
                        type="checkbox"
                        name="published"
                        defaultChecked={catalog.published}
                        className="accent-primary"
                      />
                      Yayında
                    </label>
                    <div className="flex flex-wrap gap-3 md:col-span-2">
                      <button
                        type="submit"
                        disabled={busyId === catalog.id}
                        className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
                      >
                        {busyId === catalog.id ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
                      </button>
                      <a
                        href={catalog.downloadUrl}
                        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold"
                      >
                        <Download size={15} /> PDF'yi aç
                      </a>
                      <button
                        type="button"
                        disabled={busyId === catalog.id}
                        onClick={() => void deleteCatalog(catalog)}
                        className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-60"
                      >
                        <Trash2 size={15} /> Sil
                      </button>
                    </div>
                  </form>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </main>
    </>
  );
}
