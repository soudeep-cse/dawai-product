export interface ProductType {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  categoryName: string;
  subcategoryName: string;
  requiresDosageForm: boolean;
  description: string;
}

export const PRODUCT_TYPES: ProductType[] = [
  // Prescription Medicines
  {
    id: 'prescription-tablet',
    nameEn: 'Prescription Tablet',
    nameBn: 'প্রেসক্রিপশন ট্যাবলেট',
    icon: '💊',
    categoryName: 'Prescription Medicine',
    subcategoryName: 'Tablets',
    requiresDosageForm: true,
    description: 'Prescription required medicine tablets',
  },
  {
    id: 'prescription-capsule',
    nameEn: 'Prescription Capsule',
    nameBn: 'প্রেসক্রিপশন ক্যাপসুল',
    icon: '💊',
    categoryName: 'Prescription Medicine',
    subcategoryName: 'Capsules',
    requiresDosageForm: true,
    description: 'Prescription required medicine capsules',
  },
  {
    id: 'prescription-injection',
    nameEn: 'Prescription Injection',
    nameBn: 'প্রেসক্রিপশন ইনজেকশন',
    icon: '💉',
    categoryName: 'Prescription Medicine',
    subcategoryName: 'Injections',
    requiresDosageForm: true,
    description: 'Prescription required injections',
  },

  // OTC Medicines
  {
    id: 'otc-tablet',
    nameEn: 'OTC Tablet',
    nameBn: 'OTC ট্যাবলেট',
    icon: '💊',
    categoryName: 'Daily & OTC',
    subcategoryName: 'Tablets',
    requiresDosageForm: true,
    description: 'Over-the-counter medicine tablets',
  },
  {
    id: 'pain-relief',
    nameEn: 'Pain Relief Medicine',
    nameBn: 'ব্যথা নিরাময় ওষুধ',
    icon: '💊',
    categoryName: 'Daily & OTC',
    subcategoryName: 'Pain Relief',
    requiresDosageForm: true,
    description: 'Pain reliever tablets and capsules',
  },
  {
    id: 'cold-cough',
    nameEn: 'Cold & Cough Medicine',
    nameBn: 'ঠান্ডা ও কাশি ওষুধ',
    icon: '🤧',
    categoryName: 'Daily & OTC',
    subcategoryName: 'Cold & Cough',
    requiresDosageForm: true,
    description: 'Cough and cold relief medicines',
  },

  // Oils & Creams
  {
    id: 'oil',
    nameEn: 'Oil',
    nameBn: 'তেল',
    icon: '🧴',
    categoryName: 'Skin Care',
    subcategoryName: 'Oils',
    requiresDosageForm: false,
    description: 'Medicinal and cosmetic oils',
  },
  {
    id: 'cream',
    nameEn: 'Cream',
    nameBn: 'ক্রিম',
    icon: '🧴',
    categoryName: 'Skin Care',
    subcategoryName: 'Creams',
    requiresDosageForm: false,
    description: 'Medicinal and cosmetic creams',
  },
  {
    id: 'lotion',
    nameEn: 'Lotion',
    nameBn: 'লোশন',
    icon: '🧴',
    categoryName: 'Skin Care',
    subcategoryName: 'Lotions',
    requiresDosageForm: false,
    description: 'Medicinal and cosmetic lotions',
  },

  // Women's Health
  {
    id: 'condom',
    nameEn: 'Condom',
    nameBn: 'কনডম',
    icon: '💓',
    categoryName: 'Women\'s Health',
    subcategoryName: 'Contraceptives',
    requiresDosageForm: false,
    description: 'Condoms and contraceptive products',
  },
  {
    id: 'sanitary-pad',
    nameEn: 'Sanitary Pad',
    nameBn: 'স্যানিটারি প্যাড',
    icon: '🌸',
    categoryName: 'Women\'s Health',
    subcategoryName: 'Sanitary Products',
    requiresDosageForm: false,
    description: 'Sanitary pads and menstrual products',
  },

  // Child & Mother
  {
    id: 'formula-milk',
    nameEn: 'Formula Milk',
    nameBn: 'ফর্মুলা মিল্ক',
    icon: '🍼',
    categoryName: 'Child & Mother',
    subcategoryName: 'Baby Formula',
    requiresDosageForm: false,
    description: 'Infant formula milk powder',
  },
  {
    id: 'diaper',
    nameEn: 'Diaper',
    nameBn: 'ডায়াপার',
    icon: '👶',
    categoryName: 'Child & Mother',
    subcategoryName: 'Baby Care',
    requiresDosageForm: false,
    description: 'Baby diapers and nappies',
  },

  // Vitamins & Supplements
  {
    id: 'vitamin',
    nameEn: 'Vitamin',
    nameBn: 'ভিটামিন',
    icon: '🥗',
    categoryName: 'Vitamins & Supplements',
    subcategoryName: 'Vitamins',
    requiresDosageForm: true,
    description: 'Vitamin supplements and tablets',
  },

  // Emergency
  {
    id: 'first-aid',
    nameEn: 'First Aid Supply',
    nameBn: 'প্রাথমিক চিকিৎসা সামগ্রী',
    icon: '🚨',
    categoryName: 'Emergency Need',
    subcategoryName: 'First Aid',
    requiresDosageForm: false,
    description: 'First aid supplies and equipment',
  },
];

// Get product type by ID
export function getProductType(id: string): ProductType | undefined {
  return PRODUCT_TYPES.find((pt) => pt.id === id);
}

// Get all product types
export function getAllProductTypes(): ProductType[] {
  return PRODUCT_TYPES;
}

// Group by category
export function getProductTypesByCategory(categoryName: string): ProductType[] {
  return PRODUCT_TYPES.filter((pt) => pt.categoryName === categoryName);
}

// Get unique categories
export function getProductCategories(): string[] {
  return Array.from(new Set(PRODUCT_TYPES.map((pt) => pt.categoryName)));
}
