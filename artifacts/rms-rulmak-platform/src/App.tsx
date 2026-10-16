import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateContactMessage, useCreateProductRequest, useGetCurrentAuthUser, useGetDashboardSummary, useGetProduct, useListBrands, useListCategories, useListProducts, useListSliders, useListSiteSections } from '@workspace/api-client-react';
import { AdminContent } from '@/pages/admin-content';
import type { Brand, Category, Product, ProductListItem, Sector } from '@workspace/api-client-react';
import { ArrowDownRight, ArrowRight, ArrowUp, BarChart3, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Cog, Factory, Facebook, FileStack, FileText, Filter, Gauge, Headphones, Image as ImageIcon, Instagram, Landmark, Layers3, Linkedin, Loader2, LogOut, Mail, MapPin, Menu, MessageCircle, Mountain, PackageSearch, Phone, Search, Settings2, ShieldCheck, Sparkles, Target, Truck, Users, Wheat, X, Youtube, Zap } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { CookieConsent } from '@/components/cookie-consent';
import { initAnalytics, safeTrack, trackPageView } from '@/lib/analytics';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { PageIntro } from '@/components/page-intro';
import { RouteSeo } from '@/lib/seo-routes';
import { breadcrumbJsonLd, homeJsonLd, productJsonLd } from '@/lib/seo-schema';
import { Seo } from '@/lib/seo';
import { CatalogAdminPage, CatalogsPage } from '@/pages/catalogs';
import { EKatalogBrand, EKatalogDetail, EKatalogHome, EKatalogSection } from '@/pages/e-katalog';
import { TechnicalDetail, TechnicalHub, technicalTopics } from '@/pages/technical';

const queryClient = new QueryClient();
const redLogo = '/brand/rulmak-red.png';
const whiteLogo = '/brand/rulmak-white.png';
const redIcon = '/brand/rulmak-icon-red.png';

function Logo({ dark = false, compact = false, className }: { dark?: boolean; compact?: boolean; className?: string }) {
  const fallback = compact ? 'h-12 w-12 object-contain' : 'h-14 w-auto max-w-[230px] object-contain sm:h-16 sm:max-w-[260px]';
  return <img data-testid="img-brand-logo" src={compact ? redIcon : dark ? whiteLogo : redLogo} alt="RMS Rulmak" className={className ?? fallback} />;
}

const navItems = [
  ['/urunler', 'Ürünler'],
  ['/markalar', 'Markalar'],
  ['/kategoriler', 'Kategoriler'],
  ['/sektorler', 'Sektörler'],
  ['/blog', 'Blog'],
  ['/iletisim', 'İletişim'],
] as const;

const kurumsalMenu = [
  ['/distributorler', 'Distribütörler'],
  ['/markalar', 'Markalarımız'],
  ['/kurumsal#misyon-vizyon', 'Misyon & Vizyon'],
  ['/kurumsal#tarihce', 'Tarihçemiz'],
  ['/bizden-haberler', 'Bizden Haberler'],
  ['/kurumsal', 'Hakkımızda'],
  ['/galeri', 'Galeri'],
] as const;

const teknikMenu = [
  ['/kataloglar', 'Kataloglar'],
  ...technicalTopics.map((t) => [`/teknik/${t.slug}`, t.title] as const),
] as const;

function scrollToHashSoon(href: string) {
  const hash = href.split('#')[1];
  if (!hash) return;
  window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
}

