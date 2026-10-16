import type { ReactNode } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { ArrowRight, BookOpen, Building2, Download, FileText, Images } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { PdfFlipbook } from '@/components/pdf-flipbook';
import { brochurePdfs, companyProfileCatalog, findCatalog, technicalCatalogBrands, type CatalogItem } from '@/lib/e-katalog-data';

const catalogNavItems = [
  { href: '/kataloglar', label: 'Kataloglar', icon: <FileText size={15} /> },
  { href: '/kataloglar/sirket-profili', label: 'Şirket Profili', icon: <Building2 size={15} /> },
  { href: '/kataloglar/teknik-kataloglar', label: 'Teknik Kataloglar', icon: <BookOpen size={15} /> },
  { href: '/kataloglar/brosurler', label: 'Broşürler', icon: <Images size={15} /> },
] as const;

function CatalogSideNav({ showBrands = false }: { showBrands?: boolean }) {
  const [location] = useLocation();
  const active = (href: string) => location === href || (href !== '/kataloglar' && location.startsWith(href)) || (href === '/kataloglar/teknik-kataloglar' && location.startsWith('/kataloglar/teknik/'));
  const currentBrand = showBrands ? technicalCatalogBrands.find((g) => location.startsWith(`/kataloglar/teknik/${g.slug}`)) : undefined;
  return <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-28">
    <Link href="/kataloglar" data-testid="sidenav-catalogs-title" className="font-display text-xl font-bold uppercase tracking-wide text-foreground transition-colors hover:text-primary">Kataloglar</Link>
    <ul className="mt-5 grid gap-1.5">
      {catalogNavItems.map(({ href, label, icon }) => <li key={href}>
        <Link href={href} data-testid={`sidenav-${href.split('/').pop()}`} className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${active(href) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted hover:text-primary'}`}>{icon}{label}</Link>
      </li>)}
    </ul>
    {showBrands && <div className="mt-6 border-t border-border pt-5">
      <Link href="/kataloglar/teknik-kataloglar" data-testid="brandnav-title" className="font-display text-lg font-bold uppercase tracking-wide text-foreground transition-colors hover:text-primary">Teknik Kataloglar</Link>
      <ul className="mt-4 grid gap-1">
        {technicalCatalogBrands.map((g) => <li key={g.slug}>
          <Link href={`/kataloglar/teknik/${g.slug}`} data-testid={`brandnav-${g.slug}`} className={`block rounded-md px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${currentBrand?.slug === g.slug ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted hover:text-primary'}`}>{g.name}</Link>
        </li>)}
      </ul>
    </div>}
  </aside>;
}

function CatalogLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
    <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]"><CatalogSideNav /><div className="min-w-0">{children}</div></div>
  </main>;
}

function CatalogCard({ item, href }: { item: CatalogItem; href: string }) {
  return <Link href={href} data-testid={`card-e-katalog-${item.slug}`} className="lift group overflow-hidden rounded-xl border border-border bg-card">
    <div className="flex h-64 items-center justify-center bg-white p-4 sm:h-72"><img src={item.image} alt={item.title} width={600} height={800} loading="lazy" className="max-h-full max-w-full object-contain" /></div>
    <div className="border-t border-border p-4"><p className="text-sm font-bold leading-5 group-hover:text-primary">{item.title}</p><p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">İncele <ArrowRight size={13} /></p></div>
  </Link>;
}

