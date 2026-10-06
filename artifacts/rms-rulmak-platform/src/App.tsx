import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateContactMessage, useCreateProductRequest, useGetDashboardSummary, useGetProduct, useListBrands, useListCategories, useListProducts } from '@workspace/api-client-react';
import type { Brand, Category, Product, ProductListItem, Sector } from '@workspace/api-client-react';
import { ArrowDownRight, ArrowRight, BarChart3, BookOpen, Check, ChevronLeft, ChevronRight, CircleAlert, Factory, Filter, Gauge, Headphones, Layers3, Loader2, Mail, MapPin, Menu, PackageSearch, Phone, Search, ShieldCheck, Sparkles, Target, Users, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { CatalogAdminPage, CatalogsPage } from '@/pages/catalogs';

const queryClient = new QueryClient();
const redLogo = '/brand/rulmak-red.png';
const whiteLogo = '/brand/rulmak-white.png';
const redIcon = '/brand/rulmak-icon-red.png';

function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return <img data-testid="img-brand-logo" src={compact ? redIcon : dark ? whiteLogo : redLogo} alt="RMS Rulmak" className={compact ? 'h-9 w-9 object-contain' : 'h-9 w-auto max-w-[174px] object-contain'} />;
}

const navItems = [
  ['/urunler', 'Ürünler'],
  ['/markalar', 'Markalar'],
  ['/kataloglar', 'Kataloglar'],
  ['/kategoriler', 'Kategoriler'],
  ['/sektorler', 'Sektörler'],
  ['/kurumsal', 'Kurumsal'],
  ['/blog', 'Teknik Bilgi'],
  ['/iletisim', 'İletişim'],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link href="/" data-testid="link-home-logo" className="flex items-center gap-3"><Logo /><span className="hidden border-l border-border pl-3 text-[10px] font-bold uppercase leading-tight tracking-[.15em] text-muted-foreground sm:block">Teknik<br />çözüm ortağınız</span></Link>
      <button data-testid="button-mobile-menu" onClick={() => setOpen(!open)} className="rounded-lg p-2 text-foreground lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
      <nav className={`${open ? 'absolute left-0 right-0 top-[76px] flex border-b border-border bg-background p-5 shadow-xl' : 'hidden'} flex-col gap-2 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
        {navItems.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-nav-${label}`} className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-primary ${location === href ? 'text-primary' : 'text-muted-foreground'}`}>{label}</Link>)}
      </nav>
    </div>
  </header>;
}

function Footer() {
  return <footer className="bg-sidebar text-sidebar-foreground">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_.8fr_.8fr_1fr] lg:px-8">
      <div><Logo dark /><p className="mt-5 max-w-xs text-sm leading-7 text-sidebar-foreground/65">Hareketin devamlılığı için doğru teknik çözüm. Rulman ve güç aktarımında güvenilir iş ortağınız.</p><div className="mt-6 flex gap-2 text-xs text-sidebar-foreground/50"><span>© 2024 RMS Rulmak</span><span>•</span><span>İstanbul, Türkiye</span></div></div>
      <div><p className="eyebrow !text-red-400">Keşfet</p><div className="mt-4 flex flex-col gap-3 text-sm text-sidebar-foreground/70">{navItems.slice(0, 4).map(([href, label]) => <Link key={href} href={href} data-testid={`link-footer-${label}`} className="transition-colors hover:text-white">{label}</Link>)}</div></div>
      <div><p className="eyebrow !text-red-400">Kurumsal</p><div className="mt-4 flex flex-col gap-3 text-sm text-sidebar-foreground/70"><Link href="/kurumsal">Hakkımızda</Link><Link href="/kataloglar">Katalog arşivi</Link><Link href="/yonetim/kataloglar" data-testid="link-footer-catalog-admin">Yönetici paneli</Link><Link href="/iletisim" data-testid="link-footer-support">Teknik destek</Link></div></div>
      <div><p className="eyebrow !text-red-400">Bize ulaşın</p><div className="mt-4 space-y-3 text-sm text-sidebar-foreground/70"><a className="flex gap-2 hover:text-white" href="tel:+902163924141"><Phone size={15} className="mt-0.5 text-red-400" /> +90 216 392 41 41</a><a className="flex gap-2 hover:text-white" href="mailto:info@rmsrulmak.com"><Mail size={15} className="mt-0.5 text-red-400" /> info@rmsrulmak.com</a><p className="flex gap-2"><MapPin size={15} className="mt-0.5 text-red-400" /> Şifa Mah. Şekerpınar Cad. No: 11 4/B, Tuzla / İstanbul</p></div></div>
    </div>
    <div className="border-t border-sidebar-border px-5 py-4 text-center text-xs text-sidebar-foreground/45">RMS Rulmak — Endüstriyel güven, ölçülebilir performans.</div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="grain min-h-[100dvh]"><Header />{children}<Footer /></div>;
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <section className="shell-grid border-b border-border bg-muted/35"><div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20"><p className="eyebrow reveal">{eyebrow}</p><h1 className="font-display reveal reveal-delay-1 mt-4 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-.045em] text-foreground md:text-6xl">{title}</h1>{description && <p className="reveal reveal-delay-2 mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>}</div></section>;
}

function LoadingState({ label = 'Veriler hazırlanıyor' }: { label?: string }) {
  return <div data-testid="status-loading" className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((n) => <div key={n} className="h-52 animate-pulse rounded-xl border border-border bg-muted/55" />)}<div className="col-span-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" /> {label}</div></div>;
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div data-testid="status-error" className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"><CircleAlert className="mx-auto text-primary" /><h3 className="mt-3 font-display text-xl font-semibold">İçerik yüklenemedi</h3><p className="mt-2 text-sm text-muted-foreground">Bağlantıyı kontrol edip tekrar deneyin.</p>{onRetry && <button data-testid="button-retry" onClick={onRetry} className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Tekrar dene</button>}</div>;
}

function EmptyState({ title = 'Kayıt bulunamadı', text = 'Aramanızı değiştirerek tekrar deneyin.' }: { title?: string; text?: string }) {
  return <div data-testid="status-empty" className="rounded-xl border border-dashed border-border bg-muted/20 p-14 text-center"><PackageSearch className="mx-auto text-primary" size={30} /><h3 className="mt-4 font-display text-xl font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div>;
}

function Stat({ value, label, icon: Icon }: { value: string | number; label: string; icon: typeof Gauge }) {
  return <div className="border-l-2 border-primary/30 pl-4"><Icon size={18} className="text-primary" /><p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p></div>;
}

function ProductVisual({ src, name }: { src?: string; name: string }) {
  return <div className="relative flex h-48 items-center justify-center overflow-hidden bg-muted/55 p-6"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(var(--primary) / .2) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />{src ? <img src={src} alt={name} className="relative z-10 h-full w-full object-contain mix-blend-multiply" /> : <img src={redIcon} alt="" className="relative z-10 h-20 w-20 object-contain opacity-70" />}</div>;
}

const referenceSlides = [
  { image: '/brand/reference/hero-idc.jpg', label: 'IDC hassas rulman çözümleri', href: '/markalar#idc' },
  { image: '/brand/reference/hero-gates.jpg', label: 'Gates güç aktarım ürünleri', href: '/markalar#gates' },
  { image: '/brand/reference/hero-dunlop.jpg', label: 'Dunlop endüstriyel çözümleri', href: '/markalar#dunlop' },
  { image: '/brand/reference/hero-ntn.jpg', label: 'NTN rulman teknolojisi', href: '/markalar#ntn' },
  { image: '/brand/reference/hero-nsk.jpg', label: 'NSK hassas rulman çözümleri', href: '/markalar#nsk' },
] as const;

const referenceBrands = [
  { name: 'IDC', image: '/brand/reference/idc.jpg', href: '/markalar#idc' },
  { name: 'Gates', image: '/brand/reference/gates.jpg', href: '/markalar#gates' },
  { name: 'Dunlop', image: '/brand/reference/dunlop.jpg', href: '/markalar#dunlop' },
  { name: 'NTN', image: '/brand/reference/ntn.jpg', href: '/markalar#ntn' },
  { name: 'NSK', image: '/brand/reference/nsk.jpg', href: '/markalar#nsk' },
] as const;

function ReferenceHeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % referenceSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goTo = (index: number) => setActive((index + referenceSlides.length) % referenceSlides.length);
  const slide = referenceSlides[active];

  return <section
    aria-label="RMS Rulmak öne çıkan marka ve ürün sliderı"
    className="relative overflow-hidden border-b border-border bg-white"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
  >
    <div className="relative aspect-[2560/760] min-h-[220px] w-full overflow-hidden sm:min-h-[280px] lg:min-h-[390px]">
      {referenceSlides.map((item, index) => <Link
        key={item.image}
        href={item.href}
        aria-label={item.label}
        aria-hidden={active !== index}
        tabIndex={active === index ? 0 : -1}
        className={`absolute inset-0 block transition-opacity duration-700 ${active === index ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <img
          src={item.image}
          alt={item.label}
          className="h-full w-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </Link>)}
      <button
        type="button"
        aria-label="Önceki slider görseli"
        data-testid="button-hero-slider-prev"
        onClick={() => goTo(active - 1)}
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition hover:bg-white sm:left-6"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Sonraki slider görseli"
        data-testid="button-hero-slider-next"
        onClick={() => goTo(active + 1)}
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition hover:bg-white sm:right-6"
      >
        <ChevronRight size={22} />
      </button>
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
        {referenceSlides.map((item, index) => <button
          key={item.image}
          type="button"
          aria-label={`${index + 1}. slider görseline git`}
          aria-current={active === index}
          data-testid={`button-hero-slider-dot-${index}`}
          onClick={() => goTo(index)}
          className={`h-2 rounded-full transition-all ${active === index ? 'w-7 bg-white' : 'w-2 bg-white/55 hover:bg-white/80'}`}
        />)}
      </div>
    </div>
  </section>;
}

function ReferenceBrandSlider() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollBrands = (direction: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({ left: direction * viewport.clientWidth * 0.85, behavior: 'smooth' });
  };

  return <section className="border-b border-border bg-background">
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="eyebrow">Yetkili marka portföyü</p><h2 className="mt-2 font-display text-2xl font-semibold">Güvendiğimiz üreticiler</h2></div>
        <div className="flex gap-2">
          <button type="button" aria-label="Önceki markalar" data-testid="button-brand-slider-prev" onClick={() => scrollBrands(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition hover:border-primary"><ChevronLeft size={18} /></button>
          <button type="button" aria-label="Sonraki markalar" data-testid="button-brand-slider-next" onClick={() => scrollBrands(1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition hover:border-primary"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div ref={viewportRef} className="brand-slider-viewport">
        <div className="brand-slider-track">
          {referenceBrands.map((brand) => <Link key={brand.name} href={brand.href} data-testid={`link-brand-slider-${brand.name.toLowerCase()}`} className="brand-slider-card group flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-md">
            <img src={brand.image} alt={`${brand.name} logo`} className="h-16 w-full object-contain grayscale transition duration-300 group-hover:grayscale-0" loading="lazy" />
            <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{brand.name}</span>
          </Link>)}
        </div>
      </div>
    </div>
  </section>;
}

function Home() {
  const summaryQuery = useGetDashboardSummary();
  const summary = summaryQuery.data;
  return <Shell>
    <main>
      <ReferenceHeroSlider />
      <ReferenceBrandSlider />
      <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
        <div className="absolute right-[-8%] top-[-45%] h-[850px] w-[850px] rounded-full border border-white/10" /><div className="absolute right-[5%] top-[-30%] h-[580px] w-[580px] rounded-full border border-primary/40 hero-orbit" /><div className="absolute right-[15%] top-[8%] h-3 w-3 rounded-full bg-accent shadow-[0_0_0_12px_hsl(36_80%_58%/.1)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[1fr_.72fr] lg:px-8 lg:py-28">
          <div className="relative z-10"><p className="eyebrow reveal !text-red-400">Rulmak Endüstriyel Çözümler</p><h1 className="font-display reveal reveal-delay-1 mt-6 max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] md:text-7xl">Dönüşün olduğu her yerde <span className="text-red-400">güven</span> var.</h1><p className="reveal reveal-delay-2 mt-7 max-w-xl text-lg leading-8 text-sidebar-foreground/65">Rulman ve güç aktarımında doğru ürünü, doğru teknik bilgiyle buluşturuyoruz. Üretiminiz durmasın diye.</p><div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3"><Link href="/kataloglar" data-testid="link-hero-products" className="inline-flex items-center gap-3 rounded-md bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">Katalogları incele <ArrowRight size={17} /></Link><Link href="/iletisim" data-testid="link-hero-contact" className="inline-flex items-center gap-3 rounded-md border border-white/20 px-5 py-3.5 text-sm font-bold text-white hover:border-white/45">Teknik destek iste <Headphones size={17} /></Link></div></div>
          <div className="relative z-10 hidden justify-end lg:flex"><div className="w-[330px] rotate-3 border border-white/15 bg-white/[.04] p-5 backdrop-blur-sm"><div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="text-xs uppercase tracking-[.2em] text-white/50">RMS RULMAK</span><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"><Target size={15} /></span></div><div className="py-16"><img src={whiteLogo} alt="RMS Rulmak" className="w-full" /><p className="mt-7 text-sm leading-6 text-white/55">Hareket, hassasiyet ve süreklilik için mühendislik.</p></div><div className="flex justify-between border-t border-white/10 pt-4 text-xs text-white/45"><span>TEKNİK KATALOG</span><Link href="/kataloglar" className="hover:text-white">İNCELE ↗</Link></div></div></div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-9 px-5 py-16 lg:grid-cols-[.8fr_1.6fr] lg:px-8 lg:py-24"><div><p className="eyebrow">Neden Rulmak?</p><h2 className="industrial-rule mt-4 max-w-sm font-display text-4xl font-semibold leading-tight">Parçadan fazlası. Sürekliliğin ortağı.</h2></div><div className="grid gap-8 sm:grid-cols-3"><div className="lift rounded-xl border border-border bg-card p-6"><ShieldCheck className="text-primary" /><h3 className="mt-7 font-display text-xl font-semibold">Güvenilir tedarik</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Sektörünüze uygun markalar ve izlenebilir ürün bilgisi.</p></div><div className="lift rounded-xl border border-border bg-card p-6"><Sparkles className="text-primary" /><h3 className="mt-7 font-display text-xl font-semibold">Teknik netlik</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Karar vermeyi hızlandıran, sade ve doğru teknik içerik.</p></div><div className="lift rounded-xl border border-border bg-card p-6"><Users className="text-primary" /><h3 className="mt-7 font-display text-xl font-semibold">İnsan desteği</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Sorunuz olduğunda ulaşabileceğiniz gerçek bir ekip.</p></div></div></section>
      <section className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-4 lg:px-8">{summaryQuery.isLoading ? <div className="col-span-full h-12 animate-pulse rounded bg-white/15" /> : summaryQuery.isError ? <p className="col-span-full text-sm text-white/75">Katalog özeti şu an kullanılamıyor.</p> : <><Stat value={summary?.productCount ?? '—'} label="Ürün kaydı" icon={PackageSearch} /><Stat value={summary?.brandCount ?? '—'} label="Güvenilir marka" icon={Layers3} /><Stat value={summary?.categoryCount ?? '—'} label="Ürün kategorisi" icon={Filter} /><Stat value={summary?.sectorCount ?? '—'} label="Sektörel çözüm" icon={Factory} /></>}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Öne çıkanlar</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">Sahada kendini kanıtlamış ürünler</h2></div><Link href="/urunler" data-testid="link-home-all-products" className="hidden items-center gap-2 text-sm font-bold text-primary sm:flex">Tüm katalog <ArrowRight size={16} /></Link></div>{summaryQuery.isLoading ? <div className="mt-9"><LoadingState /></div> : summary?.featuredProducts?.length ? <div className="mt-9 grid gap-5 md:grid-cols-3">{summary.featuredProducts.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="mt-9"><EmptyState /></div>}</section>
      <section className="border-t border-border bg-muted/30"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 py-14 md:flex-row md:items-center lg:px-8"><div><p className="eyebrow">Birlikte planlayalım</p><h2 className="mt-3 font-display text-3xl font-semibold">Uygulamanız için doğru çözümü bulalım.</h2></div><Link href="/iletisim" data-testid="link-home-cta" className="inline-flex items-center gap-3 rounded-md bg-foreground px-5 py-3.5 text-sm font-bold text-background">Ekibimize ulaşın <ArrowDownRight size={16} /></Link></div></section>
    </main>
  </Shell>;
}

function ProductCard({ product }: { product: ProductListItem }) {
  return <Link href={`/urunler/${product.slug}`} data-testid={`card-product-${product.id}`} className="lift group overflow-hidden rounded-xl border border-border bg-card"><ProductVisual src={product.imageUrl} name={product.name} /><div className="p-5"><div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wider text-primary"><span>{product.brandName}</span><span className="text-muted-foreground">{product.code}</span></div><h3 className="mt-3 font-display text-xl font-semibold group-hover:text-primary">{product.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">İncele <ChevronRight size={14} className="text-primary transition-transform group-hover:translate-x-1" /></span></div></Link>;
}

function Products() {
  const [location] = useLocation();
  const initialParams = new URLSearchParams(location.split('?')[1] ?? '');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(initialParams.get('category') ?? '');
  const [brand, setBrand] = useState(initialParams.get('brand') ?? '');
  const products = useListProducts({ q: q || undefined, category: category || undefined, brand: brand || undefined, limit: 48, offset: 0 });
  const categories = useListCategories();
  const brands = useListBrands();
  const items = products.data?.items ?? [];
  return <Shell><PageIntro eyebrow="Teknik katalog" title="Ürünler, ölçüsüyle değil çözümüyle anlamlı." description="Ürün kodu, marka veya kategoriyle arayın. Kararınızı destekleyecek teknik bilgiler ve dokümanlara tek yerde ulaşın." /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14"><div className="mb-9 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_200px_200px]"><label className="relative block"><Search size={18} className="absolute left-3 top-3.5 text-muted-foreground" /><input data-testid="input-product-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün, kod veya marka ara..." className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none ring-primary transition focus:ring-2" /></label><select data-testid="select-product-category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"><option value="">Tüm kategoriler</option>{categories.data?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select><select data-testid="select-product-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"><option value="">Tüm markalar</option>{brands.data?.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select></div><div className="mb-5 flex items-center justify-between text-sm text-muted-foreground"><span>{products.isLoading ? 'Aranıyor...' : `${products.data?.total ?? 0} ürün bulundu`}</span><span className="flex items-center gap-2"><Filter size={15} /> Teknik katalog</span></div>{products.isLoading ? <LoadingState label="Ürünler yükleniyor" /> : products.isError ? <ErrorState onRetry={() => products.refetch()} /> : items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <EmptyState title="Aramanızla eşleşen ürün yok" text="Ürün kodunu, marka adını veya kategori filtresini değiştirin." />}</main></Shell>;
}

function ProductDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const query = useGetProduct(slug, { query: { queryKey: ['/api/products', slug], enabled: !!slug } });
  const [requestOpen, setRequestOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const mutation = useCreateProductRequest();
  const product = query.data;
  if (query.isLoading) return <Shell><main className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><LoadingState label="Ürün bilgileri yükleniyor" /></main></Shell>;
  if (query.isError || !product) return <Shell><main className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><ErrorState onRetry={() => query.refetch()} /></main></Shell>;
  const submitRequest = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const fd = new FormData(event.currentTarget); mutation.mutate({ data: { fullName: String(fd.get('fullName')), company: String(fd.get('company') || ''), phone: String(fd.get('phone') || ''), email: String(fd.get('email')), productSlug: product.slug, productCode: product.code, message: String(fd.get('message')), kvkkAccepted: fd.get('kvkk') === 'on' } }, { onSuccess: () => { setSent(true); setRequestOpen(false); } }); };
  return <Shell><main><section className="shell-grid border-b border-border"><div className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><Link href="/urunler" data-testid="link-back-products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">← Ürün kataloğuna dön</Link><div className="mt-9 grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><ProductVisual src={product.imageUrl} name={product.name} /><div><p className="eyebrow">{product.brand.name} / {product.category.name}</p><h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">{product.name}</h1><p className="mt-3 font-mono text-sm text-muted-foreground">Ürün kodu: {product.code}</p><p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">{product.shortDescription}</p><button data-testid="button-product-request" onClick={() => setRequestOpen(true)} className="mt-8 inline-flex items-center gap-3 rounded-md bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground">Bu ürün hakkında bilgi iste <ArrowRight size={17} /></button>{sent && <p data-testid="status-request-success" className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700"><Check size={16} /> Talebiniz alındı, ekibimiz en kısa sürede size dönecek.</p>}</div></div></div></section><section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_.8fr] lg:px-8"><div><p className="eyebrow">Ürün hakkında</p><div className="prose prose-slate mt-5 max-w-2xl text-muted-foreground"><p>{product.description}</p></div><h2 className="mt-12 font-display text-2xl font-semibold">Teknik özellikler</h2>{product.technicalSpecs?.length ? <div className="mt-5 overflow-hidden rounded-xl border border-border">{product.technicalSpecs.map((spec) => <div key={spec.label} className="grid grid-cols-2 border-b border-border px-4 py-3 text-sm last:border-0"><span className="font-semibold">{spec.label}</span><span className="text-muted-foreground">{spec.value}</span></div>)}</div> : <EmptyState title="Teknik özellik yakında" text="Bu ürün için detaylı bilgi almak üzere ekibimize ulaşabilirsiniz." />}</div><aside className="h-fit rounded-xl bg-sidebar p-7 text-sidebar-foreground"><p className="eyebrow !text-red-400">Teknik destek</p><h2 className="mt-4 font-display text-2xl font-semibold">Uygulamanız için doğru seçim mi?</h2><p className="mt-4 text-sm leading-6 text-sidebar-foreground/65">Mil ve yataklama detaylarınızı paylaşın, uygun çözümü birlikte değerlendirelim.</p><Link href="/iletisim" data-testid="link-product-contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white">Ekibe danışın <ArrowRight size={15} className="text-red-400" /></Link></aside></section></main>{requestOpen && <ProductRequestModal product={product} onClose={() => setRequestOpen(false)} onSubmit={submitRequest} pending={mutation.isPending} />}</Shell>;
}

function ProductRequestModal({ product, onClose, onSubmit, pending }: { product: Product; onClose: () => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void; pending: boolean }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/65 p-4"><div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-xl bg-background p-6 shadow-2xl md:p-8"><div className="flex items-start justify-between"><div><p className="eyebrow">Bilgi talebi</p><h2 className="mt-2 font-display text-2xl font-semibold">{product.name}</h2></div><button data-testid="button-close-request" onClick={onClose} className="rounded-md p-2 hover:bg-muted"><X size={18} /></button></div><form onSubmit={onSubmit} className="mt-7 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><input required name="fullName" data-testid="input-request-name" placeholder="Ad soyad *" className="field" /><input name="company" data-testid="input-request-company" placeholder="Firma" className="field" /><input required type="email" name="email" data-testid="input-request-email" placeholder="E-posta *" className="field" /><input name="phone" data-testid="input-request-phone" placeholder="Telefon" className="field" /></div><textarea required minLength={10} name="message" data-testid="input-request-message" placeholder="İhtiyacınızı kısaca anlatın *" className="field min-h-28 resize-y" /><label className="flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" name="kvkk" data-testid="input-request-kvkk" className="mt-0.5 accent-primary" /> KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.</label><button disabled={pending} data-testid="button-submit-request" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">{pending && <Loader2 size={16} className="animate-spin" />} Talebi gönder</button></form></div></div>;
}

function DirectoryPage({ kind }: { kind: 'brand' | 'category' }) {
  const query = kind === 'brand' ? useListBrands() : useListCategories();
  const items = query.data ?? [];
  return <Shell><PageIntro eyebrow={kind === 'brand' ? 'Marka portföyü' : 'Ürün aileleri'} title={kind === 'brand' ? 'Doğru markayla, doğru uygulama.' : 'İhtiyacınızı doğru kategoride bulun.'} description={kind === 'brand' ? 'Endüstriyel uygulamalarda güven veren üreticileri ve ürün gruplarını tek bir teknik arşivde buluşturuyoruz.' : 'Rulman, güç aktarımı ve hareket bileşenlerini kullanım amacına göre keşfedin.'} /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">{query.isLoading ? <LoadingState /> : query.isError ? <ErrorState onRetry={() => query.refetch()} /> : items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <DirectoryCard key={item.id} item={item} kind={kind} />)}</div> : <EmptyState />}</main></Shell>;
}

function DirectoryCard({ item, kind }: { item: Brand | Category; kind: 'brand' | 'category' }) {
  const isBrand = kind === 'brand';
  return <Link href={`/urunler?${isBrand ? 'brand' : 'category'}=${item.slug}`} data-testid={`card-${kind}-${item.id}`} className="lift group relative overflow-hidden rounded-xl border border-border bg-card p-6"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-primary">{isBrand && 'logoUrl' in item && item.logoUrl ? <img src={item.logoUrl} alt={item.name} className="h-8 w-8 object-contain" /> : isBrand ? <Layers3 size={20} /> : <Factory size={20} />}</span><ArrowUpRightIcon /></div><h2 className="mt-8 font-display text-2xl font-semibold group-hover:text-primary">{item.name}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p><div className="mt-6 border-t border-border pt-4 text-xs font-bold uppercase tracking-wider text-primary">{item.productCount} ürün</div></Link>;
}

function ArrowUpRightIcon() { return <ArrowDownRight size={19} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />; }

function Sectors() {
  const summary = useGetDashboardSummary();
  const sectors: Sector[] = summary.data?.sectors ?? [];
  const fallback: Sector[] = [{ name: 'Üretim ve imalat', slug: 'uretim', description: 'Makine hatlarının sürekliliği için hareket ve aktarma çözümleri.' }, { name: 'Enerji', slug: 'enerji', description: 'Zorlu koşullarda güvenilirlik ve düşük bakım ihtiyacı.' }, { name: 'Gıda ve paketleme', slug: 'gida', description: 'Hijyenik, hassas ve yüksek çevrimli uygulamalar için.' }, { name: 'Lojistik', slug: 'lojistik', description: 'Konveyör ve taşıma sistemlerinde kesintisiz hareket.' }];
  const list = sectors.length ? sectors : fallback;
  return <Shell><PageIntro eyebrow="Sektörel uzmanlık" title="Her sektörün ritmi farklı. Çözümünüz de öyle." description="Uygulamanın çalışma koşullarını anlayarak, doğru bileşeni teknik bir bakışla seçmenize yardımcı oluyoruz." /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">{summary.isLoading ? <LoadingState /> : <div className="grid gap-5 md:grid-cols-2">{list.map((s, i) => <div key={s.slug} data-testid={`card-sector-${s.slug}`} className="lift group relative overflow-hidden rounded-xl border border-border bg-card p-7"><span className="font-mono text-sm text-primary">0{i + 1}</span><Factory className="absolute right-7 top-7 text-muted-foreground/40" size={28} /><h2 className="mt-12 font-display text-3xl font-semibold group-hover:text-primary">{s.name}</h2><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{s.description}</p><Link href="/iletisim" data-testid={`link-sector-contact-${s.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold">Çözüm danışmanlığı <ArrowRight size={15} className="text-primary" /></Link></div>)}</div>}</main></Shell>;
}

