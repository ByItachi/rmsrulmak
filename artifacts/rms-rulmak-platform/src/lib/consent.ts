export type ConsentState = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  ads: boolean;
};

export const CONSENT_KEY = 'rms-consent-v1';
export const CONSENT_CHANGED_EVENT = 'rms:consent-changed';

export const defaultConsent: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  ads: false,
};

export const allConsent: ConsentState = {
  necessary: true,
  functional: true,
  analytics: true,
  ads: true,
};

export function loadConsent(): ConsentState {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return { ...defaultConsent };
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      functional: parsed.functional === true,
      analytics: parsed.analytics === true,
      ads: parsed.ads === true,
    };
  } catch {
    return { ...defaultConsent };
  }
}

export function saveConsent(state: ConsentState): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    // localStorage kapalıysa sadece oturum içinde geçerli kalır
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: state }));
}

export function hasConsentDecision(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}

export function consentModeFlags(state: ConsentState) {
  return {
    functional_storage: state.functional ? 'granted' : 'denied',
    analytics_storage: state.analytics ? 'granted' : 'denied',
    ad_storage: state.ads ? 'granted' : 'denied',
    ad_user_data: state.ads ? 'granted' : 'denied',
    ad_personalization: state.ads ? 'granted' : 'denied',
  } as const;
}
