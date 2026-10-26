export type CatalogItem = { slug: string; title: string; image: string; brandSlug: string; file?: string };

export type CatalogBrandGroup = { slug: string; name: string; items: CatalogItem[] };


export const technicalCatalogBrands: CatalogBrandGroup[] = [
  {
    slug: 'idc', name: 'IDC', items: [
      { slug: 'idc-01', title: 'IDC Tanıtım Broşürü (Image Brochure)', image: '/catalog/idc/covers/idc-imagebroschuere.png', brandSlug: 'idc', file: '/catalog/idc/pdf/idc-imagebroschuere.pdf' },
      { slug: 'idc-02', title: 'Eksenel Radyal Rulmanlar (Axial Radial Bearings)', image: '/catalog/idc/covers/axial-radial-bearings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/axial-radial-bearings-by-idc.pdf' },
      { slug: 'idc-03', title: 'Silindirik Makaralı Eksenel Rulmanlar', image: '/catalog/idc/covers/cylindrical-roller-thrust-bearings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/cylindrical-roller-thrust-bearings-by-idc.pdf' },
      { slug: 'idc-04', title: 'İç Bilezikler (Inner Rings)', image: '/catalog/idc/covers/inner-rings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/inner-rings-by-idc.pdf' },
      { slug: 'idc-05', title: 'Çapraz Makaralı Rulmanlar (Crossed Roller Bearings)', image: '/catalog/idc/covers/crossed-roller-bearings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/crossed-roller-bearings-by-idc.pdf' },
      { slug: 'idc-06', title: 'İğneli Makaralı Rulmanlar (Needle Roller Bearings)', image: '/catalog/idc/covers/needle-roller-bearings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/needle-roller-bearings-by-idc.pdf' },
      { slug: 'idc-07', title: 'Segmanlar (Snap Rings)', image: '/catalog/idc/covers/snap-rings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/snap-rings-by-idc.pdf' },
      { slug: 'idc-08', title: 'Yoke ve Saplı Tip Yol Makaraları', image: '/catalog/idc/covers/yoke-and-stud-type-track-rollers-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/yoke-and-stud-type-track-rollers-by-idc.pdf' },
      { slug: 'idc-09', title: 'Tam Kapasiteli Silindirik Makaralı Rulmanlar', image: '/catalog/idc/covers/full-complement-cylindrical-rollerbearings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/full-complement-cylindrical-rollerbearings-by-idc.pdf' },
      { slug: 'idc-10', title: 'Planet Dişliler İçin Tam Kapasiteli Silindirik Makaralı Rulmanlar', image: '/catalog/idc/covers/full-complement-cylindrical-roller-bearings-for-planetary-wheels-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/full-complement-cylindrical-roller-bearings-for-planetary-wheels-by-idc.pdf' },
      { slug: 'idc-11', title: 'Tablet Pres Rulmanları (Bearings for Tablet Presses)', image: '/catalog/idc/covers/bearings-for-tablet-presses-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/bearings-for-tablet-presses-by-idc.pdf' },
      { slug: 'idc-12', title: 'Tandem Rulmanlar (Tandem Bearings)', image: '/catalog/idc/covers/tandem-bearings-by-idc.png', brandSlug: 'idc', file: '/catalog/idc/pdf/tandem-bearings-by-idc.pdf' },
    ],
  },
  {
    slug: 'gates', name: 'Gates', items: [
      { slug: 'gates-01', title: 'Heavy Duty V-Belt Drive Design Manual', image: '/catalog/gates/covers/heavy-duty-vbelt-drive-design-manual.png', brandSlug: 'gates', file: '/catalog/gates/pdf/heavy-duty-vbelt-drive-design-manual.pdf' },
      { slug: 'gates-02', title: 'Poly Chain GT Carbon Drive Design Manual', image: '/catalog/gates/covers/poly-chain-gt-carbon-drive-design-manual.png', brandSlug: 'gates', file: '/catalog/gates/pdf/poly-chain-gt-carbon-drive-design-manual.pdf' },
      { slug: 'gates-03', title: 'Power Transmission Catalog', image: '/catalog/gates/power-transmission-catalog-001.png', brandSlug: 'gates', file: '/catalog/gates/pdf/power-transmission-catalog.pdf' },
      { slug: 'gates-04', title: 'PowerGrip GT3 Drive Design Manual', image: '/catalog/gates/covers/powergrip-gt3-drive-design-manual.png', brandSlug: 'gates', file: '/catalog/gates/pdf/powergrip-gt3-drive-design-manual.pdf' },
    ],
  },
  {
    slug: 'dunlop', name: 'Dunlop', items: [
      { slug: 'dunlop-01', title: 'Dunlop Bearings Kataloğu', image: '/catalog/dunlop/covers/dunlop-bearings-catalogue.png', brandSlug: 'dunlop', file: '/catalog/dunlop/pdf/dunlop-bearings-catalogue.pdf' },
      { slug: 'dunlop-02', title: 'Dunlop Linkages Kataloğu', image: '/catalog/dunlop/covers/dunlop-linkages-catalogue.png', brandSlug: 'dunlop', file: '/catalog/dunlop/pdf/dunlop-linkages-catalogue.pdf' },
    ],
  },
  {
    slug: 'ntn', name: 'NTN', items: [
      { slug: 'ntn-01', title: 'NTN Rulman Kataloğu', image: '/catalog/ntn/972f7793-001.png', brandSlug: 'ntn', file: '/catalog/ntn/pdf/2203E.pdf' },
    ],
  },
  {
    slug: 'nsk', name: 'NSK', items: [
      { slug: 'nsk-01', title: 'NSK Büyük Boyutlu Rulmanlar (Large Size Rolling Bearings)', image: '/catalog/nsk/covers/e125g.png', brandSlug: 'nsk', file: '/catalog/nsk/pdf/e125g.pdf' },
      { slug: 'nsk-02', title: 'NSK Rulman Teknik Kataloğu (E1102)', image: '/catalog/nsk/covers/nsk-e1102-rolling-bearings.png', brandSlug: 'nsk', file: '/catalog/nsk/pdf/nsk-e1102-rolling-bearings.pdf' },
    ],
  },
  {
    slug: 'timken', name: 'Timken', items: [
      { slug: 'timken-01', title: 'Timken Konik Masuralı Rulman Kataloğu', image: '/catalog/timken/TIMKEN-Konik-Masurali-Rulman-Katalogu-001.png', brandSlug: 'timken', file: '/catalog/timken/pdf/timken-conik-masurali.pdf' },
      { slug: 'timken-02', title: 'Timken Küresel Masuralı Rulman Kataloğu', image: '/catalog/timken/covers/timken-spherical-roller-bearing.png', brandSlug: 'timken', file: '/catalog/timken/pdf/timken-spherical-roller-bearing.pdf' },
    ],
  },
  {
    slug: 'schaeffler', name: 'Schaeffler (FAG / INA)', items: [
      { slug: 'schaeffler-01', title: 'Schaeffler Arcanol Gresler', image: '/catalog/schaeffler/covers/arcanol-greases.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/arcanol-greases.pdf' },
      { slug: 'schaeffler-02', title: 'FAG Rulman Genel Teknik Bilgi Kataloğu', image: '/catalog/schaeffler/covers/fag-rolling-bearings-general.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/fag-rolling-bearings-general.pdf' },
      { slug: 'schaeffler-03', title: 'Schaeffler Genel Katalog', image: '/catalog/schaeffler/Schaeffler-Genel-Katalog.jpg', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/gl1-de-en.pdf' },
      { slug: 'schaeffler-04', title: 'Schaeffler Montaj El Kitabı (Rulman Söküm/Montaj)', image: '/catalog/schaeffler/covers/mounting-dismounting-manual.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/mounting-dismounting-manual.pdf' },
      { slug: 'schaeffler-05', title: 'Tek Sıra Bilyalı/Makaralı Rulmanlar — Ürün Grubu Özeti', image: '/catalog/schaeffler/covers/single-row-ball-roller-bearings.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/single-row-ball-roller-bearings.pdf' },
      { slug: 'schaeffler-06', title: 'Schaeffler Super Precision Bearings', image: '/catalog/schaeffler/covers/super-precision-bearings.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/super-precision-bearings.pdf' },
      { slug: 'schaeffler-07', title: 'Schaeffler Yatak Kataloğu (Bearing Housings)', image: '/catalog/schaeffler/covers/bearing-housings.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/bearing-housings.pdf' },
      { slug: 'schaeffler-08', title: 'Yataklı Rulmanlar — Black Series (Housing Units)', image: '/catalog/schaeffler/covers/black-series-housing-units.png', brandSlug: 'schaeffler', file: '/catalog/schaeffler/pdf/black-series-housing-units.pdf' },
    ],
  },
  {
    slug: 'koyo', name: 'Koyo', items: [
      { slug: 'koyo-01', title: 'KOYO Genel Rulman Kataloğu (Ball & Roller Bearings)', image: '/catalog/koyo/covers/catbs007en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catbs007en.pdf' },
      { slug: 'koyo-02', title: 'JTKB1023EX Rulman Kataloğu (LFT-Series)', image: '/catalog/koyo/covers/catb1023ex.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catb1023ex.pdf' },
      { slug: 'koyo-03', title: 'JTBA005EN Rulman Kataloğu', image: '/catalog/koyo/covers/catba005en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catba005en.pdf' },
      { slug: 'koyo-04', title: 'JTSB001EN Rulman Kataloğu (İnç Serisi Konik Masuralı)', image: '/catalog/koyo/covers/catbs001en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catbs001en.pdf' },
      { slug: 'koyo-05', title: 'JTSB004EN Rulman Kataloğu', image: '/catalog/koyo/covers/catbs004en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catbs004en.pdf' },
      { slug: 'koyo-06', title: 'JTSB007EN Rulman Kataloğu (İğneli Rulmanlar)', image: '/catalog/koyo/covers/catbs007en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catbs007en.pdf' },
      { slug: 'koyo-07', title: 'JTSB008EN Rulman Kataloğu', image: '/catalog/koyo/covers/catbs008en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catbs008en.pdf' },
      { slug: 'koyo-08', title: 'JTSB010EN Rulman Kataloğu', image: '/catalog/koyo/covers/catbs010en.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catbs010en.pdf' },
      { slug: 'koyo-09', title: 'JTB1013EX Rulman Kataloğu (İnç Serisi Konik Masuralı)', image: '/catalog/koyo/covers/catb1013ex.png', brandSlug: 'koyo', file: '/catalog/koyo/pdf/catb1013ex.pdf' },
    ],
  },
  {
    slug: 'rbc', name: 'RBC Aerospace', items: [
      { slug: 'rbc-01', title: 'RBC Rolling Element Bearings Kataloğu', image: '/catalog/rbc/0001-1.jpg', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-rolling-element.pdf' },
      { slug: 'rbc-02', title: 'RBC Plain Bearings Kataloğu', image: '/catalog/rbc/0001-10.jpg', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-plain-bearings.pdf' },
      { slug: 'rbc-03', title: 'RBC Küresel Rulman / Rot Ucu / Mil Yatağı Kataloğu', image: '/catalog/rbc/covers/rbc-spherical-rodend-journal.png', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-spherical-rodend-journal.pdf' },
      { slug: 'rbc-04', title: 'RBC Havacılık Bilyalı Rulman Rot Uçları Kataloğu', image: '/catalog/rbc/covers/rbc-airframe-ball-bearing-rodends.png', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-airframe-ball-bearing-rodends.pdf' },
      { slug: 'rbc-05', title: 'RBC Heim Rot Uçları Kataloğu', image: '/catalog/rbc/covers/rbc-heim-rodends.png', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-heim-rodends.pdf' },
      { slug: 'rbc-06', title: 'RBC Sabit (Plain) Rulmanlar Kataloğu', image: '/catalog/rbc/covers/rbc-plain-bearings-web.png', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-plain-bearings-web.pdf' },
      { slug: 'rbc-07', title: 'RBC Spherco Kataloğu', image: '/catalog/rbc/covers/rbc-spherco.png', brandSlug: 'rbc', file: '/catalog/rbc/pdf/rbc-spherco.pdf' },
    ],
  },
  {
    slug: 'iko', name: 'IKO', items: [
      { slug: 'iko-01', title: 'IKO İğneli Rulman Genel Kataloğu (Needle Roller Bearing Catalog)', image: '/catalog/iko/covers/iko-needle-roller-bearing-catalog.png', brandSlug: 'iko', file: '/catalog/iko/pdf/iko-needle-roller-bearing-catalog.pdf' },
    ],
  },
  {
    slug: 'jns', name: 'JNS', items: [
      { slug: 'jns-01', title: 'JNS İğneli Rulman ve Kam Takipçisi Kataloğu', image: '/catalog/jns/covers/jns-needle-roller-bearing-catalog.png', brandSlug: 'jns', file: '/catalog/jns/pdf/jns-needle-roller-bearing-catalog.pdf' },
    ],
  },
  {
    slug: 'bower', name: 'Bower', items: [
      { slug: 'bower-01', title: 'Bower Konik Masuralı Rulman Karşılaştırma Kataloğu (Taper Roller Bearing Interchange)', image: '/catalog/bower/covers/bower-taper-roller-bearing-interchange.png', brandSlug: 'bower', file: '/catalog/bower/pdf/bower-taper-roller-bearing-interchange.pdf' },
    ],
  },
  {
    slug: 'linmax', name: 'Linmax', items: [
      { slug: 'linmax-01', title: 'Linmax Ürün Tanıtım Kataloğu', image: '/catalog/linmax/covers/linmax-urun-tanitimi.png', brandSlug: 'linmax', file: '/catalog/linmax/pdf/linmax-urun-tanitimi.pdf' },
    ],
  },
];

export const companyProfileCatalog: CatalogItem = { slug: 'sirket-profili', title: 'RMS Rulmak Şirket Profili', image: '/catalog/sirket-profili.jpg', brandSlug: 'rms' };

export const brochureCatalogs: CatalogItem[] = [
  companyProfileCatalog,
];

export const allCatalogs: CatalogItem[] = [
  companyProfileCatalog,
  ...technicalCatalogBrands.flatMap((g) => g.items),
];


export const brochurePdfs = [
  { slug: 'rulmak-brosur', title: 'RMS Rulmak Kurumsal Broşür (PDF)', file: '/catalog/rulmak-e-katalog.pdf' },
];

export function findCatalog(slug: string): CatalogItem | undefined {
  return allCatalogs.find((c) => c.slug === slug);
}
