export interface Keyword {
    arabic: string;
    english: string;
    description_ar: string;
    description_en: string;
    category: 'control' | 'declaration' | 'type' | 'builtin' | 'literal';
}

export const KEYWORDS: Keyword[] = [
    // Control Flow
    {
        arabic: 'إذا',
        english: 'if',
        description_ar: 'جملة شرطية',
        description_en: 'Conditional statement',
        category: 'control'
    },
    {
        arabic: 'وإلا',
        english: 'else',
        description_ar: 'الجملة البديلة',
        description_en: 'Alternative clause',
        category: 'control'
    },
    {
        arabic: 'كرر',
        english: 'while',
        description_ar: 'حلقة تكرار',
        description_en: 'While loop',
        category: 'control'
    },
    {
        arabic: 'لكل',
        english: 'for',
        description_ar: 'حلقة لكل',
        description_en: 'For loop',
        category: 'control'
    },
    {
        arabic: 'في',
        english: 'in',
        description_ar: 'داخل مجموعة',
        description_en: 'In collection',
        category: 'control'
    },
    {
        arabic: 'افعل',
        english: 'do',
        description_ar: 'بداية حلقة افعل',
        description_en: 'Do-while start',
        category: 'control'
    },
    {
        arabic: 'طالما',
        english: 'while',
        description_ar: 'شرط حلقة افعل',
        description_en: 'Do-while condition',
        category: 'control'
    },
    {
        arabic: 'من',
        english: 'from',
        description_ar: 'بداية النطاق',
        description_en: 'Range start',
        category: 'control'
    },
    {
        arabic: 'إلى',
        english: 'to',
        description_ar: 'نهاية النطاق',
        description_en: 'Range end',
        category: 'control'
    },
    {
        arabic: 'خطوة',
        english: 'step',
        description_ar: 'خطوة النطاق',
        description_en: 'Range step',
        category: 'control'
    },
    {
        arabic: 'اوقف',
        english: 'break',
        description_ar: 'إيقاف الحلقة',
        description_en: 'Break loop',
        category: 'control'
    },
    {
        arabic: 'تخطى',
        english: 'continue',
        description_ar: 'تخطي التكرار',
        description_en: 'Skip iteration',
        category: 'control'
    },

    // Declarations
    {
        arabic: 'متغير',
        english: 'var',
        description_ar: 'إعلان متغير',
        description_en: 'Variable declaration',
        category: 'declaration'
    },
    {
        arabic: 'دالة',
        english: 'function',
        description_ar: 'إعلان دالة',
        description_en: 'Function declaration',
        category: 'declaration'
    },
    {
        arabic: 'ارجع',
        english: 'return',
        description_ar: 'إرجاع قيمة',
        description_en: 'Return value',
        category: 'declaration'
    },

    // Types
    {
        arabic: 'رقم',
        english: 'number',
        description_ar: 'نوع رقمي صحيح',
        description_en: 'Integer type',
        category: 'type'
    },
    {
        arabic: 'عشري',
        english: 'float',
        description_ar: 'نوع رقمي عشري',
        description_en: 'Float type',
        category: 'type'
    },
    {
        arabic: 'نص',
        english: 'string',
        description_ar: 'نوع نصي',
        description_en: 'String type',
        category: 'type'
    },
    {
        arabic: 'منطقية',
        english: 'boolean',
        description_ar: 'نوع منطقي',
        description_en: 'Boolean type',
        category: 'type'
    },
    {
        arabic: 'قائمة',
        english: 'list',
        description_ar: 'نوع قائمة',
        description_en: 'List type',
        category: 'type'
    },
    {
        arabic: 'قاموس',
        english: 'dictionary',
        description_ar: 'نوع قاموس',
        description_en: 'Dictionary type',
        category: 'type'
    },

    // Built-ins
    {
        arabic: 'ادع',
        english: 'call',
        description_ar: 'استدعاء دالة',
        description_en: 'Function call',
        category: 'builtin'
    },
    {
        arabic: 'اكتب',
        english: 'print',
        description_ar: 'طباعة نص',
        description_en: 'Print text',
        category: 'builtin'
    },
    {
        arabic: 'اقرأ',
        english: 'read',
        description_ar: 'قراءة مدخل',
        description_en: 'Read input',
        category: 'builtin'
    },

    // Literals
    {
        arabic: 'صحيح',
        english: 'true',
        description_ar: 'قيمة منطقية صحيحة',
        description_en: 'Boolean true',
        category: 'literal'
    },
    {
        arabic: 'خطأ',
        english: 'false',
        description_ar: 'قيمة منطقية خاطئة',
        description_en: 'Boolean false',
        category: 'literal'
    }
];

export function getKeywordsByCategory(category: Keyword['category']): Keyword[] {
    return KEYWORDS.filter(k => k.category === category);
}

export function getLanguage(): 'ar' | 'en' {
    return 'ar'; // Default to Arabic, can be made configurable later
}
