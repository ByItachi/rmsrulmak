import { breadcrumbJsonLd, homeJsonLd } from './seo-schema';
import { Seo } from './seo';
import type { SeoInput } from './seo';

type RouteMeta = Pick<SeoInput, 'title' | 'description' | 'noindex' | 'type'>;

const P = (suffix: string) => `RMS Rulmak — ${suffix}`;

const staticMeta: Record<string, RouteMeta> = {
  '/': {
    title: P('Rulman ve Güç Aktarım Çözümleri'),
    description:
      "RMS Rulmak; Gates, IDC, Dunlop ve Linmax'ın resmi distribütörü, 18 global markada rulman ve güç aktarım ürünleri. 1990'dan beri sanayinin yanında.",
    type: 'website',
  },
  '/urunler': {
    title: P('Rulman, Kayış ve Güç Aktarım Ürünleri'),
    description:
      'Bilyalı, konik, masuralı ve iğneli rulmanlar; V-kayış, zincir dişlisi ve güç aktarım ekipmanları. Ürün kodlarıyla arayın, teknik özellikleri inceleyin.',
  },
  '/markalar': {
    title: P('Markalar – Resmi Distribütörlük ve Doğrudan İthalat'),
    description:
      "Gates, IDC, Dunlop ve Linmax'ın Türkiye resmi distribütörüyüz; Schaeffler, NSK, NTN, Timken, Koyo, IKO, JNS, RBC ve Bower'ı doğrudan ithal ediyoruz.",
  },
  '/kategoriler': {
    title: P('Kategoriler – Ürün Grupları'),
    description: 'Rulmanlar, güç aktarım ürünleri, kayış ve kasnak sistemleri ve daha fazlası – ürün kategorilerine göre keşfedin.',
  },
  '/kataloglar': {
    title: P('E-Katalog – Ürün ve Teknik Kataloglar'),
    description: 'Şirket profili, teknik kataloglar ve broşürler – marka bazlı ürün kataloglarına tek noktadan erişin.',
  },
  '/e-katalog': {
    title: P('E-Katalog – Ürün ve Teknik Kataloglar'),
    description: 'Şirket profili, teknik kataloglar ve broşürler – marka bazlı ürün kataloglarına tek noktadan erişin.',
  },
  '/teknik-dokumanlar': {
    title: P('Teknik Dökümanlar – PDF Arşivi'),
    description: 'Rulman ve güç aktarım ürünleri için PDF dokümanları ve katalog arşivi.',
  },
  '/sektorler': {
    title: P('Sektörel Rulman ve Güç Aktarım Çözümleri'),
    description:
      'Demir-çelik, madencilik, savunma, petrokimya, enerji, çimento, tekstil, havacılık, CNC ve tarım için sektöre özel rulman ve güç aktarım çözümleri.',
  },
  '/kurumsal': {
    title: P('Hakkımızda'),
    description:
      "1990'dan bu yana rulman ve güç aktarım ürünlerinde faaliyet gösteren, üçüncü kuşak tarafından yönetilen bağımsız bir aile şirketiyiz. Tarihçemiz, misyon, vizyon ve ilkelerimiz.",
  },
  '/teknik': {
    title: P('Teknik Bilgiler ve Hesaplama Araçları'),
    description:
      'Rulman ömrü hesabı, iç boşluk, gresler, arıza teşhisi, kayış-kasnak hesabı, toleranslar ve mühendislik formülleri.',
  },
  '/blog': {
    title: P('Teknik Yazılar ve Rehberler'),
    description: 'Rulman seçimi, bakım, kestirimci bakım ve endüstriyel haberler.',
  },
  '/bizden-haberler': {
    title: P('Bizden Haberler'),
    description: 'RMS Rulmak güncel duyuruları ve etkinlikleri.',
  },
  '/distributorler': {
    title: P('Distribütörler'),
    description: 'IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler, Koyo ve RBC Bearings marka dağıtım ağı.',
  },
  '/galeri': {
    title: P('Galeri'),
    description: 'RMS Rulmak ürün, tesis ve etkinlik fotoğrafları.',
  },
  '/iletisim': {
    title: P('İletişim – Teklif ve Bilgi Talebi'),
    description:
      'Adres, telefon, WhatsApp ve e-posta ile RMS Rulmak ekibine ulaşın; ürün ve teklif talebi oluşturun.',
  },
  '/gizlilik-politikasi': {
    title: P('Gizlilik Politikası'),
    description: 'RMS Rulmak gizlilik politikası.',
  },
  '/kullanim-kosullari': {
    title: P('Kullanım Koşulları'),
    description: 'RMS Rulmak web sitesi kullanım koşulları.',
  },
  '/kvkk': {
    title: P('KVKK Aydınlatma Metni'),
    description: '6698 sayılı KVKK kapsamında kişisel verilerin işlenmesi hakkında aydınlatma metni.',
  },
  '/cerez-politikasi': {
    title: P('Çerez Politikası'),
    description: 'RMS Rulmak çerez kullanımı ve tercihleri hakkında bilgilendirme.',
  },
};

const privatePrefixes = ['/admin', '/b2b', '/yonetim'];

function match(location: string): RouteMeta | undefined {
  if (privatePrefixes.some((p) => location === p || location.startsWith(`${p}/`))) {
    return {
      title: P('Yönetim Paneli'),
      description: 'RMS Rulmak yönetim ve B2B panelleri.',
      noindex: true,
    };
  }
  if (location.startsWith('/urunler/')) {
    return {
      title: P('Ürün Detayı'),
      description: 'Rulman ve güç aktarım ürünü teknik detayları.',
    };
  }
  if (location.startsWith('/teknik/')) {
    return {
      title: P('Teknik Rehber'),
      description: 'Rulman ve güç aktarımı teknik rehberi.',
    };
  }
  if (location.startsWith('/kataloglar/')) {
    return { title: P('E-Katalog'), description: 'RMS Rulmak katalog içeriği.' };
  }
  const exact = staticMeta[location];
  return exact;
}

export function RouteSeo({ location }: { location: string }) {
  const meta = match(location);
  if (!meta) return null;
  const jsonLd = meta.noindex
    ? undefined
    : location === '/'
      ? homeJsonLd()
      : breadcrumbJsonLd(location);
  return (
    <Seo
      title={meta.title}
      description={meta.description}
      path={location}
      noindex={meta.noindex === true}
      jsonLd={jsonLd}
    />
  );
}