export function EKatalogHome() {
  const sections = [
    { href: '/kataloglar/sirket-profili', title: 'Şirket Profili', desc: 'Kurumsal tanıtım sunumumuz ve şirket profilimiz.', icon: <Building2 size={22} /> },
    { href: '/kataloglar/teknik-kataloglar', title: 'Teknik Kataloglar', desc: 'IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler, Koyo ve RBC katalogları.', icon: <BookOpen size={22} /> },
    { href: '/kataloglar/brosurler', title: 'Broşürler', desc: 'Ürün gruplarımıza ait güncel broşür ve dökümanlar.', icon: <Images size={22} /> },
  ];
  return <>
    <PageIntro eyebrow="E-Katalog" title="Tüm katalog ve broşürlerimiz tek yerde." description="Şirket profilimizden marka teknik kataloglarına kadar tüm dokümanları inceleyin." />
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <CatalogSideNav />
        <div className="min-w-0">
      <div className="grid gap-5 md:grid-cols-3">
        {sections.map((s) => <Link key={s.href} href={s.href} data-testid={`card-e-katalog-section-${s.title}`} className="lift group rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/40">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">{s.icon}</span>
          <h2 className="mt-5 font-display text-2xl font-semibold group-hover:text-primary">{s.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">Kategoriye git <ArrowRight size={14} /></span>
        </Link>)}
      </div>
        </div>
      </div>
      <div className="mt-14 rounded-xl bg-sidebar p-7 text-sidebar-foreground md:flex md:items-center md:justify-between md:p-9"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Güncel döküman</p><p className="mt-2 font-display text-2xl font-semibold">RMS Rulmak Kurumsal Broşür (PDF)</p></div><a href="/catalog/rulmak-e-katalog.pdf" download data-testid="link-e-katalog-brochure-pdf" className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 md:mt-0">PDF indir <Download size={16} /></a></div>
    </main>
  </>;
}

export function EKatalogSection() {
  const { section = '' } = useParams<{ section: string }>();
  if (section === 'sirket-profili') {
    return <>
      <PageIntro eyebrow="Kataloglar" title="Şirket Profili" description="RMS Rulmak kurumsal tanıtım dokümanları." />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <CatalogSideNav />
          <div className="min-w-0">
        <Link href="/kataloglar" data-testid="link-back-e-katalog" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Kataloglar</Link>
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="bg-white p-6"><img src={companyProfileCatalog.image} alt={companyProfileCatalog.title} className="mx-auto max-h-[560px] w-auto object-contain" /></div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-6"><p className="font-display text-xl font-semibold">{companyProfileCatalog.title}</p><Link href="/kataloglar/katalog/sirket-profili" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Tam sayfa görüntüle <ArrowRight size={15} /></Link></div>
        </div>
          </div>
        </div>
      </main>
    </>;
  }
  if (section === 'brosurler') {
    return <>
      <PageIntro eyebrow="Kataloglar" title="Broşürler" description="Güncel broşür ve tanıtım dokümanlarımızı indirin." />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <CatalogSideNav />
          <div className="min-w-0">
        <Link href="/kataloglar" data-testid="link-back-e-katalog" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Kataloglar</Link>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="lift overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex h-64 items-center justify-center bg-white p-4 sm:h-72"><img src={companyProfileCatalog.image} alt="RMS Rulmak Broşür" className="max-h-full max-w-full object-contain" /></div>
            <div className="border-t border-border p-4"><p className="text-sm font-bold leading-5">RMS Rulmak Kurumsal Broşür</p><a href={brochurePdfs[0].file} download data-testid="link-brochure-pdf" className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline">PDF indir <Download size={13} /></a></div>
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-dashed border-border p-8 text-center">
            <FileText size={26} className="mx-auto text-primary" /><p className="mt-3 text-sm font-semibold text-foreground">Marka broşürleri</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Güncellendikçe PDF olarak ekleniyor; teknik kataloglara göz atabilirsiniz.</p>
            <Link href="/kataloglar/teknik-kataloglar" data-testid="link-brochure-to-technical" className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">Teknik Kataloglar <ArrowRight size={13} /></Link>
          </div>
        </div>
          </div>
        </div>
      </main>
    </>;
  }
  if (section === 'teknik-kataloglar') {
    return <>
      <PageIntro eyebrow="Kataloglar" title="Teknik Kataloglar" description="Distribütörlüğünü yaptığımız markaların teknik katalogları." />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <CatalogSideNav showBrands />
          <div className="min-w-0">
        <Link href="/kataloglar" data-testid="link-back-e-katalog" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Kataloglar</Link>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {technicalCatalogBrands.map((g) => <Link key={g.slug} href={`/kataloglar/teknik/${g.slug}`} data-testid={`card-e-katalog-brand-${g.slug}`} className="lift group flex flex-col items-center rounded-xl bg-white p-6 text-center transition hover:shadow-md">
            <div className="flex h-28 w-full items-center justify-center"><img src={`/brand/reference/${g.slug}-logo.jpg`} alt={g.name} width={1000} height={300} loading="lazy" className="h-full w-full max-w-[180px] object-contain" style={{ mixBlendMode: 'multiply' }} /></div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">{g.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{g.items.length} katalog</p>
          </Link>)}
        </div>
          </div>
        </div>
      </main>
    </>;
  }
  return <PageIntro eyebrow="Kataloglar" title="Bölüm bulunamadı" />;
}

export function EKatalogBrand() {
  const { brand = '' } = useParams<{ brand: string }>();
  const group = technicalCatalogBrands.find((g) => g.slug === brand);
  if (!group) return <PageIntro eyebrow="Teknik Kataloglar" title="Marka bulunamadı" />;
  return <>
    <PageIntro eyebrow="Teknik Kataloglar" title={`${group.name} Katalogları`} description={`${group.items.length} doküman — incelemek için kapağa tıklayın.`} />
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <CatalogSideNav showBrands />
        <div className="min-w-0">
      <Link href="/kataloglar/teknik-kataloglar" data-testid="link-back-technical-catalogs" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Teknik Kataloglar</Link>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => <CatalogCard key={item.slug} item={item} href={`/kataloglar/katalog/${item.slug}`} />)}
      </div>
        </div>
      </div>
    </main>
  </>;
}

