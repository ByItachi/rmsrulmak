import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { X } from 'lucide-react';
import {
  allConsent,
  CONSENT_CHANGED_EVENT,
  defaultConsent,
  hasConsentDecision,
  loadConsent,
  saveConsent,
  type ConsentState,
} from '@/lib/consent';
import { applyConsent } from '@/lib/analytics';

function getToggleClass(active: boolean) {
  return active
    ? 'bg-primary'
    : 'bg-muted-foreground/40';
}

function Switch({
  label,
  checked,
  onChange,
  locked = false,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  locked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={locked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${getToggleClass(checked)} ${locked ? 'opacity-60' : ''}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </button>
    </label>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(loadConsent());

  useEffect(() => {
    if (!hasConsentDecision()) setVisible(true);
    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
  }, []);

  function onConsentChanged() {
    if (hasConsentDecision()) setVisible(false);
  }

  function openPreferences() {
    setDraft(loadConsent());
    setPreferencesOpen(true);
  }

  function decide(state: ConsentState) {
    saveConsent(state);
    applyConsent(state);
    setVisible(false);
    setPreferencesOpen(false);
  }

  if (!visible && !preferencesOpen) return null;

  return (
    <>
      {visible && (
        <div
          data-testid="cookie-banner"
          role="dialog"
          aria-label="Çerez tercihleri"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 p-4 shadow-2xl backdrop-blur sm:p-5"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="font-display text-lg font-semibold">Çerez tercihleriniz</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Sitemizde zorunlu çerezlerin yanı sıra deneyiminizi iyileştirmek ve
                ölçümleme yapmak için çerezler kullanırız. KVKK kapsamında
                detaylı bilgiyi{' '}
                <Link href="/cerez-politikasi" data-testid="link-cookie-policy" className="font-bold text-primary underline-offset-2 hover:underline">
                  Çerez Politikası
                </Link>{' '}
                sayfamızda bulabilirsiniz. Seçiminizi istediğiniz zaman
                güncelleyebilirsiniz.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button data-testid="button-cookie-manage" onClick={openPreferences} className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted">
                Tercihler
              </button>
              <button data-testid="button-cookie-reject" onClick={() => decide({ ...defaultConsent })} className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted">
                Reddet
              </button>
              <button data-testid="button-cookie-accept" onClick={() => decide(allConsent)} className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}

      {preferencesOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-sidebar/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl md:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Çerez yönetimi</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">Tercihleriniz</h2>
              </div>
              <button
                data-testid="button-cookie-close"
                onClick={() => setPreferencesOpen(false)}
                className="rounded-md p-2 hover:bg-muted"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 divide-y divide-border">
              <Switch label="Zorunlu çerezler (gerekli)" checked locked onChange={() => {}} />
              <Switch label="İşlevsellik çerezleri" checked={draft.functional} onChange={(v) => setDraft({ ...draft, functional: v })} />
              <Switch label="Analitik çerezler (GA4)" checked={draft.analytics} onChange={(v) => setDraft({ ...draft, analytics: v })} />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Reklam çerezleri yalnızca 'Tümünü Kabul Et' seçildiğinde etkinleşir.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                data-testid="button-cookie-save"
                onClick={() => decide({ ...draft, ads: false })}
                className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
              >
                Seçimleri Kaydet
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              <Link href="/cerez-politikasi" className="underline underline-offset-2 hover:text-primary" data-testid="link-cookie-policy-modal">
                Çerez Politikası
              </Link>{' '}
              ·{' '}
              <Link href="/kvkk" className="underline underline-offset-2 hover:text-primary" data-testid="link-cookie-kvkk-modal">
                KVKK Aydınlatma Metni
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
