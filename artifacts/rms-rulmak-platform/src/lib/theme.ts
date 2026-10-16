type SiteThemeVars = {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  accent: string;
};

const THEME_KEYS: ReadonlyArray<[keyof SiteThemeVars, string]> = [
  ["primary", "--primary"],
  ["primaryForeground", "--primary-foreground"],
  ["background", "--background"],
  ["foreground", "--foreground"],
  ["accent", "--accent"],
] as const;

export function applySiteTheme(
  settings: Record<string, string> | undefined,
): void {
  if (!settings) return;
  const root = document.documentElement;
  for (const [key, cssVar] of THEME_KEYS) {
    const raw = settings[`theme_${key}`];
    if (!raw || !raw.trim()) continue;
    root.style.setProperty(cssVar, raw.trim());
  }
}
