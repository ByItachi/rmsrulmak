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
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
