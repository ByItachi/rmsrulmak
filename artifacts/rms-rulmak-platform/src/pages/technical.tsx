import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'wouter';
import { PageIntro } from '@/components/page-intro';
import { ArrowRight, Calculator, Gauge, Layers3, Ruler, ShieldAlert, Sparkles, Thermometer } from 'lucide-react';

export type TechTopic = {
  slug: string;
  title: string;
  summary: string;
  icon: typeof Gauge;
  render: () => ReactNode;
};

function InfoTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full min-w-[520px] text-left text-sm">
      <thead className="bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground"><tr>{head.map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} className="border-t border-border">{row.map((cell, j) => <td key={j} className="px-4 py-3 text-foreground/90">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="text-base leading-8 text-muted-foreground">{children}</p>;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 font-display text-2xl font-semibold">{children}</h2>;
}

function BearingLifeCalculator() {
  const [c, setC] = useState(25);
  const [p, setP] = useState(5);
  const [n, setN] = useState(1450);
  const [type, setType] = useState<'ball' | 'roller'>('ball');
  const exponent = type === 'ball' ? 3 : 10 / 3;
  const l10h = useMemo(() => {
    if (!n || !p) return 0;
    return (1_000_000 / (60 * n)) * Math.pow(c / p, exponent);
  }, [c, p, n, exponent]);
  return <div className="rounded-xl border border-border bg-card p-6 md:p-8">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold">Dinamik yük sayısı C (kN)<input type="number" min={0} value={c} onChange={(e) => setC(Number(e.target.value))} className="field mt-2" /></label>
      <label className="block text-sm font-semibold">Eşdeğer dinamik yük P (kN)<input type="number" min={0} value={p} onChange={(e) => setP(Number(e.target.value))} className="field mt-2" /></label>
      <label className="block text-sm font-semibold">Devir sayısı n (dev/dak)<input type="number" min={0} value={n} onChange={(e) => setN(Number(e.target.value))} className="field mt-2" /></label>
      <label className="block text-sm font-semibold">Rulman tipi
        <select value={type} onChange={(e) => setType(e.target.value as 'ball' | 'roller')} className="field mt-2">
          <option value="ball">Bilyalı rulman (p=3)</option>
          <option value="roller">Makaralı rulman (p=10/3)</option>
        </select>
      </label>
    </div>
    <div className="mt-7 rounded-lg bg-sidebar p-6 text-sidebar-foreground">
      <p className="eyebrow !text-red-400">Sonuç</p>
      <p className="mt-3 font-display text-4xl font-semibold">{l10h > 0 ? l10h.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : '—'} saat</p>
      <p className="mt-2 text-sm text-white/60">L10 nominal ömür — rulmanların %90'ının yorulma hasarı görmeden ulaşabileceği tahmini çalışma süresi.</p>
    </div>
    <p className="mt-5 text-xs text-muted-foreground">Formül: L10h = (10⁶ / 60n) × (C/P)^p. Sonuç yalnızca teorik bir öngörüdür; gerçek ömür sıcaklık, yağlama, kirlilik ve montaj kalitesine göre değişir.</p>
  </div>;
}

function BeltPulleyCalculator() {
  const [n1, setN1] = useState(1450);
  const [d1, setD1] = useState(100);
  const [d2, setD2] = useState(200);
  const [center, setCenter] = useState(500);
  const n2 = d2 ? (n1 * d1) / d2 : 0;
  const beltLength = 2 * center + (Math.PI * (d1 + d2)) / 2 + Math.pow(d2 - d1, 2) / (4 * center || 1);
  return <div className="rounded-xl border border-border bg-card p-6 md:p-8">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold">Tahrik kasnağı devri n1 (dev/dak)<input type="number" value={n1} onChange={(e) => setN1(Number(e.target.value))} className="field mt-2" /></label>
      <label className="block text-sm font-semibold">Tahrik kasnağı çapı D1 (mm)<input type="number" value={d1} onChange={(e) => setD1(Number(e.target.value))} className="field mt-2" /></label>
      <label className="block text-sm font-semibold">Tahrikli kasnak çapı D2 (mm)<input type="number" value={d2} onChange={(e) => setD2(Number(e.target.value))} className="field mt-2" /></label>
      <label className="block text-sm font-semibold">Merkez mesafesi C (mm)<input type="number" value={center} onChange={(e) => setCenter(Number(e.target.value))} className="field mt-2" /></label>
    </div>
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <div className="rounded-lg bg-sidebar p-6 text-sidebar-foreground"><p className="eyebrow !text-red-400">Tahrikli kasnak devri</p><p className="mt-3 font-display text-3xl font-semibold">{n2.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} dev/dak</p></div>
      <div className="rounded-lg bg-sidebar p-6 text-sidebar-foreground"><p className="eyebrow !text-red-400">Yaklaşık kayış boyu</p><p className="mt-3 font-display text-3xl font-semibold">{beltLength.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} mm</p></div>
    </div>
    <p className="mt-5 text-xs text-muted-foreground">Formüller: n2 = n1 × D1/D2 (hız oranı) ve L ≈ 2C + π(D1+D2)/2 + (D2-D1)²/4C (düz kayış için yaklaşık boy). Kesin kayış seçimi için üretici kataloğundaki standart boylar kullanılmalıdır.</p>
  </div>;
}

export const technicalTopics: TechTopic[] = [
  {
    slug: 'rulman-omur-hesabi', title: 'Rulman Ömür Hesabı', icon: Calculator,
    summary: 'L10 nominal ömür formülüyle rulmanınızın beklenen çalışma süresini tahmin edin.',
    render: () => <>
      <Lead>Bir rulmanın nominal ömrü (L10), aynı grup rulmanların %90'ının yorulmaya bağlı hasar görmeden tamamlayabileceği dönüş sayısı ya da çalışma saati olarak tanımlanır. Hesaplama; rulmanın dinamik yük sayısı (C), uygulamadaki eşdeğer dinamik yük (P) ve devir sayısına (n) bağlıdır.</Lead>
      <SectionTitle>Hesaplama aracı</SectionTitle>
      <div className="mt-5"><BearingLifeCalculator /></div>
      <SectionTitle>Ömrü etkileyen etkenler</SectionTitle>
      <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground list-disc pl-5">
        <li>Çalışma sıcaklığı ve yağlama rejiminin (viskozite oranı κ) ömür üzerindeki etkisi</li>
        <li>Kirlilik seviyesi ve filtrasyon kalitesi</li>
        <li>Montaj hassasiyeti, hizalama ve ön yük</li>
        <li>Gerçek yük spektrumu ile hesap yükü arasındaki fark</li>
      </ul>
    </>,
  },
  {
    slug: 'rulmanlarin-ic-boslugu', title: 'Rulmanların İç Boşluğu', icon: Ruler,
    summary: 'Radyal iç boşluk sınıfları (C2–C5) ve doğru sınıfın nasıl seçildiği.',
    render: () => <>
      <Lead>Rulman iç boşluğu, iç ve dış bilezik ile yuvarlanma elemanları arasındaki radyal veya eksenel oynama miktarıdır. Montaj sonrası sıkı geçme, sıcaklık farkı ve dönüş koşulları bu boşluğu daraltacağından, uygulamaya uygun sınıfın seçilmesi rulman ömrü için kritiktir.</Lead>
      <SectionTitle>Standart iç boşluk sınıfları</SectionTitle>
      <div className="mt-5"><InfoTable head={['Sınıf', 'Tanım', 'Tipik kullanım']} rows={[
        ['C2', 'Normalden daha dar boşluk', 'Düşük sıcaklık farkı, hassas konumlandırma gereken yerler'],
        ['CN (Normal)', 'Standart boşluk', 'Genel amaçlı uygulamaların büyük kısmı'],
        ['C3', 'Normalden geniş boşluk', 'Sıkı geçme, yüksek sıcaklık farkı veya titreşimli ortamlar'],
        ['C4', 'C3\'ten daha geniş', 'Elektrik motorları, yüksek hız/sıcaklık uygulamaları'],
        ['C5', 'En geniş standart boşluk', 'Çok yüksek sıcaklık farkı veya çok sıkı geçmeli montajlar'],
      ]} /></div>
      <SectionTitle>Seçimi etkileyen faktörler</SectionTitle>
      <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground list-disc pl-5">
        <li>İç ve dış bilezik arasındaki sıcaklık farkı</li>
        <li>Mil ve yatak yuvasına uygulanan geçme toleransı (sıkı/boşluklu geçme)</li>
        <li>Dönüş hızı ve titreşim seviyesi</li>
        <li>İstenen sessizlik ve konumlandırma hassasiyeti</li>
      </ul>
    </>,
  },
  {
    slug: 'rulman-gresleri-ve-ozellikleri', title: 'Rulman Gresleri ve Özellikleri', icon: Thermometer,
    summary: 'Kıvam sınıfları, sabun bazları ve sıcaklık aralıklarına göre gres seçimi.',
    render: () => <>
      <Lead>Gres; yağ, kıvamlaştırıcı (sabun veya kompleks sabun) ve katkı maddelerinden oluşan yarı katı bir yağlayıcıdır. Doğru gres seçimi, rulman ömrünü doğrudan etkileyen en önemli bakım kararlarından biridir.</Lead>
      <SectionTitle>NLGI kıvam sınıfları</SectionTitle>
      <div className="mt-5"><InfoTable head={['NLGI sınıfı', 'Görünüm', 'Tipik kullanım']} rows={[
        ['000 – 00', 'Çok yumuşak, akışkan', 'Merkezi yağlama sistemleri, düşük sıcaklık'],
        ['1', 'Yumuşak', 'Düşük sıcaklıkta çalışan, hassas rulmanlar'],
        ['2', 'Orta (en yaygın)', 'Genel amaçlı elektrik motoru ve endüstriyel rulmanlar'],
        ['3', 'Sert', 'Dikey miller, sızdırmazlık gereken yüksek sıcaklık uygulamaları'],
      ]} /></div>
      <SectionTitle>Sabun bazına göre gres tipleri</SectionTitle>
      <div className="mt-5"><InfoTable head={['Gres tipi', 'Sıcaklık aralığı', 'Öne çıkan özellik']} rows={[
        ['Lityum sabunlu', '-20°C / +120°C', 'Genel amaçlı, iyi su direnci, ekonomik'],
        ['Lityum kompleks', '-20°C / +150°C', 'Yüksek sıcaklık ve yük kapasitesi'],
        ['Kalsiyum sülfonat kompleks', '-20°C / +160°C', 'Üstün su ve korozyon direnci, yüksek yük'],
        ['Poliüre', '-20°C / +160°C', 'Uzun ömür, elektrik motorlarında yaygın'],
      ]} /></div>
      <p className="mt-6 text-xs text-muted-foreground">Değerler genel referans amaçlıdır; kesin seçim için uygulamanın yük, hız ve ortam koşullarına göre üretici teknik veri sayfası esas alınmalıdır.</p>
    </>,
  },
  {
    slug: 'tipik-rulman-arizalari', title: 'Tipik Rulman Arızaları', icon: ShieldAlert,
    summary: 'Yorulma, aşınma, korozyon ve elektrik erozyonu gibi başlıca hasar türleri ve önlemleri.',
    render: () => <>
      <Lead>Rulman hasarlarının büyük çoğunluğu, rulmanın kendi kalitesinden değil; yanlış montaj, yetersiz yağlama veya hatalı seçimden kaynaklanır. Hasar izlerini doğru okumak, kök nedeni bulmanın ilk adımıdır.</Lead>
      <SectionTitle>Başlıca hasar türleri</SectionTitle>
      <div className="mt-5"><InfoTable head={['Hasar türü', 'Olası neden', 'Önlem']} rows={[
        ['Yorulma (pulluk/flaking)', 'Aşırı yük veya ömür sonu', 'Doğru rulman seçimi ve yük hesabı'],
        ['Aşınma', 'Yetersiz/kirli yağlama, titreşim', 'Yağlama planı ve filtrasyonun iyileştirilmesi'],
        ['Korozyon', 'Nem, uygun olmayan depolama', 'Doğru contalama ve kuru depolama koşulları'],
        ['Elektrik erozyonu', 'Mil üzerinden geçen kaçak akım', 'Topraklama fırçası, izoleli rulman kullanımı'],
        ['Yanlış hizalama', 'Montaj hatası, mil/yatak ekseni kayması', 'Hizalama ölçümü ve doğru montaj ekipmanı'],
        ['Aşırı ön yük / sıkı montaj', 'Yanlış geçme toleransı veya montaj yöntemi', 'Isıtma yöntemiyle montaj, doğru tolerans seçimi'],
      ]} /></div>
    </>,
  },
  {
    slug: 'kayis-kasnak-hesabi', title: 'Kayış-Kasnak Hesabı', icon: Calculator,
    summary: 'Kasnak çapı, devir oranı ve yaklaşık kayış boyu hesaplama aracı.',
    render: () => <>
      <Lead>Kayış-kasnak sistemlerinde devir oranı, kasnak çaplarının ters oranıyla belirlenir. Doğru kayış boyu ve merkez mesafesi seçimi, gerilim kaybını ve erken yıpranmayı önler.</Lead>
      <SectionTitle>Hesaplama aracı</SectionTitle>
      <div className="mt-5"><BeltPulleyCalculator /></div>
    </>,
  },
  {
    slug: 'kestirimci-bakim', title: 'Kestirimci Bakım', icon: Gauge,
    summary: 'Titreşim analizi, termal görüntüleme ve yağ analiziyle planlı duruşları azaltma.',
    render: () => <>
      <Lead>Kestirimci (öngörücü) bakım, ekipman durumunu sürekli veya periyodik olarak izleyerek arızayı gerçekleşmeden önce tespit etmeyi amaçlar. Plansız duruşları azaltır ve bakım maliyetlerini öngörülebilir kılar.</Lead>
      <SectionTitle>Başlıca izleme yöntemleri</SectionTitle>
      <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground list-disc pl-5">
        <li><strong className="text-foreground">Titreşim analizi:</strong> Rulman, dişli ve dengesizlik kaynaklı arızaları frekans spektrumunda erken yakalar.</li>
        <li><strong className="text-foreground">Termal görüntüleme:</strong> Aşırı ısınan yatak, kaplin veya elektrik bağlantılarını tespit eder.</li>
        <li><strong className="text-foreground">Yağ analizi:</strong> Aşınma parçacıkları ve yağ bozunumu üzerinden iç durumu değerlendirir.</li>
        <li><strong className="text-foreground">Akustik emisyon / ultrasonik dinleme:</strong> Yağlama eksikliğini erken aşamada duyurur.</li>
      </ul>
      <SectionTitle>ISO 10816 titreşim şiddeti bölgeleri</SectionTitle>
      <div className="mt-5"><InfoTable head={['Bölge', 'Durum', 'Aksiyon']} rows={[
        ['A', 'Yeni devreye alınan makine', 'Referans değer olarak kaydedilir'],
        ['B', 'Sınırsız süre çalışmaya uygun', 'Normal izleme sürdürülür'],
        ['C', 'Sınırlı süre çalışmaya uygun değil', 'Planlı bakım için izleme sıklaştırılır'],
        ['D', 'Hasar riski yüksek', 'Acil müdahale gerekir'],
      ]} /></div>
    </>,
  },
  {
    slug: 'muhendislikte-onemli-formuller', title: 'Mühendislikte Önemli Formüller', icon: Sparkles,
    summary: 'Güç, tork ve çevresel hız gibi sık kullanılan temel mühendislik formülleri.',
    render: () => <>
      <Lead>Güç aktarım sistemlerinin boyutlandırılmasında sık başvurulan temel formüller aşağıda özetlenmiştir.</Lead>
      <div className="mt-5"><InfoTable head={['Büyüklük', 'Formül', 'Birimler']} rows={[
        ['Tork', 'T = 9550 × P / n', 'T: Nm, P: kW, n: dev/dak'],
        ['Güç', 'P = T × n / 9550', 'P: kW, T: Nm, n: dev/dak'],
        ['Çevresel hız', 'v = π × D × n / 60000', 'v: m/s, D: mm, n: dev/dak'],
        ['Üç fazlı elektrik gücü', 'P = √3 × V × I × cosφ', 'P: W, V: Volt, I: Amper'],
        ['Newton\'un 2. yasası', 'F = m × a', 'F: N, m: kg, a: m/s²'],
      ]} /></div>
      <p className="mt-6 text-xs text-muted-foreground">Bu formüller genel mühendislik referansıdır; projeye özel hesaplamalarda güvenlik katsayıları ve uygulama koşulları ayrıca değerlendirilmelidir.</p>
    </>,
  },
  {
    slug: 'toleranslar', title: 'Toleranslar', icon: Layers3,
    summary: 'ISO tolerans sistemi, geçme türleri ve yüzey pürüzlülüğü temelleri.',
    render: () => <>
      <Lead>Mil-yatak geçmelerinde doğru tolerans seçimi, rulmanın iç boşluğunu, ısınmasını ve ömrünü doğrudan etkiler. ISO tolerans sistemi, boyut sapmalarını standart IT sınıflarıyla tanımlar.</Lead>
      <SectionTitle>Geçme türleri</SectionTitle>
      <div className="mt-5"><InfoTable head={['Geçme türü', 'Tanım', 'Örnek kullanım']} rows={[
        ['Boşluklu geçme', 'Mil, delikten her zaman küçüktür', 'Kolay sökülüp takılması istenen yerler'],
        ['Geçmeli (transition) geçme', 'Boşluk veya sıkılık toleransa göre değişir', 'Hassas konumlandırma gereken montajlar'],
        ['Sıkı geçme', 'Mil, delikten her zaman büyüktür', 'Dönen bilezik, yüksek yük veya titreşimli montajlar'],
      ]} /></div>
      <SectionTitle>Yüzey pürüzlülüğü</SectionTitle>
      <Lead>Yatak yuvası ve mil yüzeylerinde Ra (ortalama pürüzlülük) değeri, geçme sıkılığının korunması ve conta ömrü açısından önemlidir; hassas rulman oturma yüzeylerinde genellikle Ra 0,8–1,6 µm aralığı hedeflenir.</Lead>
    </>,
  },
];

function TechnicalCard({ topic }: { topic: TechTopic }) {
  const Icon = topic.icon;
  return <Link href={`/teknik/${topic.slug}`} data-testid={`card-tech-${topic.slug}`} className="lift group rounded-xl border border-border bg-card p-6">
    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-primary"><Icon size={20} /></span>
    <h3 className="mt-6 font-display text-xl font-semibold group-hover:text-primary">{topic.title}</h3>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{topic.summary}</p>
    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">İncele <ArrowRight size={14} className="text-primary transition-transform group-hover:translate-x-1" /></span>
  </Link>;
}

export function TechnicalHub() {
  return <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{technicalTopics.map((t) => <TechnicalCard key={t.slug} topic={t} />)}</div>
  </main>;
}

export function TechnicalDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const topic = technicalTopics.find((t) => t.slug === slug);
  if (!topic) return <PageIntro eyebrow="Teknik bilgiler" title="İçerik bulunamadı" description="Aradığınız teknik konu kaldırılmış olabilir." />;
  return <>
  <PageIntro eyebrow="Teknik bilgiler" title={topic.title} description={topic.summary} />
  <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
    <Link href="/teknik" data-testid="link-back-technical" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">← Tüm teknik konular</Link>
    <div className="mt-8">{topic.render()}</div>
    <div className="mt-14 rounded-xl bg-muted p-7 md:flex md:items-center md:justify-between"><div><p className="eyebrow">Uygulamanıza özel destek</p><p className="mt-2 text-sm text-muted-foreground">Teknik ekibimiz, projenize özgü hesap ve seçim konusunda size yardımcı olabilir.</p></div><Link href="/iletisim" data-testid="link-technical-contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold md:mt-0">Ekibe danışın <ArrowRight size={15} className="text-primary" /></Link></div>
  </main></>;
}