export function EKatalogDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const item = findCatalog(slug);
  if (!item) return <PageIntro eyebrow="Katalog" title="Katalog bulunamadı" description="Aradığınız doküman kaldırılmış olabilir." />;
  const group = technicalCatalogBrands.find((g) => g.slug === item.brandSlug);
  const back = item.brandSlug === 'rms' ? '/kataloglar/sirket-profili' : `/kataloglar/teknik/${group?.slug ?? '/kataloglar'}`;
  const otherItems = group ? group.items.filter((i) => i.slug !== item.slug).slice(0, 4) : [];
  return <>
    <PageIntro eyebrow={group ? `${group.name} / Katalog` : 'Katalog'} title={item.title} />
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <CatalogSideNav showBrands={!!group} />
        <div className="min-w-0">
      <Link href={back} data-testid="link-back-from-catalog" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Geri</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
          {item.file ? <PdfFlipbook src={item.file} title={item.title} /> : <img src={item.image} alt={item.title} className="mx-auto max-h-[720px] w-auto object-contain" />}
        </div>
        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{group?.name ?? 'RMS Rulmak'}</p>
          <h2 className="mt-2 font-display text-xl font-semibold">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.file ? 'Katalog PDF olarak sayfa içinde görüntüleniyor. İnceleyebilir veya indirebilirsiniz.' : 'Katalog kapağını görüntülediniz. Tam sürüm veya dijital PDF için ekibimizden talep oluşturabilirsiniz.'}</p>
          <div className="mt-5 grid gap-2.5">
            {item.file ? <a href={item.file} download data-testid="link-catalog-download" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">PDF indir <Download size={15} /></a> : <Link href="/iletisim" data-testid="link-catalog-request" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">PDF talep et <ArrowRight size={15} /></Link>}
            <a href={item.image} download={`${item.slug}-kapak.png`} data-testid="link-catalog-cover-download" className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-bold transition-colors hover:border-primary hover:text-primary">Kapak görseli indir <Download size={15} /></a>
          </div>
          {otherItems.length > 0 && <div className="mt-7 border-t border-border pt-5"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aynı markadan diğerleri</p><div className="mt-3 grid gap-2">{otherItems.map((o) => <Link key={o.slug} href={`/kataloglar/katalog/${o.slug}`} data-testid={`link-other-${o.slug}`} className="rounded-md px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-muted hover:text-primary">{o.title}</Link>)}</div></div>}
        </aside>
      </div>
        </div>
      </div>
    </main>
  </>;
}
