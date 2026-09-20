export interface Medicine {
  id: string;
  name: {
    bn: string;
    en: string;
  };
  genericName?: {
    bn: string;
    en: string;
  };
  category: Category;
  subcategory?: string;
  packSize: number; // units per strip/pack
  pricePerPack: number; // BDT
  pricePerUnit: number; // BDT, calculated from pricePerPack / packSize
  inStock: boolean;
  requiresPrescription: boolean;
  dosageForm: string; // tablet, capsule, syrup, ointment, etc.
  strength?: string;
  manufacturer?: string;
  isSensitive?: boolean; // triggers discreet packaging
  image?: string;
}

export type Category =
  | 'prescription'
  | 'daily-otc'
  | 'chronic'
  | 'baby-mom'
  | 'women'
  | 'emergency';

export const categories: Array<{
  id: Category;
  name: { bn: string; en: string };
  description: { bn: string; en: string };
  icon: string;
}> = [
  {
    id: 'prescription',
    name: { bn: 'প্রেসক্রিপশন মেডিসিন', en: 'Prescription Medicine' },
    description: { bn: 'ডাক্তারের প্রেসক্রিপশন প্রয়োজন', en: 'Requires doctor\'s prescription' },
    icon: '💊',
  },
  {
    id: 'daily-otc',
    name: { bn: 'দৈনিক ও OTC', en: 'Daily & OTC' },
    description: { bn: 'ব্যথানাশক, সর্দি-কাশি, মলম ও তেল', en: 'Pain relief, cold & flu, ointments & oils' },
    icon: '🩹',
  },
  {
    id: 'chronic',
    name: { bn: 'ক্রনিক কেয়ার', en: 'Chronic Care' },
    description: { bn: 'ডায়াবেটিস, উচ্চরক্তচাপ, থাইরয়েড, হার্ট', en: 'Diabetes, blood pressure, thyroid, heart' },
    icon: '❤️',
  },
  {
    id: 'baby-mom',
    name: { bn: 'শিশু ও মা', en: 'Baby & Mom' },
    description: { bn: 'ফর্মুলা, ডায়াপার, প্রসবপূর্ব ভিটামিন', en: 'Formula, diapers, prenatal vitamins' },
    icon: '👶',
  },
  {
    id: 'women',
    name: { bn: 'নারী স্বাস্থ্য', en: 'Women\'s Care' },
    description: { bn: 'স্যানিটারি পণ্য, গর্ভাবস্থা পরীক্ষা', en: 'Sanitary products, pregnancy tests' },
    icon: '🌸',
  },
  {
    id: 'emergency',
    name: { bn: 'জরুরি প্রয়োজন', en: 'Emergency Needs' },
    description: { bn: 'গোপনীয় প্যাকেজিং সহ', en: 'With discreet packaging' },
    icon: '🔒',
  },
];