function NavDropdown({ label, href, items, active }: { label: string; href: string; items: readonly (readonly [string, string])[]; active: boolean }) {
  return <div className="group relative">
    <Link href={href} data-testid={`link-nav-${label}`} className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:text-primary ${active ? 'text-primary' : 'text-foreground'}`}>
      {label} <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
    </Link>
    <div className="invisible absolute left-0 top-full z-50 mt-1 max-h-[70vh] w-72 translate-y-1 overflow-y-auto rounded-lg border border-border bg-card p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      {items.map(([itemHref, itemLabel]) => <Link key={itemHref} href={itemHref} onClick={() => scrollToHashSoon(itemHref)} data-testid={`link-submenu-${itemLabel}`} className="block border-b border-transparent px-3 py-2.5 text-sm font-semibold text-foreground transition-colors last:border-b-2 last:border-primary hover:bg-muted hover:text-primary">{itemLabel}</Link>)}
    </div>
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
      <Link href="/" data-testid="link-home-logo" className="flex shrink-0 items-center gap-3"><Logo /></Link>
      <button data-testid="button-mobile-menu" aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={open} onClick={() => setOpen(!open)} className="rounded-lg p-2 text-foreground transition-colors hover:text-primary xl:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
      <nav className="hidden items-center gap-6 xl:flex">
        {navItems.slice(0, 2).map(([href, label]) => <Link key={href} href={href} data-testid={`link-nav-${label}`} className={`whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:text-primary ${location === href ? 'text-primary' : 'text-foreground'}`}>{label}</Link>)}
        <NavDropdown label="Kurumsal" href="/kurumsal" items={kurumsalMenu} active={location.startsWith('/kurumsal') || location === '/distributorler' || location === '/bizden-haberler' || location === '/galeri'} />
        <NavDropdown label="Teknik" href="/teknik" items={teknikMenu} active={location.startsWith('/teknik') || location === '/kataloglar'} />
        {navItems.slice(2).map(([href, label]) => <Link key={href} href={href} data-testid={`link-nav-${label}`} className={`whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:text-primary ${location === href ? 'text-primary' : 'text-foreground'}`}>{label}</Link>)}
      </nav>
      <div className="hidden shrink-0 lg:block">
        <div className="group relative">
          <a href="https://www.b2brulmak.com/" target="_blank" rel="noopener noreferrer" data-testid="link-b2b-login" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
            <Users size={15} /> B2B Giriş
          </a>
          <div className="invisible absolute right-0 top-full z-50 mt-2 w-56 translate-y-1 rounded-lg border border-border bg-card p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <a href="https://www.b2brulmak.com/" target="_blank" rel="noopener noreferrer" data-testid="link-b2b-login-menu" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary">Bayi / Müşteri Girişi</a>
            <a href="https://www.b2brulmak.com/" target="_blank" rel="noopener noreferrer" data-testid="link-b2b-register-menu" className="block rounded-md px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary">Yeni Hesap Oluştur</a>
          </div>
        </div>
      </div>
    </div>
    {open && <div className="fixed inset-0 z-50 bg-black/50 xl:hidden" data-testid="overlay-mobile-menu" onClick={() => setOpen(false)} />}
    <aside aria-hidden={!open} className={`fixed inset-y-0 right-0 z-50 flex w-[290px] max-w-[85vw] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 xl:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-border px-5"><Logo /><button data-testid="button-mobile-menu-close" aria-label="Menüyü kapat" onClick={() => setOpen(false)} className="rounded-lg p-2 text-foreground hover:text-primary"><X size={22} /></button></div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navItems.slice(0, 2).map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-nav-${label}`} className={`rounded-lg px-4 py-3 text-base font-semibold transition-colors hover:bg-muted hover:text-primary ${location === href ? 'bg-muted text-primary' : 'text-foreground'}`}>{label}</Link>)}
        {[['Kurumsal', kurumsalMenu], ['Teknik', teknikMenu]].map(([groupLabel, items]) => <details key={groupLabel as string} className="rounded-lg">
          <summary className="cursor-pointer list-none rounded-lg px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary">{groupLabel as string}</summary>
          <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
            {(items as readonly (readonly [string, string])[]).map(([href, label]) => <Link key={href} href={href} onClick={() => { setOpen(false); scrollToHashSoon(href); }} data-testid={`link-nav-mobile-${label}`} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary">{label}</Link>)}
          </div>
        </details>)}
        {navItems.slice(2).map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-nav-${label}`} className={`rounded-lg px-4 py-3 text-base font-semibold transition-colors hover:bg-muted hover:text-primary ${location === href ? 'bg-muted text-primary' : 'text-foreground'}`}>{label}</Link>)}
      </nav>
      <div className="shrink-0 space-y-2 border-t border-border p-4">
        <a href="https://www.b2brulmak.com/" target="_blank" rel="noopener noreferrer" data-testid="link-b2b-login-mobile" className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"><Users size={15} /> B2B Giriş</a>
        <Link href="/iletisim" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-bold text-foreground">Bize Ulaşın <ArrowRight size={15} /></Link>
      </div>
    </aside>
  </header>;
}

function Footer() {
  return <footer className="bg-sidebar text-sidebar-foreground">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_.8fr_.8fr_1fr] lg:px-8">
      <div><Logo dark /><p className="mt-6 max-w-xs text-sm leading-6 text-sidebar-foreground/55">Rulman ve güç aktarım sistemlerinde endüstriyel güven ve ölçülebilir performans.</p><div className="mt-6 flex gap-3">{[{ label: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram }, { label: 'Facebook', href: 'https://www.facebook.com/', Icon: Facebook }, { label: 'LinkedIn', href: 'https://www.linkedin.com/company/', Icon: Linkedin }, { label: 'YouTube', href: 'https://www.youtube.com/', Icon: Youtube }].map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-testid={`link-social-${label.toLowerCase()}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sidebar-foreground/70 transition hover:border-primary hover:bg-primary hover:text-white"><Icon size={17} /></a>)}</div></div>
      <div><p className="font-display text-lg font-bold text-white">Keşfet</p><div className="mt-4 flex flex-col gap-3 text-sm text-sidebar-foreground/70">{navItems.slice(0, 4).map(([href, label]) => <Link key={href} href={href} data-testid={`link-footer-${label}`} className="transition-colors hover:text-white">{label}</Link>)}</div></div>
      <div><p className="font-display text-lg font-bold text-white">Kurumsal</p><div className="mt-4 flex flex-col gap-3 text-sm text-sidebar-foreground/70"><Link href="/kurumsal">Hakkımızda</Link><Link href="/distributorler" data-testid="link-footer-distributors">Distribütörlüklerimiz</Link><Link href="/bizden-haberler" data-testid="link-footer-news">Bizden Haberler</Link><Link href="/kataloglar" data-testid="link-footer-e-katalog">E-Katalog</Link><Link href="/teknik-dokumanlar">PDF Arşivi</Link><Link href="/iletisim" data-testid="link-footer-support">Teknik destek</Link></div></div>
      <div><p className="font-display text-lg font-bold text-white">Bize ulaşın</p><div className="mt-4 space-y-3 text-sm text-sidebar-foreground/70"><a className="flex gap-2 hover:text-white" href="tel:+902163924141"><Phone size={15} className="mt-0.5 text-red-400" /> +90 216 392 41 41</a><a className="flex gap-2 hover:text-white" href="mailto:info@rmsrulmak.com"><Mail size={15} className="mt-0.5 text-red-400" /> info@rmsrulmak.com</a><p className="flex gap-2"><MapPin size={15} className="mt-0.5 text-red-400" /> Şifa Mah. Şekerpınar Cad. No: 11 4/B, Tuzla / İstanbul</p></div></div>
    </div>
    <div className="border-t border-sidebar-border"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-5 text-xs text-sidebar-foreground/45 sm:flex-row sm:items-center lg:px-8"><span>© {new Date().getFullYear()} RMS Rulmak. Tüm hakları saklıdır.</span><div className="flex flex-wrap items-center gap-x-5 gap-y-2"><Link href="/gizlilik-politikasi" data-testid="link-footer-privacy" className="transition-colors hover:text-white">Gizlilik Politikası</Link><Link href="/kullanim-kosullari" data-testid="link-footer-terms" className="transition-colors hover:text-white">Kullanım Koşulları</Link><Link href="/kvkk" data-testid="link-footer-kvkk" className="transition-colors hover:text-white">KVKK Aydınlatma Metni</Link><Link href="/cerez-politikasi" data-testid="link-footer-cookies" className="transition-colors hover:text-white">Çerez Politikası</Link></div></div></div>
  </footer>;
}

function PolicyPage({ title, text }: { title: string; text: string }) {
  return <Shell>
    <main className="mx-auto w-full max-w-7xl">
      <PageIntro eyebrow="Yasal" title={title} />
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="max-w-3xl"><p className="text-base leading-8 text-muted-foreground">{text}</p></div></div>
    </main>
  </Shell>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="grain min-h-[100dvh]"><Header />{children}<Footer /><FloatingActions /></div>;
}

function FloatingActions() {
  const [open, setOpen] = useState(false);
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const channels = [
    { label: 'WhatsApp', href: 'https://wa.me/905010624041?text=' + encodeURIComponent('Merhaba, RMS Rulmak ürün ve çözümleri hakkında bilgi almak istiyorum. https://www.rmsrulmak.com'), iconCls: 'text-[#25D366] hover:bg-[#25D366] hover:text-white', Icon: MessageCircle, testid: 'link-float-whatsapp' },
    { label: 'Instagram', href: 'https://www.instagram.com/', iconCls: 'text-[#E4405F] hover:bg-[#E4405F] hover:text-white', Icon: Instagram, testid: 'link-float-instagram' },
    { label: 'Telefon', href: 'tel:+902163924141', iconCls: 'text-primary hover:bg-primary hover:text-white', Icon: Phone, testid: 'link-float-phone' },
  ] as const;
  const faviconBtn = 'relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl ring-2 ring-primary/30 transition hover:ring-primary';
  return <>
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-center gap-3">
      <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`} aria-hidden={!open}>
        {channels.map(({ label, href, iconCls, Icon, testid }) => <a key={label} href={href} target={href.startsWith('tel') ? undefined : '_blank'} rel="noopener noreferrer" aria-label={label} data-testid={testid} className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:scale-110 ${iconCls}`}><Icon size={20} /></a>)}
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="İletişim kanalları" aria-expanded={open} data-testid="button-float-channels" className={`${faviconBtn} z-10`}>
        <img src="/brand/rulmak-icon-red.png" alt="RMS Rulmak" className="h-10 w-10 object-contain" />
      </button>
    </div>
    <button type="button" onClick={goTop} aria-label="Başa dön" data-testid="button-scroll-top-fixed" className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl transition hover:bg-primary/90">
      <ArrowUp size={22} />
    </button>
  </>;
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

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function CountUpStat({ value, label, icon: Icon, tone = 'dark' }: { value: number; label: string; icon: typeof Gauge; tone?: 'dark' | 'light' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const counted = useCountUp(value, visible);
  const accent = tone === 'dark' ? 'text-red-400' : 'text-primary';
  return <div ref={ref} className={`border-l-2 pl-4 ${tone === 'dark' ? 'border-white/25' : 'border-border'}`}><Icon size={18} className={accent} /><p className={`${tone === 'dark' ? 'counter-glow' : ''} mt-3 font-display text-4xl font-semibold tracking-tight ${tone === 'dark' ? '' : 'text-foreground'}`}>{counted.toLocaleString('tr-TR')}+</p><p className={`mt-1 text-xs font-bold uppercase tracking-wider ${tone === 'dark' ? 'text-white/60' : 'text-muted-foreground'}`}>{label}</p></div>;
}

function ProductVisual({ src, name }: { src?: string; name: string }) {
  return <div className="relative flex h-48 items-center justify-center overflow-hidden bg-muted/55 p-6"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(var(--primary) / .2) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />{src ? <img src={src} alt={name} className="relative z-10 h-full w-full object-contain mix-blend-multiply" /> : <img src={redIcon} alt="" className="relative z-10 h-20 w-20 object-contain opacity-70" />}</div>;
}

const referenceSlides = [
  { image: '/hero/slide-koyo.jpg', label: 'Koyo Japon teknolojisi rulmanları', href: '/kataloglar/teknik/koyo' },
  { image: '/hero/slide-nsk.jpg', label: 'Japon hassasiyetinde NSK mükemmeliyeti', href: '/kataloglar/teknik/nsk' },
  { image: '/hero/slide-schaeffler.jpg', label: 'Alman mühendisliğinde mükemmellik', href: '/kataloglar/teknik/schaeffler' },
  { image: '/hero/slide-gates.jpg', label: 'Gates ile endüstriyel güç aktarımı', href: '/kataloglar/teknik/gates' },
  { image: '/hero/slide-ntn.jpg', label: 'Japon mühendisliğinde güven ve verimlilik', href: '/kataloglar/teknik/ntn' },
  { image: '/hero/slide-timken.jpg', label: 'Konik rulmanlarla endüstriyel güç', href: '/kataloglar/teknik/timken' },
] as const;

const referenceBrands = [
  { name: 'IDC', image: '/brand/reference/idc-logo.jpg', href: '/kataloglar/teknik/idc' },
  { name: 'Gates', image: '/brand/reference/gates-logo.jpg', href: '/kataloglar/teknik/gates' },
  { name: 'Dunlop', image: '/brand/reference/dunlop-logo.jpg', href: '/kataloglar/teknik/dunlop' },
  { name: 'NTN', image: '/brand/reference/ntn-logo.jpg', href: '/kataloglar/teknik/ntn' },
  { name: 'NSK', image: '/brand/reference/nsk-logo.jpg', href: '/kataloglar/teknik/nsk' },
  { name: 'Timken', image: '/brand/reference/timken-logo.jpg', href: '/kataloglar/teknik/timken' },
  { name: 'Schaeffler', image: '/brand/reference/schaeffler-logo.jpg', href: '/kataloglar/teknik/schaeffler' },
  { name: 'Koyo', image: '/brand/reference/koyo-logo.jpg', href: '/kataloglar/teknik/koyo' },
  { name: 'RBC', image: '/brand/reference/rbc-logo.jpg', href: '/kataloglar/teknik/rbc' },
] as const;

function ReferenceHeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const apiSlides = useListSliders();
  const slides = apiSlides.data?.length
    ? apiSlides.data.map((s) => ({ image: s.image, label: s.title, href: s.href || '#' }))
    : (referenceSlides as unknown as { image: string; label: string; href: string }[]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const goTo = (index: number) => setActive((index + slides.length) % slides.length);
  const slide = slides[active];

  return <section
    aria-label="RMS Rulmak öne çıkan marka ve ürün sliderı"
    className="relative z-0 mx-auto w-full max-w-[88rem] overflow-hidden bg-white"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
  >
    <div className="relative aspect-[2560/853] w-full overflow-hidden">
      {slides.map((item, index) => <Link
        key={item.image + String(index)}
        href={item.href}
        aria-label={item.label}
        aria-hidden={active !== index}
        tabIndex={active === index ? 0 : -1}
        className={`absolute inset-0 block transition-opacity duration-700 ${active === index ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <img
          src={item.image}
          alt={item.label}
          width={2560}
          height={853}
          className="h-full w-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding={index === 0 ? 'sync' : 'async'}
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
        {slides.map((item, index) => <button
          key={item.image + String(index)}
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

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const interval = window.setInterval(() => {
      if (!viewport) return;
      const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
      if (atEnd) {
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: viewport.clientWidth * 0.85, behavior: 'smooth' });
      }
    }, 3000);
    return () => window.clearInterval(interval);
  }, []);

  return <section className="relative z-10 bg-white">
    <div className="mx-auto max-w-[88rem] py-4">
      <div ref={viewportRef} className="brand-slider-viewport">
        <div className="brand-slider-track">
          {referenceBrands.map((brand) => <Link key={brand.name} href={brand.href} data-testid={`link-brand-slider-${brand.name.toLowerCase()}`} className="brand-slider-card group flex flex-col items-center justify-center rounded-lg bg-white p-4 transition hover:bg-muted/40">
            <div className="flex h-24 w-full items-center justify-center sm:h-28">
              <img src={brand.image} alt={`${brand.name} logo`} width={1000} height={300} className="h-full w-full max-w-[240px] object-contain transition duration-300 group-hover:scale-105 sm:max-w-[260px]" style={{ mixBlendMode: 'multiply' }} loading="lazy" />
            </div>
            <span className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{brand.name}</span>
          </Link>)}
        </div>
      </div>
    </div>
  </section>;
}

const posts = [{ tag: 'Uygulama notu', title: 'Rulman seçerken yalnızca yük kapasitesine bakmak neden yetmez?', date: '12 Haziran 2024', time: '6 dk' }, { tag: 'Bakım rehberi', title: 'Güç aktarım sistemlerinde plansız duruşu azaltmanın 4 yolu', date: '28 Mayıs 2024', time: '8 dk' }, { tag: 'Teknik sözlük', title: 'Rulman boşluğu, tolerans ve hassasiyet sınıfları', date: '09 Mayıs 2024', time: '5 dk' }];

function SupportCta() {
  return <section className="relative overflow-hidden bg-primary text-primary-foreground" data-testid="section-support-cta"><div className="shell-grid absolute inset-0 opacity-10" /><div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 py-16 md:flex-row md:items-center lg:px-8"><div><p className="eyebrow !text-white/80">Yardıma mı ihtiyacınız var?</p><h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Uygulamanız için doğru çözümü birlikte bulalım.</h2></div><div className="flex flex-wrap gap-3"><Link href="/iletisim" data-testid="link-support-cta" className="inline-flex items-center gap-3 rounded-md bg-foreground px-5 py-3.5 text-sm font-bold text-background">Ekibimize ulaşın <ArrowDownRight size={16} /></Link><Link href="/kataloglar" data-testid="link-support-cta-catalogs" className="inline-flex items-center gap-3 rounded-md border border-white/40 px-5 py-3.5 text-sm font-bold text-white hover:border-white">Katalogları incele <ArrowRight size={16} /></Link></div></div></section>;
}

function Home() {
  const summaryQuery = useGetDashboardSummary();
  const summary = summaryQuery.data;
  const sectionsQuery = useListSiteSections();
  const statsMap = Object.fromEntries((sectionsQuery.data ?? []).map((s) => [s.key, s]));
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
      <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground"><div className="shell-grid absolute inset-0 opacity-20" /><div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-4 lg:px-8">{summaryQuery.isLoading ? <div className="col-span-full h-12 animate-pulse rounded bg-white/15" /> : summaryQuery.isError ? <p className="col-span-full text-sm text-white/75">Katalog özeti şu an kullanılamıyor.</p> : <><CountUpStat value={summary?.productCount ?? 0} label="Ürün kaydı" icon={PackageSearch} /><CountUpStat value={summary?.brandCount ?? 0} label="Güvenilir marka" icon={Layers3} /><CountUpStat value={summary?.categoryCount ?? 0} label="Ürün kategorisi" icon={Filter} /><CountUpStat value={summary?.sectorCount ?? 0} label="Sektörel çözüm" icon={Factory} /></>}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Öne çıkanlar</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">Sahada kendini kanıtlamış ürünler</h2></div><Link href="/urunler" data-testid="link-home-all-products" className="hidden items-center gap-2 text-sm font-bold text-primary sm:flex">Tüm katalog <ArrowRight size={16} /></Link></div>{summaryQuery.isLoading ? <div className="mt-9"><LoadingState /></div> : summary?.featuredProducts?.length ? <div className="mt-9 grid gap-5 md:grid-cols-3">{summary.featuredProducts.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="mt-9"><EmptyState /></div>}</section>
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-sidebar text-sidebar-foreground sm:min-h-[480px]">
        <video className="absolute bottom-0 right-0 top-0 h-full w-1/2 object-cover" autoPlay muted loop playsInline src="/video/rulmak-loop.mov" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-sidebar via-sidebar/55 to-sidebar/25" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 lg:px-8">
          <div className="max-w-xl md:max-w-[46%]">
            <h2 className="reveal font-display text-4xl font-semibold leading-tight md:text-5xl">Güvenle Dönen Sistemler</h2>
            <p className="reveal reveal-delay-1 mt-6 text-lg leading-8 text-white/70">RMS Rulmak, sanayi makineleri için yüksek kaliteli rulman çözümleri sunar.</p>
            <Link href="/iletisim" data-testid="link-home-video-cta" className="reveal reveal-delay-2 mt-8 inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">Bize Ulaşın <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Teknik bilgi</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">Blog yazılarımız</h2></div><Link href="/blog" data-testid="link-home-all-posts" className="hidden items-center gap-2 text-sm font-bold text-primary sm:flex">Tüm yazılar <ArrowRight size={16} /></Link></div>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">{posts.map((post, i) => <article key={post.title} data-testid={`card-home-blog-${i}`} className="card-elevated group overflow-hidden rounded-xl border border-border bg-card"><div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-sidebar to-sidebar/70"><div className="shell-grid absolute inset-0 opacity-25" /><BookOpen size={34} className="relative text-red-400" /></div><div className="p-6"><span className="eyebrow">{post.tag}</span><h3 className="mt-5 font-display text-xl font-semibold leading-tight group-hover:text-primary">{post.title}</h3><div className="mt-6 flex justify-between text-xs text-muted-foreground"><span>{post.date}</span><span>{post.time} okuma</span></div><Link href="/blog" data-testid={`link-home-blog-read-${i}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Okumaya başla <ArrowRight size={15} className="text-primary" /></Link></div></article>)}</div>
        <Link href="/blog" data-testid="link-home-all-posts-mobile" className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-primary sm:hidden">Tüm yazılar <ArrowRight size={16} /></Link>
      </section>
      <SupportCta />
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
  useEffect(() => {
    if (items.length > 0) safeTrack('view_item_list', { item_list_name: 'urunler', items: items.slice(0, 20).map((p) => ({ item_id: p.code, item_name: p.name, item_brand: p.brandName ?? '', item_category: p.categoryName ?? '' })) });
  }, [items]);
  return <Shell><PageIntro eyebrow="Teknik katalog" title="Ürünler, ölçüsüyle değil çözümüyle anlamlı." description="Ürün kodu, marka veya kategoriyle arayın. Kararınızı destekleyecek teknik bilgiler ve dokümanlara tek yerde ulaşın." /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14"><div className="mb-9 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_200px_200px]"><label className="relative block"><Search size={18} className="absolute left-3 top-3.5 text-muted-foreground" /><input data-testid="input-product-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün, kod veya marka ara..." className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none ring-primary transition focus:ring-2" /></label><select data-testid="select-product-category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"><option value="">Tüm kategoriler</option>{categories.data?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select><select data-testid="select-product-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"><option value="">Tüm markalar</option>{brands.data?.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select></div><div className="mb-5 flex items-center justify-between text-sm text-muted-foreground"><span>{products.isLoading ? 'Aranıyor...' : `${products.data?.total ?? 0} ürün bulundu`}</span><span className="flex items-center gap-2"><Filter size={15} /> Teknik katalog</span></div>{products.isLoading ? <LoadingState label="Ürünler yükleniyor" /> : products.isError ? <ErrorState onRetry={() => products.refetch()} /> : items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <EmptyState title="Aramanızla eşleşen ürün yok" text="Ürün kodunu, marka adını veya kategori filtresini değiştirin." />}</main></Shell>;
}

function ProductDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const query = useGetProduct(slug, { query: { queryKey: ['/api/products', slug], enabled: !!slug } });
  const [requestOpen, setRequestOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const mutation = useCreateProductRequest();
  const product = query.data;
  useEffect(() => {
    if (product) safeTrack('view_item', { items: [{ item_id: product.code, item_name: product.name, item_brand: product.brand?.name ?? '', item_category: product.category?.name ?? '' }] });
  }, [product]);
  if (query.isLoading) return <Shell><PageIntro eyebrow="Ürün kataloğu" title="Ürün bilgileri yükleniyor" /><main className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><LoadingState label="Ürün bilgileri yükleniyor" /></main></Shell>;
  if (query.isError || !product) return <Shell><PageIntro eyebrow="Ürün kataloğu" title="Ürün yüklenemedi" description="Bağlantıyı kontrol edip tekrar deneyin." /><main className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><ErrorState onRetry={() => query.refetch()} /></main></Shell>;
  const submitRequest = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const fd = new FormData(event.currentTarget); mutation.mutate({ data: { fullName: String(fd.get('fullName')), company: String(fd.get('company') || ''), phone: String(fd.get('phone') || ''), email: String(fd.get('email')), productSlug: product.slug, productCode: product.code, message: String(fd.get('message')), kvkkAccepted: fd.get('kvkk') === 'on' } }, { onSuccess: () => { setSent(true); setRequestOpen(false); safeTrack('generate_lead', { form: 'urun_talebi', product_code: product.code }); } }); };
  return <Shell><Seo title={`${product.name} | ${product.code} — RMS Rulmak`} description={product.shortDescription ?? `${product.brand.name} ${product.name} ürünü — ${product.code}. Teknik özellikler ve bilgi talebi.`} path={`/urunler/${product.slug}`} type="product" jsonLd={[productJsonLd({ name: product.name, slug: product.slug, code: product.code, brandName: product.brand?.name ?? null, description: product.description, image: product.imageUrl })]} /><PageIntro eyebrow="Ürün kataloğu" title={product.name} description={product.shortDescription} /><main><section className="border-b border-border"><div className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><Link href="/urunler" data-testid="link-back-products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">← Ürün kataloğuna dön</Link><div className="mt-9 grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><ProductVisual src={product.imageUrl} name={product.name} /><div><p className="eyebrow">{product.brand.name} / {product.category.name}</p><p className="mt-3 font-mono text-sm text-muted-foreground">Ürün kodu: {product.code}</p><button data-testid="button-product-request" onClick={() => setRequestOpen(true)} className="mt-8 inline-flex items-center gap-3 rounded-md bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground">Bu ürün hakkında bilgi iste <ArrowRight size={17} /></button>{sent && <p data-testid="status-request-success" className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700"><Check size={16} /> Talebiniz alındı, ekibimiz en kısa sürede size dönecek.</p>}</div></div></div></section><section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_.8fr] lg:px-8"><div><p className="eyebrow">Ürün hakkında</p><div className="prose prose-slate mt-5 max-w-2xl text-muted-foreground"><p>{product.description}</p></div><h2 className="mt-12 font-display text-2xl font-semibold">Teknik özellikler</h2>{product.technicalSpecs?.length ? <div className="mt-5 overflow-hidden rounded-xl border border-border">{product.technicalSpecs.map((spec) => <div key={spec.label} className="grid grid-cols-2 border-b border-border px-4 py-3 text-sm last:border-0"><span className="font-semibold">{spec.label}</span><span className="text-muted-foreground">{spec.value}</span></div>)}</div> : <EmptyState title="Teknik özellik yakında" text="Bu ürün için detaylı bilgi almak üzere ekibimize ulaşabilirsiniz." />}</div><aside className="h-fit rounded-xl bg-sidebar p-7 text-sidebar-foreground"><p className="eyebrow !text-red-400">Teknik destek</p><h2 className="mt-4 font-display text-2xl font-semibold">Uygulamanız için doğru seçim mi?</h2><p className="mt-4 text-sm leading-6 text-sidebar-foreground/65">Mil ve yataklama detaylarınızı paylaşın, uygun çözümü birlikte değerlendirelim.</p><Link href="/iletisim" data-testid="link-product-contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white">Ekibe danışın <ArrowRight size={15} className="text-red-400" /></Link></aside></section></main>{requestOpen && <ProductRequestModal product={product} onClose={() => setRequestOpen(false)} onSubmit={submitRequest} pending={mutation.isPending} />}</Shell>;
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
  const hasLogo = isBrand && 'logoUrl' in item && !!item.logoUrl;
  return <Link href={`/urunler?${isBrand ? 'brand' : 'category'}=${item.slug}`} data-testid={`card-${kind}-${item.id}`} className="lift group relative overflow-hidden rounded-xl border border-border bg-card p-6">
    {hasLogo ? <div className="flex items-start justify-between"><div className="flex h-28 w-full max-w-[75%] items-center justify-start overflow-hidden rounded-lg bg-white p-2"><img src={(item as Brand).logoUrl} alt={item.name} width={1000} height={300} className="h-full w-full object-contain" style={{ mixBlendMode: 'multiply' }} loading="lazy" /></div><ArrowUpRightIcon /></div> : <div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-primary">{isBrand ? <Layers3 size={20} /> : <Factory size={20} />}</span><ArrowUpRightIcon /></div>}
    <h2 className="mt-8 font-display text-2xl font-semibold group-hover:text-primary">{item.name}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p><div className="mt-6 border-t border-border pt-4 text-xs font-bold uppercase tracking-wider text-primary">{item.productCount} ürün</div>
  </Link>;
}

function ArrowUpRightIcon() { return <ArrowDownRight size={19} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />; }

const sectorIcons: Record<string, typeof Factory> = {
  'demir-ve-celik': Factory,
  madencilik: Mountain,
  'kagit-ve-sanayi': FileStack,
  cimento: Landmark,
  'tasima-ve-depolama': Truck,
  enerji: Zap,
  'tarim-ve-gida': Wheat,
  'otomotiv-ve-makine': Cog,
};

function Sectors() {
  const summary = useGetDashboardSummary();
  const sectors: Sector[] = summary.data?.sectors ?? [];
  const fallback: Sector[] = [
    { name: 'Demir ve Çelik', slug: 'demir-ve-celik', description: 'Ağır yük ve yüksek sıcaklık koşullarında dayanıklı rulman çözümleri.' },
    { name: 'Madencilik', slug: 'madencilik', description: 'Zorlu ve aşındırıcı ortamlarda kesintisiz çalışma garantisi.' },
    { name: 'Kağıt ve Sanayi', slug: 'kagit-ve-sanayi', description: 'Yüksek hızlı üretim hatlarında hassasiyet ve süreklilik.' },
    { name: 'Çimento', slug: 'cimento', description: 'Toz ve titreşime dayanıklı, uzun ömürlü güç aktarım bileşenleri.' },
    { name: 'Taşıma ve Depolama', slug: 'tasima-ve-depolama', description: 'Konveyör ve lojistik sistemlerinde kesintisiz hareket.' },
    { name: 'Enerji', slug: 'enerji', description: 'Zorlu koşullarda güvenilirlik ve düşük bakım ihtiyacı.' },
    { name: 'Tarım ve Gıda', slug: 'tarim-ve-gida', description: 'Hijyenik, hassas ve yüksek çevrimli uygulamalar için.' },
    { name: 'Otomotiv ve Makine', slug: 'otomotiv-ve-makine', description: 'Hassas toleranslı, yüksek performanslı makine çözümleri.' },
  ];
  const list = sectors.length ? sectors : fallback;
  return <Shell><PageIntro eyebrow="Sektörel uzmanlık" title="Her sektörün ritmi farklı. Çözümünüz de öyle." description="Uygulamanın çalışma koşullarını anlayarak, doğru bileşeni teknik bir bakışla seçmenize yardımcı oluyoruz." /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">{summary.isLoading ? <LoadingState /> : <div className="grid gap-5 md:grid-cols-2">{list.map((s, i) => { const Icon = sectorIcons[s.slug] ?? Factory; return <div key={s.slug} data-testid={`card-sector-${s.slug}`} className="card-elevated group relative overflow-hidden rounded-xl border border-border bg-card p-7"><span className="font-mono text-sm text-primary">0{i + 1}</span><Icon className="absolute right-7 top-7 text-muted-foreground/40 transition-colors group-hover:text-primary/40" size={28} /><h2 className="mt-12 font-display text-3xl font-semibold group-hover:text-primary">{s.name}</h2><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{s.description}</p><Link href="/iletisim" data-testid={`link-sector-contact-${s.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold">Çözüm danışmanlığı <ArrowRight size={15} className="text-primary" /></Link></div>; })}</div>}</main><SupportCta /></Shell>;
}

