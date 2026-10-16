import { useEffect } from 'react';

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  'https://www.rmsrulmak.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/rulmak-red.png`;

export type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  type?: string;
  jsonLd?: readonly Record<string, unknown>[];
};

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string | null,
) {
  const el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!content) {
    el?.remove();
    return;
  }
  if (el) {
    el.setAttribute('content', content);
    return;
  }
  const meta = document.createElement('meta');
  meta.setAttribute(attr, key);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
}

function upsertLink(rel: string, href: string | null) {
  const el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  );
  if (!href) {
    el?.remove();
    return;
  }
  if (el) {
    el.setAttribute('href', href);
    return;
  }
  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = 'website',
  jsonLd,
}: SeoInput) {
  useEffect(() => {
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:site_name', 'RMS Rulmak');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    const injected: HTMLScriptElement[] = [];
    if (jsonLd) {
      for (const schema of jsonLd) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.seoJsonld = 'true';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
        injected.push(script);
      }
    }

    return () => {
      for (const script of injected) script.remove();
    };
  }, [title, description, path, image, noindex, type, jsonLd]);

  return null;
}