function Corporate() {
  return <Shell><PageIntro eyebrow="RMS Rulmak" title="Güven, teknik bilgiyle başlar." description="Rulmak; rulman ve güç aktarımı alanında, müşterilerinin operasyonel sürekliliğini odağına alan bir çözüm ortağıdır." /><main><section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-24"><div><p className="eyebrow">Biz kimiz?</p><h2 className="industrial-rule mt-4 font-display text-4xl font-semibold">Parçaları değil, üretimdeki zamanı koruyoruz.</h2></div><div className="space-y-5 text-base leading-8 text-muted-foreground"><p>Her uygulamanın kendi dili, yükü ve çalışma koşulu vardır. Biz bu detayları dinler; ürün seçimini yalnızca katalogdan değil, sahadaki gerçek ihtiyaçtan kurarız.</p><p>RMS Rulmak, teknik ürün bilgisi ile insan ilişkisini aynı masada buluşturur. B2B müşterilerimiz için hızlı erişilen bir katalog, şeffaf iletişim ve tekrar tekrar güvenebilecekleri bir çalışma biçimi sunar.</p><div className="grid gap-6 border-t border-border pt-8 sm:grid-cols-3"><Stat value="01" label="Teknik yaklaşım" icon={Gauge} /><Stat value="24/7" label="Operasyon odağı" icon={BarChart3} /><Stat value="TR" label="Yerel uzmanlık" icon={MapPin} /></div></div></section><section className="bg-sidebar text-sidebar-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3 lg:px-8"><div><p className="eyebrow !text-red-400">İlkelerimiz</p><h2 className="mt-4 font-display text-3xl font-semibold">İşin doğru yapılması için üç net söz.</h2></div>{[['01', 'Şeffaflık', 'Ürün, süre ve süreç hakkında açık konuşuruz.'], ['02', 'Süreklilik', 'Bugünü değil, uzun vadeli operasyonu planlarız.'], ['03', 'Sorumluluk', 'Önerdiğimiz çözümün arkasında dururuz.']].map(([no, title, text]) => <div key={no} className="border-t border-white/15 pt-5"><span className="font-mono text-sm text-red-400">{no}</span><h3 className="mt-8 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/60">{text}</p></div>)}</div></section></main></Shell>;
}