function Gallery() {
  const apiSlides = useListSliders();
  const images = apiSlides.data?.length ? apiSlides.data.map((s) => s.image) : referenceSlides.map((s) => s.image);
  return <Shell><PageIntro eyebrow="Galeri" title="Saha, ürün ve tesis görsellerimiz." description="Distribütörlüğünü yürüttüğümüz markaların ürün ve uygulama görsellerinden bir seçki." />
    <main className="mx-auto max-w-7xl px-5 pb-16 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((src) => <div key={src} className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"><img src={src} alt="RMS Rulmak galeri" width={800} height={600} className="h-full w-full object-cover" loading="lazy" /></div>)}</div></main>
  </Shell>;
}

function Corporate() {
  const sectionsQuery = useListSiteSections();
  const statsMap = Object.fromEntries((sectionsQuery.data ?? []).map((s) => [s.key, s]));
  return <Shell><PageIntro eyebrow="RMS Rulmak" title="Güven, teknik bilgiyle başlar." description="Rulmak; rulman ve güç aktarımı alanında, müşterilerinin operasyonel sürekliliğini odağına alan bir çözüm ortağıdır." /><main>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-24"><div><p className="eyebrow">Biz kimiz?</p><h2 className="industrial-rule mt-4 font-display text-4xl font-semibold">1999'dan beri sahadaki ihtiyacı dinliyoruz.</h2></div><div className="space-y-5 text-base leading-8 text-muted-foreground"><p>1999 yılından bu yana rulman ve güç aktarım ekipmanları alanında faaliyet gösteren RMS Rulmak; IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler (FAG / INA), Koyo ve RBC Bearings gibi global markaların Türkiye'deki yetkili distribütörlüğünü ve bayiliğini yürütür. Her uygulamanın kendi dili, yükü ve çalışma koşulu vardır; biz bu detayları dinler, ürün seçimini yalnızca katalogdan değil sahadaki gerçek ihtiyaçtan kurarız.</p><p>Teknik ürün bilgisi ile insan ilişkisini aynı masada buluşturuyoruz. B2B müşterilerimiz için hızlı erişilen bir katalog, şeffaf iletişim ve tekrar tekrar güvenebilecekleri bir çalışma biçimi sunuyoruz.</p><div className="grid gap-6 border-t border-border pt-8 sm:grid-cols-3"><Stat value="1999" label="Kuruluş yılı" icon={Gauge} /><Stat value="9" label="Dünya markası" icon={BarChart3} /><Stat value="TR" label="Yerel uzmanlık" icon={MapPin} /></div></div></section>
    <section id="tarihce" className="scroll-mt-28 border-y border-border bg-background"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><p className="eyebrow">Tarihçemiz</p><h2 className="industrial-rule mt-4 font-display text-3xl font-semibold">Yol haritası: yıllar içinde büyüyen bir güven ağı.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Kuruluşumuzdan bugüne uzanan kilometre taşlarımız.</p>
      <div className="relative mt-16">
        <span aria-hidden="true" className="absolute bottom-4 left-[19px] top-1 w-px bg-gradient-to-b from-primary via-primary/45 to-border lg:bottom-auto lg:left-0 lg:right-[52px] lg:top-[19px] lg:h-px lg:w-auto lg:bg-gradient-to-r" />
        <ArrowRight size={17} className="absolute -bottom-8 left-[11px] rotate-90 text-primary lg:bottom-auto lg:left-auto lg:right-0 lg:top-[10px] lg:rotate-0" aria-hidden="true" />
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-6">{[['1999', 'Kuruluş', 'RMS Rulmak, rulman ve güç aktarım ekipmanları ticaretiyle İstanbul\'da kuruldu.'], ['2005-2015', 'Distribütörlük ağı', 'IDC, Gates, Dunlop, NTN ve NSK gibi markaların yetkili distribütörlüğü kademeli olarak eklendi.'], ['2016-2023', 'Portföy genişlemesi', 'Timken, Schaeffler, Koyo ve RBC Bearings markalarıyla ürün yelpazesi sanayinin tüm ihtiyaçlarını kapsayacak şekilde genişletildi.'], ['Bugün', 'Dijital B2B', 'Teknik bilgiye ve kataloğa tek noktadan erişim sağlayan dijital B2B platformuyla hizmete devam ediyoruz.']].map(([year, title, text], i, arr) => <div key={year} className="relative pl-14 lg:pl-0" data-testid={`item-timeline-${year}`}><span className={`absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background font-mono text-xs font-bold lg:static lg:mb-5 ${i === arr.length - 1 ? 'border-primary text-primary' : 'border-primary/30 text-foreground'}`}>{String(i + 1).padStart(2, '0')}</span><span className="mt-2 block font-mono text-sm font-bold text-primary lg:mt-0">{year}</span><h3 className="mt-2 font-display text-xl font-semibold">{title}</h3><p className="mt-3 pr-4 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div>
      </div>
    </div></section>
    <section id="misyon-vizyon" className="section-divider border-y border-border bg-muted/30"><div className="mx-auto max-w-7xl px-5 pt-16 text-center lg:px-8"><p className="eyebrow">Yön ve amaç</p><h2 className="mt-4 font-display text-3xl font-semibold">Misyonumuz ve vizyonumuz</h2></div><div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-2 lg:px-8"><div className="card-elevated rounded-xl border border-border bg-card p-8"><Target className="text-primary" size={26} /><h3 className="mt-5 font-display text-2xl font-semibold">Misyonumuz</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> Doğru ürünü, doğru zamanda, doğru fiyatla ulaştırmak</li><li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> Müşterilerimizin üretim sürekliliğini korumak</li><li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> Teknik bilgiyi şeffaf biçimde paylaşmak</li></ul></div><div className="card-elevated rounded-xl border border-border bg-card p-8"><Sparkles className="text-primary" size={26} /><h3 className="mt-5 font-display text-2xl font-semibold">Vizyonumuz</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> Türkiye'nin güvenilir endüstriyel çözüm ortağı olmak</li><li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> Dijital katalog ve teknik destekte sektör standardı belirlemek</li><li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" /> Uzun vadeli iş ortaklıkları kurmak</li></ul></div></div></section>
    <section className="border-b border-border bg-muted/30"><div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-4 lg:px-8">{(() => { const s = statsMap; return <><CountUpStat tone="light" value={Number(String(s.stats_dunya?.body ?? "740223").replace(/[^\d]/g, "")) || 740223} label={s.stats_dunya?.label ?? "Dünyanın dört bir yanındaki firma"} icon={Users} /><CountUpStat tone="light" value={Number(String(s.stats_rulman?.body ?? "1200000").replace(/[^\d]/g, "")) || 1200000} label={s.stats_rulman?.label ?? "Teslim edilen rulman"} icon={PackageSearch} /><CountUpStat tone="light" value={Number(String(s.stats_musteri?.body ?? "850").replace(/[^\d]/g, "")) || 850} label={s.stats_musteri?.label ?? "Aktif müşteri ve iş ortağı"} icon={Factory} /><CountUpStat tone="light" value={Number(String(s.stats_cozum?.body ?? "60").replace(/[^\d]/g, "")) || 60} label={s.stats_cozum?.label ?? "Farklı endüstriyel çözüm"} icon={Layers3} /></>; })()}</div></section>
    <section className="bg-background"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">İlkelerimiz</p><h2 className="mt-4 font-display text-3xl font-semibold">İşin doğru yapılması için üç net söz.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Her kararımızın arkasındaki üç temel prensip.</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{['Şeffaflık', 'Süreklilik', 'Sorumluluk'].map((title, i) => <div key={title} className="group rounded-xl border border-border bg-card p-7 text-center transition-all hover:border-primary/40 hover:shadow-lg"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary">{(() => { const Icon = [ShieldCheck, Truck, Landmark][i] as typeof Gauge; return <Icon size={22} />; })()}</span><span className="mt-5 block font-mono text-xs font-bold tracking-widest text-primary">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-3 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{['Ürün, süre ve süreç hakkında açık konuşuruz.', 'Bugünü değil, uzun vadeli operasyonu planlarız.', 'Önerdiğimiz çözümün arkasında dururuz.'][i]}</p></div>)}</div></div></section>
  </main></Shell>;
}

