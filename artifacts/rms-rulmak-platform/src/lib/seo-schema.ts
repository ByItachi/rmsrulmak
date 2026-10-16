import { SITE_URL } from './seo';

const CONTACT = {
  phone: '+902163924141',
  address: {
    street: 'Şifa Mah. Şekerpınar Cad. No: 114/B',
    locality: 'Tuzla',
    region: 'İstanbul',
    postalCode: '34945',
    country: 'TR',
  },
};

const rmsOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RMS Rulmak',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/rulmak-icon-red.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: CONTACT.phone,
    contactType: 'sales',
    areaServed: 'TR',
    availableLanguage: ['tr', 'en'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.locality,
    addressRegion: CONTACT.address.region,
    postalCode: CONTACT.address.postalCode,
    addressCountry: CONTACT.address.country,
  },
};

const rmsWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RMS Rulmak',
  url: SITE_URL,
  inLanguage: 'tr-TR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/urunler?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const rmsLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}#kurulus`,
  name: 'RMS Rulmak Rulman ve Güç Aktarım Sistemleri',
  url: SITE_URL,
  telephone: CONTACT.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.locality,
    addressRegion: CONTACT.address.region,
    postalCode: CONTACT.address.postalCode,
    addressCountry: CONTACT.address.country,
  },
  openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-13:00'],
};

export function homeJsonLd(): readonly Record<string, unknown>[] {
  return [rmsOrg, rmsWebSite, rmsLocalBusiness];
}

export function breadcrumbJsonLd(path: string): Record<string, unknown>[] {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return [];
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
    ...parts.map((part, index) => {
      const href = `${SITE_URL}/${parts.slice(0, index + 1).join('/')}`;
      const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
      return { '@type': 'ListItem', position: index + 2, name, item: href };
    }),
  ];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    },
  ];
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  code: string;
  brandName: string | null;
  description: string | null;
  image?: string | null;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.code,
    description:
      product.description ?? `${product.brandName ?? ''} rulman ürünü — ${product.code}`,
    url: `${SITE_URL}/urunler/${product.slug}`,
    ...(product.image
      ? { image: `${SITE_URL}${product.image}` }
      : {}),
    brand: product.brandName
      ? { '@type': 'Brand', name: product.brandName }
      : undefined,
  };
}