const posts = [{ tag: 'Uygulama notu', title: 'Rulman seçerken yalnızca yük kapasitesine bakmak neden yetmez?', date: '12 Haziran 2024', time: '6 dk' }, { tag: 'Bakım rehberi', title: 'Güç aktarım sistemlerinde plansız duruşu azaltmanın 4 yolu', date: '28 Mayıs 2024', time: '8 dk' }, { tag: 'Teknik sözlük', title: 'Rulman boşluğu, tolerans ve hassasiyet sınıfları', date: '09 Mayıs 2024', time: '5 dk' }];
function Blog() { return <Shell><PageIntro eyebrow="Teknik bilgi" title="Sahada işe yarayan bilgiler." description="Seçim, bakım ve uygulama kararlarını daha güvenle almanız için kısa teknik notlar." /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="grid gap-5 lg:grid-cols-3">{posts.map((post, i) => <article key={post.title} data-testid={`card-blog-${i}`} className="lift group rounded-xl border border-border bg-card p-6"><div className="flex items-center justify-between"><span className="eyebrow">{post.tag}</span><BookOpen size={18} className="text-muted-foreground" /></div><div className="mt-16 h-px bg-border" /><h2 className="mt-5 font-display text-2xl font-semibold leading-tight group-hover:text-primary">{post.title}</h2><div className="mt-7 flex justify-between text-xs text-muted-foreground"><span>{post.date}</span><span>{post.time} okuma</span></div><button data-testid={`button-blog-read-${i}`} onClick={() => window.alert('Bu teknik içerik yakında yayında olacak.')} className="mt-6 inline-flex items-center gap-2 text-sm font-bold">Okumaya başla <ArrowRight size={15} className="text-primary" /></button></article>)}</div><div className="mt-14 rounded-xl bg-muted p-8 md:flex md:items-center md:justify-between"><div><p className="eyebrow">Yeni içeriklerden haberdar olun</p><p className="mt-2 text-sm text-muted-foreground">Teknik notları ve ürün güncellemelerini e-postanıza alabilirsiniz.</p></div><Link href="/iletisim" data-testid="link-blog-contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold md:mt-0">Bize yazın <ArrowRight size={15} className="text-primary" /></Link></div></main></Shell>; }