function Blog() { return <Shell><PageIntro eyebrow="Teknik bilgi" title="Sahada işe yarayan bilgiler." description="Seçim, bakım ve uygulama kararlarını daha güvenle almanız için kısa teknik notlar." /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="grid gap-5 lg:grid-cols-3">{posts.map((post, i) => <article key={post.title} data-testid={`card-blog-${i}`} className="card-elevated group overflow-hidden rounded-xl border border-border bg-card"><div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-sidebar to-sidebar/70"><div className="shell-grid absolute inset-0 opacity-25" /><BookOpen size={34} className="relative text-red-400" /></div><div className="p-6"><span className="eyebrow">{post.tag}</span><h2 className="mt-5 font-display text-2xl font-semibold leading-tight group-hover:text-primary">{post.title}</h2><div className="mt-7 flex justify-between text-xs text-muted-foreground"><span>{post.date}</span><span>{post.time} okuma</span></div><button data-testid={`button-blog-read-${i}`} onClick={() => window.alert('Bu teknik içerik yakında yayında olacak.')} className="mt-6 inline-flex items-center gap-2 text-sm font-bold">Okumaya başla <ArrowRight size={15} className="text-primary" /></button></div></article>)}</div><div className="mt-14 rounded-xl bg-muted p-8 md:flex md:items-center md:justify-between"><div><p className="eyebrow">Yeni içeriklerden haberdar olun</p><p className="mt-2 text-sm text-muted-foreground">Teknik notları ve ürün güncellemelerini e-postanıza alabilirsiniz.</p></div><Link href="/iletisim" data-testid="link-blog-contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold md:mt-0">Bize yazın <ArrowRight size={15} className="text-primary" /></Link></div></main></Shell>; }

const contactAddress = 'Şifa Mah. Şekerpınar Cad. No: 114/B Tuzla / İstanbul';
const contactMapEmbed = 'https://www.google.com/maps?q=' + encodeURIComponent('Şifa Mah. Şekerpınar Cad. No: 114/B Tuzla İstanbul') + '&output=embed';
const contactMapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Şifa Mah. Şekerpınar Cad. No: 114/B Tuzla İstanbul');

function Contact() {
  const mutation = useCreateContactMessage();
  const [success, setSuccess] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const fd = new FormData(event.currentTarget); mutation.mutate({ data: { fullName: String(fd.get('fullName')), company: String(fd.get('company') || ''), phone: String(fd.get('phone') || ''), email: String(fd.get('email')), subject: String(fd.get('subject')), message: String(fd.get('message')), kvkkAccepted: fd.get('kvkk') === 'on' } }, { onSuccess: () => { setSuccess(true); safeTrack('generate_lead', { form: 'iletisim', subject: String(fd.get('subject')) }); } }); };
  const items = [
    { label: 'Adres', lines: ['Şifa Mah. Şekerpınar Cad. No: 114/B', 'Tuzla / İstanbul'], href: contactMapLink, Icon: MapPin },
    { label: 'Telefon', lines: ['+90 216 392 41 41'], href: 'tel:+902163924141', Icon: Phone },
    { label: 'WhatsApp', lines: ['+90 501 062 40 41'], href: 'https://wa.me/905010624041', Icon: MessageCircle },
    { label: 'E-posta', lines: ['info@rmsrulmak.com'], href: 'mailto:info@rmsrulmak.com', Icon: Mail },
  ] as const;
  return <Shell><PageIntro eyebrow="İletişim" title="Sorularınız için bizimle iletişime geçin" description="Ürün, teknik seçim, tedarik veya B2B üyelik konularında ekibimiz size geri dönsün." /><main className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-16"><div><div className="space-y-7">{items.map(({ label, lines, href, Icon }) => <a key={label} href={href ?? contactMapLink} target={href === contactMapLink ? '_blank' : undefined} rel="noopener noreferrer" data-testid={`link-contact-${label.toLowerCase()}`} className="group flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon size={18} /></span><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{lines[0]}</p>{lines[1] && <p className="font-semibold">{lines[1]}</p>}</div></a>)}</div><div className="mt-12 border-t border-border pt-8"><p className="eyebrow">Çalışma Saatleri</p><p className="mt-3 text-sm leading-7 text-muted-foreground">Pazartesi - Cuma: 09:00 - 18:00<br />Cumartesi: 09:00 - 13:00<br />Pazar: Kapalı</p></div></div><div className="rounded-xl border border-border bg-card p-6 md:p-8">{success ? <div data-testid="status-contact-success" className="flex min-h-[390px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700"><Check /></span><h2 className="mt-5 font-display text-3xl font-semibold">Mesajınız ulaştı.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecek.</p><button data-testid="button-new-contact" onClick={() => setSuccess(false)} className="mt-7 text-sm font-bold text-primary">Yeni mesaj gönder</button></div> : <form onSubmit={submit} className="space-y-4"><p className="eyebrow">Bize Ulaşın</p><div className="grid gap-4 sm:grid-cols-2"><input required name="fullName" data-testid="input-contact-name" placeholder="Ad Soyad *" className="field" /><input name="company" data-testid="input-contact-company" placeholder="Firma" className="field" /><input required type="email" name="email" data-testid="input-contact-email" placeholder="E-posta *" className="field" /><input name="phone" data-testid="input-contact-phone" placeholder="Telefon" className="field" /></div><input required name="subject" data-testid="input-contact-subject" placeholder="Konu *" className="field" /><textarea required minLength={10} name="message" data-testid="input-contact-message" placeholder="Mesajınız *" className="field min-h-36 resize-y" /><label className="flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" name="kvkk" data-testid="input-contact-kvkk" className="mt-0.5 accent-primary" /> KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.</label>{mutation.isError && <p data-testid="status-contact-error" className="text-sm text-red-600">Mesaj gönderilemedi. Lütfen tekrar deneyin.</p>}<button disabled={mutation.isPending} data-testid="button-submit-contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">{mutation.isPending && <Loader2 size={16} className="animate-spin" />} Mesajı gönder</button></form>}</div></main><section data-testid="section-contact-map" className="border-t border-border"><div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary"><MapPin size={18} /></span><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Konumumuz</p><h2 className="font-display text-xl font-semibold">{contactAddress}</h2></div></div><iframe title="RMS Rulmak konum — Google Haritalar" src={contactMapEmbed} loading="lazy" className="h-[320px] w-full rounded-xl border border-border md:h-[420px]" style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div></section></Shell>;
}