export const medicines: Medicine[] = [
  // Prescription Medicine
  {
    id: 'med-001',
    name: { bn: 'নাপা এক্সটেন্ড', en: 'Napa Extend' },
    genericName: { bn: 'প্যারাসিটামল', en: 'Paracetamol' },
    category: 'prescription',
    packSize: 10,
    pricePerPack: 30,
    pricePerUnit: 3,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'tablet',
    strength: '665mg',
    manufacturer: 'Beximco Pharmaceuticals',
  },
  {
    id: 'med-002',
    name: { bn: 'এসিলক', en: 'Aciloc' },
    genericName: { bn: 'রেনিটিডিন', en: 'Ranitidine' },
    category: 'prescription',
    packSize: 10,
    pricePerPack: 50,
    pricePerUnit: 5,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'tablet',
    strength: '150mg',
    manufacturer: 'Cadila Pharmaceuticals',
  },
  {
    id: 'med-003',
    name: { bn: 'সেকলো', en: 'Seclo' },
    genericName: { bn: 'ওমিপ্রাজোল', en: 'Omeprazole' },
    category: 'prescription',
    packSize: 14,
    pricePerPack: 84,
    pricePerUnit: 6,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'capsule',
    strength: '20mg',
    manufacturer: 'Square Pharmaceuticals',
  },

  // Daily & OTC
  {
    id: 'med-004',
    name: { bn: 'নাপা', en: 'Napa' },
    genericName: { bn: 'প্যারাসিটামল', en: 'Paracetamol' },
    category: 'daily-otc',
    subcategory: 'pain-relief',
    packSize: 10,
    pricePerPack: 10,
    pricePerUnit: 1,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'tablet',
    strength: '500mg',
    manufacturer: 'Beximco Pharmaceuticals',
  },
  {
    id: 'med-005',
    name: { bn: 'হিস্টাসিন', en: 'Histacin' },
    genericName: { bn: 'সেটিরিজিন', en: 'Cetirizine' },
    category: 'daily-otc',
    subcategory: 'cold-flu',
    packSize: 10,
    pricePerPack: 30,
    pricePerUnit: 3,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'tablet',
    strength: '10mg',
    manufacturer: 'Square Pharmaceuticals',
  },
  {
    id: 'med-006',
    name: { bn: 'ফাস্ট রিলিফ', en: 'Fast Relief' },
    category: 'daily-otc',
    subcategory: 'ointment-oil',
    packSize: 1,
    pricePerPack: 45,
    pricePerUnit: 45,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'ointment',
    strength: '20g',
    manufacturer: 'ACI Limited',
  },
  {
    id: 'med-007',
    name: { bn: 'মুভ', en: 'Move' },
    category: 'daily-otc',
    subcategory: 'ointment-oil',
    packSize: 1,
    pricePerPack: 80,
    pricePerUnit: 80,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'gel',
    strength: '30g',
    manufacturer: 'Reckitt Benckiser',
  },
  {
    id: 'med-008',
    name: { bn: 'স্যাভলন অ্যান্টিসেপ্টিক ক্রিম', en: 'Savlon Antiseptic Cream' },
    category: 'daily-otc',
    subcategory: 'ointment-oil',
    packSize: 1,
    pricePerPack: 60,
    pricePerUnit: 60,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'cream',
    strength: '30g',
    manufacturer: 'ACI Limited',
  },

  // Chronic Care
  {
    id: 'med-009',
    name: { bn: 'মেটফরমিন', en: 'Metformin' },
    genericName: { bn: 'মেটফরমিন হাইড্রোক্লোরাইড', en: 'Metformin Hydrochloride' },
    category: 'chronic',
    subcategory: 'diabetes',
    packSize: 30,
    pricePerPack: 60,
    pricePerUnit: 2,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'tablet',
    strength: '500mg',
    manufacturer: 'Square Pharmaceuticals',
  },
  {
    id: 'med-010',
    name: { bn: 'এমলোডিপিন', en: 'Amlodipine' },
    genericName: { bn: 'এমলোডিপিন বেসাইলেট', en: 'Amlodipine Besylate' },
    category: 'chronic',
    subcategory: 'blood-pressure',
    packSize: 30,
    pricePerPack: 90,
    pricePerUnit: 3,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'tablet',
    strength: '5mg',
    manufacturer: 'Incepta Pharmaceuticals',
  },
  {
    id: 'med-011',
    name: { bn: 'থাইরক্স', en: 'Thyrox' },
    genericName: { bn: 'লেভোথাইরক্সিন', en: 'Levothyroxine' },
    category: 'chronic',
    subcategory: 'thyroid',
    packSize: 30,
    pricePerPack: 75,
    pricePerUnit: 2.5,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'tablet',
    strength: '50mcg',
    manufacturer: 'Beximco Pharmaceuticals',
  },
  {
    id: 'med-012',
    name: { bn: 'এটরভা', en: 'Atorva' },
    genericName: { bn: 'এটরভাস্ট্যাটিন', en: 'Atorvastatin' },
    category: 'chronic',
    subcategory: 'heart-cardiac',
    packSize: 30,
    pricePerPack: 150,
    pricePerUnit: 5,
    inStock: true,
    requiresPrescription: true,
    dosageForm: 'tablet',
    strength: '20mg',
    manufacturer: 'Square Pharmaceuticals',
  },

  // Baby & Mom Care
  {
    id: 'med-013',
    name: { bn: 'ন্যান প্রো ১', en: 'Nan Pro 1' },
    category: 'baby-mom',
    subcategory: 'formula',
    packSize: 1,
    pricePerPack: 1200,
    pricePerUnit: 1200,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'powder',
    strength: '400g',
    manufacturer: 'Nestlé',
  },
  {
    id: 'med-014',
    name: { bn: 'পাম্পার্স বেবি ড্রাই', en: 'Pampers Baby Dry' },
    category: 'baby-mom',
    subcategory: 'diapers',
    packSize: 52,
    pricePerPack: 1040,
    pricePerUnit: 20,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'diaper',
    strength: 'Medium',
    manufacturer: 'Procter & Gamble',
  },
  {
    id: 'med-015',
    name: { bn: 'প্রিনাটাল মাল্টিভিটামিন', en: 'Prenatal Multivitamin' },
    category: 'baby-mom',
    subcategory: 'prenatal',
    packSize: 30,
    pricePerPack: 300,
    pricePerUnit: 10,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'tablet',
    manufacturer: 'Square Pharmaceuticals',
  },
  {
    id: 'med-016',
    name: { bn: 'বেবি ওয়াইপস', en: 'Baby Wipes' },
    category: 'baby-mom',
    subcategory: 'wipes',
    packSize: 80,
    pricePerPack: 200,
    pricePerUnit: 2.5,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'wipes',
    manufacturer: 'Johnson & Johnson',
  },

  // Women's Care
  {
    id: 'med-017',
    name: { bn: 'সেনোরা আলট্রা থিন', en: 'Senora Ultra Thin' },
    category: 'women',
    subcategory: 'sanitary',
    packSize: 8,
    pricePerPack: 80,
    pricePerUnit: 10,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'pad',
    manufacturer: 'ACI Limited',
  },
  {
    id: 'med-018',
    name: { bn: 'প্রেগনেন্সি টেস্ট কিট', en: 'Pregnancy Test Kit' },
    category: 'women',
    subcategory: 'pregnancy-test',
    packSize: 1,
    pricePerPack: 50,
    pricePerUnit: 50,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'test-kit',
    manufacturer: 'Accu-Sure',
  },
  {
    id: 'med-019',
    name: { bn: 'ফেমিকন', en: 'Femicon' },
    genericName: { bn: 'এথিনিল এস্ট্রাডিওল + লেভোনরজেস্ট্রেল', en: 'Ethinyl Estradiol + Levonorgestrel' },
    category: 'women',
    subcategory: 'contraceptive',
    packSize: 28,
    pricePerPack: 50,
    pricePerUnit: 1.79,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'tablet',
    manufacturer: 'Renata Limited',
  },

  // Emergency Needs (all marked as sensitive for discreet packaging)
  {
    id: 'med-020',
    name: { bn: 'ইকন', en: 'Econ' },
    genericName: { bn: 'লেভোনরজেস্ট্রেল', en: 'Levonorgestrel' },
    category: 'emergency',
    packSize: 1,
    pricePerPack: 30,
    pricePerUnit: 30,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'tablet',
    strength: '1.5mg',
    manufacturer: 'Square Pharmaceuticals',
    isSensitive: true,
  },
  {
    id: 'med-021',
    name: { bn: 'প্যানথার', en: 'Panther' },
    category: 'emergency',
    subcategory: 'condom',
    packSize: 3,
    pricePerPack: 45,
    pricePerUnit: 15,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'condom',
    manufacturer: 'Tulip Laboratories',
    isSensitive: true,
  },
  {
    id: 'med-022',
    name: { bn: 'কে-ওয়াই জেলি', en: 'K-Y Jelly' },
    category: 'emergency',
    subcategory: 'lubricant',
    packSize: 1,
    pricePerPack: 120,
    pricePerUnit: 120,
    inStock: true,
    requiresPrescription: false,
    dosageForm: 'gel',
    strength: '50ml',
    manufacturer: 'Johnson & Johnson',
    isSensitive: true,
  },
];

// Helper functions
export const getMedicinesByCategory = (category: Category): Medicine[] => {
  return medicines.filter(med => med.category === category);
};

export const getMedicineById = (id: string): Medicine | undefined => {
  return medicines.find(med => med.id === id);
};

export const searchMedicines = (query: string, language: 'bn' | 'en'): Medicine[] => {
  const lowerQuery = query.toLowerCase();
  return medicines.filter(med =>
    med.name[language].toLowerCase().includes(lowerQuery) ||
    (med.genericName && med.genericName[language].toLowerCase().includes(lowerQuery))
  );
};