function Contact() {
  const mutation = useCreateContactMessage();
  const [success, setSuccess] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const fd = new FormData(event.currentTarget); mutation.mutate({ data: { fullName: String(fd.get('fullName')), company: String(fd.get('company') || ''), phone: String(fd.get('phone') || ''), email: String(fd.get('email')), subject: String(fd.get('subject')), message: String(fd.get('message')), kvkkAccepted: fd.get('kvkk') === 'on' } }, { onSuccess: () => setSuccess(true) }); };
  return <Shell><PageIntro eyebrow="İletişim" title="İhtiyacınızı anlatın, birlikte netleştirelim." description="Ürün, teknik seçim, tedarik veya B2B üyelik konularında ekibimiz size geri dönsün." /><main className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-16"><div><div className="space-y-7">{[['Telefon', '+90 (216) 000 00 00', Phone], ['E-posta', 'satis@rmsrulmak.com', Mail], ['Adres', 'İstanbul, Türkiye', MapPin]].map(([label, text, Icon]) => <div key={String(label)} className="flex gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">{typeof Icon === 'function' && <Icon size={18} />}</span><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{String(label)}</p><p className="mt-1 font-semibold">{String(text)}</p></div></div>)}</div><div className="mt-12 border-t border-border pt-8"><p className="eyebrow">Çalışma saatleri</p><p className="mt-3 text-sm leading-7 text-muted-foreground">Pazartesi — Cuma<br />08:30 — 18:00</p></div></div><div className="rounded-xl border border-border bg-card p-6 md:p-8">{success ? <div data-testid="status-contact-success" className="flex min-h-[390px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700"><Check /></span><h2 className="mt-5 font-display text-3xl font-semibold">Mesajınız ulaştı.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecek.</p><button data-testid="button-new-contact" onClick={() => setSuccess(false)} className="mt-7 text-sm font-bold text-primary">Yeni mesaj gönder</button></div> : <form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><input required name="fullName" data-testid="input-contact-name" placeholder="Ad soyad *" className="field" /><input name="company" data-testid="input-contact-company" placeholder="Firma" className="field" /><input required type="email" name="email" data-testid="input-contact-email" placeholder="E-posta *" className="field" /><input name="phone" data-testid="input-contact-phone" placeholder="Telefon" className="field" /></div><input required name="subject" data-testid="input-contact-subject" placeholder="Konu *" className="field" /><textarea required minLength={10} name="message" data-testid="input-contact-message" placeholder="Mesajınız *" className="field min-h-36 resize-y" /><label className="flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" name="kvkk" data-testid="input-contact-kvkk" className="mt-0.5 accent-primary" /> KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.</label>{mutation.isError && <p data-testid="status-contact-error" className="text-sm text-red-600">Mesaj gönderilemedi. Lütfen tekrar deneyin.</p>}<button disabled={mutation.isPending} data-testid="button-submit-contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">{mutation.isPending && <Loader2 size={16} className="animate-spin" />} Mesajı gönder</button></form>}</div></main></Shell>;
}

