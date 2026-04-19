export interface District {
  name: string;
  slug: string;
}

export interface City {
  name: string;
  districts: District[];
}

export const cities: City[] = [
  {
    name: "Bursa",
    districts: [
      { name: "Osmangazi", slug: "osmangazi-ilaclama" },
      { name: "Nilüfer", slug: "nilufer-ilaclama" },
      { name: "Yıldırım", slug: "yildirim-ilaclama" },
      { name: "Mudanya", slug: "mudanya-ilaclama" },
      { name: "Gürsu", slug: "gursu-ilaclama" },
      { name: "Kestel", slug: "kestel-ilaclama" },
    ],
  },
  {
    name: "İstanbul",
    districts: [
      { name: "Beşiktaş", slug: "besiktas-ilaclama" },
      { name: "Kadıköy", slug: "kadikoy-ilaclama" },
      { name: "Şişli", slug: "sisli-ilaclama" },
      { name: "Üsküdar", slug: "uskudar-ilaclama" },
      { name: "Esenyurt", slug: "esenyurt-ilaclama" },
      { name: "Başakşehir", slug: "basaksehir-ilaclama" },
    ],
  },
  {
    name: "İzmir",
    districts: [
      { name: "Karşıyaka", slug: "karsiyaka-ilaclama" },
      { name: "Bornova", slug: "bornova-ilaclama" },
      { name: "Konak", slug: "konak-ilaclama" },
      { name: "Çeşme", slug: "cesme-ilaclama" },
      { name: "Aliağa", slug: "aliaga-ilaclama" },
    ],
  },
  {
    name: "Ankara",
    districts: [
      { name: "Çankaya", slug: "cankaya-ilaclama" },
      { name: "Keçiören", slug: "kecioren-ilaclama" },
      { name: "Yenimahalle", slug: "yenimahalle-ilaclama" },
      { name: "Mamak", slug: "mamak-ilaclama" },
      { name: "Etimesgut", slug: "etimesgut-ilaclama" },
    ],
  },
  {
    name: "Mersin",
    districts: [
      { name: "Yenişehir", slug: "yenisehir-ilaclama" },
      { name: "Mezitli", slug: "mezitli-ilaclama" },
      { name: "Toroslar", slug: "toroslar-ilaclama" },
      { name: "Akdeniz", slug: "akdeniz-ilaclama" },
      { name: "Tarsus", slug: "tarsus-ilaclama" },
    ],
  },
  {
    name: "Adana",
    districts: [
      { name: "Çukurova", slug: "cukurova-ilaclama" },
      { name: "Seyhan", slug: "seyhan-ilaclama" },
      { name: "Sarıçam", slug: "saricam-ilaclama" },
      { name: "Yüreğir", slug: "yuregir-ilaclama" },
    ],
  },
  {
    name: "Eskişehir",
    districts: [
      { name: "Odunpazarı", slug: "odunpazari-ilaclama" },
      { name: "Tepebaşı", slug: "tepebasi-ilaclama" },
    ],
  },
  {
    name: "Çanakkale",
    districts: [
      { name: "Merkez", slug: "canakkale-merkez-ilaclama" },
      { name: "Kepez", slug: "kepez-ilaclama" },
      { name: "Çan", slug: "can-ilaclama" },
      { name: "Biga", slug: "biga-ilaclama" },
    ],
  },
];

export const allDistricts = cities.flatMap((city) => city.districts);