function Auth({ register = false }: { register?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  return <div className="min-h-[100dvh] bg-sidebar text-sidebar-foreground"><div className="mx-auto grid min-h-[100dvh] max-w-7xl lg:grid-cols-[.9fr_1.1fr]"><div className="relative hidden overflow-hidden p-10 lg:block"><div className="absolute -left-36 top-20 h-96 w-96 rounded-full border border-white/10" /><div className="absolute left-20 top-56 h-64 w-64 rounded-full border border-primary/50" /><Link href="/" data-testid="link-auth-logo"><Logo dark /></Link><div className="absolute bottom-16 max-w-sm"><p className="eyebrow !text-red-400">RMS Rulmak B2B</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight">İşinizin ritmini birlikte koruyalım.</h1><p className="mt-5 text-sm leading-7 text-white/55">Size özel katalog, hızlı talep yönetimi ve RMS ekibiyle doğrudan iletişim.</p></div></div><div className="flex items-center bg-background p-5 md:p-12"><div className="mx-auto w-full max-w-md"><Link href="/" data-testid="link-auth-mobile-logo" className="lg:hidden"><Logo /></Link>{submitted ? <div data-testid="status-auth-success" className="py-10"><Check className="text-primary" size={34} /><h2 className="mt-6 font-display text-3xl font-semibold">Talebiniz alındı.</h2><p className="mt-3 leading-7 text-muted-foreground">{register ? 'Firma kaydınız inceleniyor. Ekibimiz doğrulama için sizinle iletişime geçecek.' : 'Giriş bilgileriniz kontrol ediliyor.'}</p><Link href="/" data-testid="link-auth-back" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">Ana sayfaya dön <ArrowRight size={15} /></Link></div> : <><p className="eyebrow mt-10 lg:mt-0">B2B portal</p><h2 className="mt-4 font-display text-4xl font-semibold">{register ? 'Firmanızı RMS ağına bağlayın.' : 'Tekrar hoş geldiniz.'}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{register ? 'Ürün taleplerini ve teknik iletişimi tek panelden yönetin.' : 'Hesabınıza giriş yaparak size özel deneyime devam edin.'}</p><form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-8 space-y-4">{register && <input required data-testid="input-auth-company" placeholder="Firma adı *" className="field" />}<input required type={register ? 'text' : 'email'} data-testid="input-auth-identity" placeholder={register ? 'Yetkili adı *' : 'E-posta adresi *'} className="field" /><input required type="password" data-testid="input-auth-password" placeholder={register ? 'Şifre oluşturun *' : 'Şifreniz *'} className="field" />{register && <><input required type="email" data-testid="input-auth-email" placeholder="Kurumsal e-posta *" className="field" /><label className="flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" className="mt-0.5 accent-primary" /> KVKK ve üyelik koşullarını kabul ediyorum.</label></>}{!register && <div className="flex justify-end"><button type="button" data-testid="button-forgot-password" onClick={() => window.alert('Şifre yenileme bağlantısı e-posta adresinize gönderilecek.')} className="text-xs font-bold text-primary">Şifremi unuttum</button></div>}<button data-testid="button-auth-submit" className="w-full rounded-md bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground">{register ? 'Kayıt talebi gönder' : 'Giriş yap'}</button></form><p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">{register ? 'Zaten hesabınız var mı?' : 'Henüz B2B hesabınız yok mu?'} <Link href={register ? '/b2b/giris' : '/b2b/kayit'} data-testid="link-auth-switch" className="font-bold text-primary">{register ? 'Giriş yapın' : 'Firma kaydı oluşturun'}</Link></p></>}</div></div></div></div>;
}