function Auth({ register = false }: { register?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  return <div className="min-h-[100dvh] bg-sidebar text-sidebar-foreground"><div className="mx-auto grid min-h-[100dvh] max-w-7xl lg:grid-cols-[.9fr_1.1fr]"><div className="relative hidden overflow-hidden p-10 lg:block"><div className="absolute -left-36 top-20 h-96 w-96 rounded-full border border-white/10" /><div className="absolute left-20 top-56 h-64 w-64 rounded-full border border-primary/50" /><Link href="/" data-testid="link-auth-logo"><Logo dark /></Link><div className="absolute bottom-16 max-w-sm"><p className="eyebrow !text-red-400">RMS Rulmak B2B</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight">İşinizin ritmini birlikte koruyalım.</h1><p className="mt-5 text-sm leading-7 text-white/55">Size özel katalog, hızlı talep yönetimi ve RMS ekibiyle doğrudan iletişim.</p></div></div><div className="flex items-center bg-background p-5 md:p-12"><div className="mx-auto w-full max-w-md"><Link href="/" data-testid="link-auth-mobile-logo" className="lg:hidden"><Logo /></Link>{submitted ? <div data-testid="status-auth-success" className="py-10"><Check className="text-primary" size={34} /><h2 className="mt-6 font-display text-3xl font-semibold">Talebiniz alındı.</h2><p className="mt-3 leading-7 text-muted-foreground">{register ? 'Firma kaydınız inceleniyor. Ekibimiz doğrulama için sizinle iletişime geçecek.' : 'Giriş bilgileriniz kontrol ediliyor.'}</p><Link href="/" data-testid="link-auth-back" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">Ana sayfaya dön <ArrowRight size={15} /></Link></div> : <><p className="eyebrow mt-10 lg:mt-0">B2B portal</p><h2 className="mt-4 font-display text-4xl font-semibold">{register ? 'Firmanızı RMS ağına bağlayın.' : 'Tekrar hoş geldiniz.'}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{register ? 'Ürün taleplerini ve teknik iletişimi tek panelden yönetin.' : 'Hesabınıza giriş yaparak size özel deneyime devam edin.'}</p><form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-8 space-y-4">{register && <input required data-testid="input-auth-company" placeholder="Firma adı *" className="field" />}<input required type={register ? 'text' : 'email'} data-testid="input-auth-identity" placeholder={register ? 'Yetkili adı *' : 'E-posta adresi *'} className="field" /><input required type="password" data-testid="input-auth-password" placeholder={register ? 'Şifre oluşturun *' : 'Şifreniz *'} className="field" />{register && <><input required type="email" data-testid="input-auth-email" placeholder="Kurumsal e-posta *" className="field" /><label className="flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" className="mt-0.5 accent-primary" /> KVKK ve üyelik koşullarını kabul ediyorum.</label></>}{!register && <div className="flex justify-end"><button type="button" data-testid="button-forgot-password" onClick={() => window.alert('Şifre yenileme bağlantısı e-posta adresinize gönderilecek.')} className="text-xs font-bold text-primary">Şifremi unuttum</button></div>}<button data-testid="button-auth-submit" className="w-full rounded-md bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground">{register ? 'Kayıt talebi gönder' : 'Giriş yap'}</button></form><p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">{register ? 'Zaten hesabınız var mı?' : 'Henüz B2B hesabınız yok mu?'} <Link href={register ? '/b2b/giris' : '/b2b/kayit'} data-testid="link-auth-switch" className="font-bold text-primary">{register ? 'Giriş yapın' : 'Firma kaydı oluşturun'}</Link></p></>}</div></div></div></div>;
}

