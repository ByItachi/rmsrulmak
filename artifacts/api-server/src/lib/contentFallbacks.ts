export const fallbackSectors = [
  {
    name: "Demir ve Çelik",
    slug: "demir-celik",
    description:
      "Yüksek ısı, yük ve sürekli çalışma koşulları için dayanıklı rulman ve güç aktarım çözümleri.",
  },
  {
    name: "Madencilik",
    slug: "madencilik",
    description:
      "Tozlu ve zorlu sahalarda ekipman ömrünü ve çalışma sürekliliğini destekleyen ürünler.",
  },
  {
    name: "Kağıt ve Sanayi",
    slug: "kagit-sanayi",
    description:
      "Üretim hatlarında hassasiyet, hız ve bakım verimliliği sağlayan teknik çözümler.",
  },
  {
    name: "Çimento",
    slug: "cimento",
    description:
      "Ağır hizmet uygulamalarında güvenilir hareket ve güç aktarımı için ürün seçimi.",
  },
  {
    name: "Taşıma ve Depolama",
    slug: "tasima-depolama",
    description:
      "Konveyör ve lojistik sistemlerinde kesintisiz hareket için doğru bileşenler.",
  },
  {
    name: "Enerji",
    slug: "enerji",
    description:
      "Enerji ekipmanlarında güvenilirlik, uzun ömür ve planlı bakım odaklı çözümler.",
  },
  {
    name: "Tarım ve Gıda",
    slug: "tarim-gida",
    description:
      "Hijyen, dayanıklılık ve zorlu çalışma ortamlarına uygun endüstriyel ürünler.",
  },
  {
    name: "Otomotiv ve Makine",
    slug: "otomotiv-makine",
    description:
      "Hassas ve yüksek performanslı makine sistemleri için rulman ve güç aktarım ürünleri.",
  },
];

const TR_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ş: "s",
  Ş: "s",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

export const fallbackSliders = [
  {
    title: "Koyo Japon teknolojisi rulmanları",
    subtitle: "",
    image: "/hero/slide-koyo.jpg",
    href: "/kataloglar/teknik/koyo",
    placement: "hero",
  },
  {
    title: "Japon hassasiyetinde NSK mükemmeliyeti",
    subtitle: "",
    image: "/hero/slide-nsk.jpg",
    href: "/kataloglar/teknik/nsk",
    placement: "hero",
  },
  {
    title: "Alman mühendisliğinde mükemmellik",
    subtitle: "",
    image: "/hero/slide-schaeffler.jpg",
    href: "/kataloglar/teknik/schaeffler",
    placement: "hero",
  },
  {
    title: "Gates ile endüstriyel güç aktarımı",
    subtitle: "",
    image: "/hero/slide-gates.jpg",
    href: "/kataloglar/teknik/gates",
    placement: "hero",
  },
  {
    title: "Japon mühendisliğinde güven ve verimlilik",
    subtitle: "",
    image: "/hero/slide-ntn.jpg",
    href: "/kataloglar/teknik/ntn",
    placement: "hero",
  },
  {
    title: "Konik rulmanlarla endüstriyel güç",
    subtitle: "",
    image: "/hero/slide-timken.jpg",
    href: "/kataloglar/teknik/timken",
    placement: "hero",
  },
];

export function slugify(value: string): string {
  const mapped = value.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (ch) => TR_MAP[ch] ?? ch);
  return (
    mapped
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || `kayit-${Date.now().toString(36)}`
  );
}

export function isUniqueViolation(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  ) {
    return true;
  }
  // Drizzle/pg hataları bazen altta sarılıdır (ör. { cause: { code } }).
  const cause =
    typeof (error as { cause?: unknown })?.cause === "object"
      ? ((error as { cause?: unknown }).cause as { code?: string })
      : undefined;
  if (cause?.code === "23505") return true;
  // Bazı sürücü sarmalayıcıları kodu mesaja gömebilir.
  const message =
    error instanceof Error ? error.message : error != null ? String(error) : "";
  return message.includes("23505") || /duplicate key/i.test(message);
}
