import {
  consentModeFlags,
  loadConsent,
  type ConsentState,
} from './consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsIds = { ga4?: string; gtm?: string; pixel?: string };

let GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) ?? '';
let GTM_ID = (import.meta.env.VITE_GTM_ID as string | undefined) ?? '';
let PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? '';

let booted = false;
let pageViewFired = false;

function pushDataLayer(obj: unknown) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(obj);
}

function gtag(...args: unknown[]) {
  if (typeof window.gtag === 'function') window.gtag(...args);
}

function loadScript(src: string, id: string, extra?: { nonce?: string }) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  if (extra?.nonce) script.setAttribute('nonce', extra.nonce);
  document.head.appendChild(script);
}

export function initAnalytics(ids?: AnalyticsIds): void {
  if (booted) return;
  booted = true;
  if (ids) {
    if (ids.ga4) GA4_ID = ids.ga4;
    if (ids.gtm) GTM_ID = ids.gtm;
    if (ids.pixel) PIXEL_ID = ids.pixel;
  }

  window.dataLayer = window.dataLayer ?? [];
  pushDataLayer({
    event: 'consent_init',
    ...consentModeFlags(loadConsent()),
  });

  // GTM: consent initializasyonunu her zaman ilet (script GTM_ID varsa yüklenir)
  if (GTM_ID) {
    loadScript(
      `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`,
      'gtm-script',
    );
  }

  // GA4: script ve config'i her zaman başlat; veri toplanması izinle denetlenir (Consent Mode)
  if (GA4_ID) {
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA4_ID, 'ga4-script');
    gtag('js', new Date());
    gtag('config', GA4_ID, { send_page_view: false, anonymize_ip: true });
    gtag('set', 'url_passthrough', true);
    gtag('consent', 'default', {
      ...consentModeFlags(loadConsent()),
      wait_for_update: 500,
    });
  }

  // Meta Pixel: script yüklenir; izin yoksa "revoke"
  if (PIXEL_ID) {
    loadScript('https://connect.facebook.net/en_US/fbevents.js', 'meta-pixel-script');
    window.fbq =
      window.fbq ??
      function fbq(...args: unknown[]) {
        const queue = window.dataLayer ?? [];
        queue.push(['fbq', ...args]);
      };
    window.fbq('init', PIXEL_ID);
    window.fbq('consent', loadConsent().ads ? 'grant' : 'revoke');
  }

  wireGlobalEvents();
}

export function applyConsent(state: ConsentState): void {
  const flags = consentModeFlags(state);
  gtag('consent', 'update', flags);
  window.fbq?.('consent', state.ads ? 'grant' : 'revoke');
}

function consentAllows(kind: 'analytics' | 'ads'): boolean {
  return loadConsent()[kind] === true;
}

export function track(eventName: string, params: Record<string, unknown> = {}): void {
  if (!GA4_ID && !GTM_ID && !PIXEL_ID) return;
  pushDataLayer({ event: eventName, ...params });
  if (GA4_ID && consentAllows('analytics')) {
    gtag('event', eventName, params);
  }
  if (PIXEL_ID && consentAllows('ads') && eventName.startsWith('lead')) {
    window.fbq?.('trackCustom', eventName, params);
  }
}

export function trackPageView(path: string, title: string): void {
  if (!GA4_ID && !GTM_ID && !PIXEL_ID) return;
  pushDataLayer({ event: 'page_view', page_path: path, page_title: title });
  if (GA4_ID && consentAllows('analytics')) {
    if (pageViewFired) {
      gtag('event', 'page_view', { page_path: path, page_title: title });
    } else {
      gtag('config', GA4_ID, {
        page_path: path,
        page_title: title,
        send_page_view: true,
      });
      pageViewFired = true;
    }
  }
}

function eventAllowed(eventName: string): boolean {
  if (eventName.startsWith('click_')) return consentAllows('analytics');
  if (eventName.startsWith('lead') || eventName === 'generate_lead') return true;
  return true;
}

export function safeTrack(eventName: string, params: Record<string, unknown> = {}): void {
  if (!eventAllowed(eventName)) return;
  track(eventName, params);
}

function wireGlobalEvents(): void {
  // Delegated: PDF indirme
  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement | null)?.closest?.('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href') ?? '';
    if (href.startsWith('tel:')) {
      safeTrack('click_to_call', { phone: href.replace('tel:', '') });
      return;
    }
    if (href.includes('wa.me') || href.startsWith('https://wa.me')) {
      safeTrack('click_whatsapp', {});
      return;
    }
    if (href.startsWith('mailto:')) {
      safeTrack('click_email', {});
      return;
    }
    if (href.toLowerCase().endsWith('.pdf')) {
      safeTrack('file_download', { file_name: href.split('/').pop() });
    }
  }, true);
}

export function initAnalyticsForSpa(): Promise<void> {
  initAnalytics();
  return Promise.resolve();
}