function PortalShell({ admin = false }: { admin?: boolean }) {
  const [location, setLocation] = useLocation();
  const summary = useGetDashboardSummary();
  const nav = admin ? [['/admin', 'Genel bakış', Gauge], ['/urunler', 'Ürün kataloğu', PackageSearch], ['/markalar', 'Markalar', Layers3]] : [['/b2b/panel', 'Genel bakış', Gauge], ['/urunler', 'Ürün kataloğu', PackageSearch], ['/iletisim', 'Teknik destek', Headphones]];
  return <div className="min-h-[100dvh] bg-muted/30"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-sidebar text-sidebar-foreground md:block"><div className="flex h-20 items-center border-b border-white/10 px-6"><Logo dark /></div><div className="p-4"><p className="px-3 py-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/40">{admin ? 'Yönetim' : 'B2B çalışma alanı'}</p>{nav.map(([href, label, Icon]) => <button key={String(href)} data-testid={`link-portal-${label}`} onClick={() => setLocation(String(href))} className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold ${location === href ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{typeof Icon === 'function' && <Icon size={17} />}{String(label)}</button>)}</div><div className="absolute bottom-5 left-5 right-5"><Link href="/" data-testid="link-portal-home" className="flex items-center gap-2 text-xs text-white/50 hover:text-white">← Genel siteye dön</Link></div></aside><div className="md:pl-64"><header className="flex h-20 items-center justify-between border-b border-border bg-background px-5 lg:px-9"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{admin ? 'Admin paneli' : 'RMS Rulmak B2B'}</p><h1 className="mt-1 font-display text-xl font-semibold">{admin ? 'Katalog yönetimi' : 'Hoş geldiniz, çözüm ortağımız'}</h1></div><div className="flex items-center gap-3"><span className="hidden text-right text-xs text-muted-foreground sm:block">{admin ? 'Yönetici hesabı' : 'Artemis Makina'}</span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{admin ? 'R' : 'A'}</span></div></header><main className="mx-auto max-w-6xl p-5 lg:p-9"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Ürünler', summary.data?.productCount ?? '—', PackageSearch], ['Markalar', summary.data?.brandCount ?? '—', Layers3], ['Kategoriler', summary.data?.categoryCount ?? '—', Filter], ['Sektörler', summary.data?.sectorCount ?? '—', Factory]].map(([label, value, Icon]) => <div key={String(label)} className="rounded-xl border border-border bg-card p-5"><div className="flex justify-between"><span className="text-sm text-muted-foreground">{String(label)}</span>{typeof Icon === 'function' && <Icon size={18} className="text-primary" />}</div><p data-testid={`text-dashboard-${label}`} className="mt-5 font-display text-3xl font-semibold">{String(value)}</p><p className="mt-1 text-xs text-muted-foreground">{admin ? 'Sistem genelinde' : 'Katalogda erişilebilir'}</p></div>)}</div><div className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">{admin ? 'Son katalog görünümü' : 'Hızlı erişim'}</p><h2 className="mt-2 font-display text-2xl font-semibold">{admin ? 'Öne çıkan ürünler' : 'Teknik ihtiyaçlarınız için'}</h2></div><FileText className="text-muted-foreground" /></div><div className="mt-6 space-y-3">{summary.data?.featuredProducts?.slice(0, 4).map((p) => <Link key={p.id} href={`/urunler/${p.slug}`} data-testid={`link-dashboard-product-${p.id}`} className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/40"><div><p className="font-semibold">{p.name}</p><p className="mt-1 text-xs text-muted-foreground">{p.brandName} · {p.code}</p></div><ChevronRight size={17} className="text-primary" /></Link>) ?? <EmptyState title="Henüz öne çıkan ürün yok" />}</div></div><div className="rounded-xl bg-sidebar p-6 text-sidebar-foreground"><p className="eyebrow !text-red-400">Destek masası</p><h2 className="mt-3 font-display text-2xl font-semibold">Bir sorunuz mu var?</h2><p className="mt-3 text-sm leading-6 text-white/60">Teknik ekibimiz uygulamanızı dinlemek için hazır.</p><Link href="/iletisim" data-testid="link-dashboard-contact" className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-white">Talep oluştur <ArrowRight size={15} /></Link></div></div></main></div></div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route path="/urunler" component={Products} /><Route path="/urunler/:slug" component={ProductDetail} /><Route path="/markalar" component={() => <DirectoryPage kind="brand" />} /><Route path="/kategoriler" component={() => <DirectoryPage kind="category" />} /><Route path="/sektorler" component={Sectors} /><Route path="/kurumsal" component={Corporate} /><Route path="/blog" component={Blog} /><Route path="/iletisim" component={Contact} /><Route path="/b2b/giris" component={() => <Auth />} /><Route path="/b2b/kayit" component={() => <Auth register />} /><Route path="/b2b/panel" component={() => <PortalShell />} /><Route path="/admin" component={() => <PortalShell admin />} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;