function PortalShell({ admin = false }: { admin?: boolean }) {
  const [location, setLocation] = useLocation();
  const summary = useGetDashboardSummary();
  const authUser = useGetCurrentAuthUser();
  const me = authUser.data?.user ?? undefined;
  const nav = admin ? [['/admin', 'Genel bakış', Gauge], ['/admin/sliders', 'Hero sliderlar', ImageIcon], ['/admin/posts', 'Blog yazıları', FileText], ['/admin/brands', 'Markalar', Layers3], ['/admin/categories', 'Kategoriler', Filter], ['/admin/products', 'Ürünler', PackageSearch], ['/admin/sectors', 'Sektörler', Factory], ['/admin/sections', 'Site bölümleri', Cog], ['/admin/inquiries', 'İletişim mesajları', Mail], ['/admin/settings', 'Site ayarları', Settings2], ['/admin/audit', 'Güvenlik & audit log', ShieldCheck]] : [['/b2b/panel', 'Genel bakış', Gauge], ['/urunler', 'Ürün kataloğu', PackageSearch], ['/iletisim', 'Teknik destek', Headphones]];
  const isActive = (href: string) => location === href || (href !== '/admin' && location.startsWith(href));
  const initials = me?.firstName?.charAt(0) || (admin ? 'R' : 'A');
  return <div className="min-h-[100dvh] bg-muted/30"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto bg-sidebar text-sidebar-foreground md:block"><div className="flex h-20 items-center border-b border-white/10 px-4"><Logo dark className="h-auto w-full max-w-full object-contain" /></div><div className="p-4"><p className="px-3 py-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/40">{admin ? 'İçerik yönetimi' : 'B2B çalışma alanı'}</p>{nav.map(([href, label, Icon]) => <button key={String(href)} data-testid={`link-portal-${label}`} onClick={() => setLocation(String(href))} className={`mt-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold ${isActive(String(href)) ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{typeof Icon === 'function' && <Icon size={17} />}{String(label)}</button>)}</div><div className="absolute bottom-5 left-5 right-5"><Link href="/" data-testid="link-portal-home" className="flex items-center gap-2 text-xs text-white/50 hover:text-white">← Genel siteye dön</Link></div></aside><div className="md:pl-64"><header className="flex h-20 items-center justify-between border-b border-border bg-background px-5 lg:px-9"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{admin ? 'Admin paneli' : 'RMS Rulmak B2B'}</p><h1 className="mt-1 font-display text-xl font-semibold">{admin ? 'İçerik yönetimi' : 'Hoş geldiniz, çözüm ortağımız'}</h1></div><div className="flex items-center gap-3">{me ? <div className="hidden text-right sm:block"><p className="text-sm font-bold">{me.firstName ? `${me.firstName}${me.lastName ? ' ' + me.lastName : ''}` : 'Yönetici'}</p><p className="text-xs text-muted-foreground">{me.email}</p></div> : <span className="hidden text-right text-xs text-muted-foreground sm:block">{admin ? 'Yönetici hesabı' : 'Artemis Makina'}</span>}{me?.profileImageUrl ? <img src={me.profileImageUrl} alt="Profil" className="h-10 w-10 rounded-full border-2 border-primary object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{initials}</span>}<a href="/api/logout?returnTo=/" data-testid="link-portal-logout" title="Çıkış yap" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"><LogOut size={17} /></a></div></header><main className="mx-auto max-w-6xl p-5 lg:p-9">{admin ? <AdminContent /> : <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Ürünler', summary.data?.productCount ?? '—', PackageSearch], ['Markalar', summary.data?.brandCount ?? '—', Layers3], ['Kategoriler', summary.data?.categoryCount ?? '—', Filter], ['Sektörler', summary.data?.sectorCount ?? '—', Factory]].map(([label, value, Icon]) => <div key={String(label)} className="rounded-xl border border-border bg-card p-5"><div className="flex justify-between"><span className="text-sm text-muted-foreground">{String(label)}</span>{typeof Icon === 'function' && <Icon size={18} className="text-primary" />}</div><p data-testid={`text-dashboard-${label}`} className="mt-5 font-display text-3xl font-semibold">{String(value)}</p><p className="mt-1 text-xs text-muted-foreground">{admin ? 'Sistem genelinde' : 'Katalogda erişilebilir'}</p></div>)}</div><div className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">{admin ? 'Son katalog görünümü' : 'Hızlı erişim'}</p><h2 className="mt-2 font-display text-2xl font-semibold">{admin ? 'Öne çıkan ürünler' : 'Teknik ihtiyaçlarınız için'}</h2></div><FileText className="text-muted-foreground" /></div><div className="mt-6 space-y-3">{summary.data?.featuredProducts?.slice(0, 4).map((p) => <Link key={p.id} href={`/urunler/${p.slug}`} data-testid={`link-dashboard-product-${p.id}`} className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/40"><div><p className="font-semibold">{p.name}</p><p className="mt-1 text-xs text-muted-foreground">{p.brandName} · {p.code}</p></div><ChevronRight size={17} className="text-primary" /></Link>) ?? <EmptyState title="Henüz öne çıkan ürün yok" />}</div></div><div className="rounded-xl bg-sidebar p-6 text-sidebar-foreground"><p className="eyebrow !text-red-400">Destek masası</p><h2 className="mt-3 font-display text-2xl font-semibold">Bir sorunuz mu var?</h2><p className="mt-3 text-sm leading-6 text-white/60">Teknik ekibimiz uygulamanızı dinlemek için hazır.</p><Link href="/iletisim" data-testid="link-dashboard-contact" className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-white">Talep oluştur <ArrowRight size={15} /></Link></div></div></>}</main></div></div>;
}

function Router() {
  const [location] = useLocation();
  useEffect(() => {
    let alive = true;
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((s: Record<string, string>) => {
        if (!alive) return;
        if (s.meta_title) document.title = s.meta_title;
        if (s.meta_description) {
          let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
          }
          meta.content = s.meta_description;
        }
        if (s.gsc_verification) {
          let meta = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'google-site-verification';
            document.head.appendChild(meta);
          }
          meta.content = s.gsc_verification;
        }
        initAnalytics({ ga4: s.ga4_id, gtm: s.gtm_id, pixel: s.meta_pixel_id });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    initAnalytics();
    trackPageView(location, document.title);
  }, [location]);
  useEffect(() => {
    const jump = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const t1 = window.setTimeout(jump, 80);
    const t2 = window.setTimeout(jump, 450);
    const t3 = window.setTimeout(jump, 1300);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t3); };
  }, [location]);
  return <><RouteSeo location={location} /><ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/urunler" component={Products} /><Route path="/urunler/:slug" component={ProductDetail} /><Route path="/markalar" component={() => <DirectoryPage kind="brand" />} /><Route path="/kategoriler" component={() => <DirectoryPage kind="category" />} /><Route path="/kataloglar" component={() => <Shell><EKatalogHome /></Shell>} /><Route path="/e-katalog" component={() => <Shell><EKatalogHome /></Shell>} /><Route path="/kataloglar/:section" component={() => <Shell><EKatalogSection /></Shell>} /><Route path="/kataloglar/teknik/:brand" component={() => <Shell><EKatalogBrand /></Shell>} /><Route path="/kataloglar/katalog/:slug" component={() => <Shell><EKatalogDetail /></Shell>} /><Route path="/teknik-dokumanlar" component={() => <Shell><CatalogsPage /></Shell>} /><Route path="/yonetim/kataloglar" component={() => <Shell><CatalogAdminPage /></Shell>} /><Route path="/sektorler" component={Sectors} /><Route path="/kurumsal" component={Corporate} /><Route path="/teknik" component={() => <Shell><PageIntro eyebrow="Teknik bilgiler" title="Doğru seçim ve bakım için mühendislik bilgisi." description="Rulman ömrü, iç boşluk, yağlama, arıza teşhisi ve temel formüller — sahada ihtiyaç duyduğunuz teknik konular tek yerde." /><TechnicalHub /></Shell>} /><Route path="/teknik/:slug" component={() => <Shell><TechnicalDetail /></Shell>} /><Route path="/blog" component={Blog} /><Route path="/bizden-haberler" component={Blog} /><Route path="/distributorler" component={() => <DirectoryPage kind="brand" />} /><Route path="/galeri" component={Gallery} /><Route path="/iletisim" component={Contact} /><Route path="/b2b/giris" component={() => <Auth />} /><Route path="/b2b/kayit" component={() => <Auth register />} /><Route path="/b2b/panel" component={() => <PortalShell />} /><Route path="/admin" component={() => <PortalShell admin />} /><Route path="/admin/sliders" component={() => <PortalShell admin />} /><Route path="/admin/posts" component={() => <PortalShell admin />} /><Route path="/admin/brands" component={() => <PortalShell admin />} /><Route path="/admin/categories" component={() => <PortalShell admin />} /><Route path="/admin/products" component={() => <PortalShell admin />} /><Route path="/admin/sectors" component={() => <PortalShell admin />} /><Route path="/admin/sections" component={() => <PortalShell admin />} /><Route path="/admin/inquiries" component={() => <PortalShell admin />} /><Route path="/admin/settings" component={() => <PortalShell admin />} /><Route path="/admin/audit" component={() => <PortalShell admin />} /><Route path="/gizlilik-politikasi" component={() => <PolicyPage title="Gizlilik Politikası" text="RMS Rulmak olarak kişisel verilerinizin gizliliğine önem veriyoruz. Web sitemiz üzerinden topladığımız bilgiler yalnızca hizmet kalitemizi artırmak ve talebinize geri dönüş yapmak amacıyla kullanılır, üçüncü taraflarla izniniz olmadan paylaşılmaz." />} /><Route path="/kullanim-kosullari" component={() => <PolicyPage title="Kullanım Koşulları" text="Bu internet sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız: site içeriği bilgilendirme amaçlıdır, izinsiz çoğaltılamaz ve RMS Rulmak, sitede yer alan bilgilerin güncelliğini sağlamak için makul çabayı gösterir." />} /><Route path="/kvkk" component={() => <PolicyPage title="KVKK Aydınlatma Metni" text="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; ad, soyad, telefon, e-posta gibi kişisel verileriniz, talep ve şikayetlerinizin yanıtlanması amacıyla işlenmekte ve mevzuatın öngördüğü süre boyunca saklanmaktadır." />} /><Route path="/cerez-politikasi" component={() => <PolicyPage title="Çerez Politikası" text="Sitemiz, deneyiminizi iyileştirmek için zorunlu ve performans çerezleri kullanır. Tarayıcı ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz." />} /><Route component={NotFound} /></Switch></ErrorBoundary></>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /><CookieConsent /></TooltipProvider></QueryClientProvider>;
}

export default App;