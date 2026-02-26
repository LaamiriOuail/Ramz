# Ramz Language Support (دعم لغة رمز) for Visual Studio Code

![Ramz VSCode Extension](icons/ramz-preview.png)

**دعم كامل للغة برمجة رمز - Full support for Ramz programming language in Visual Studio Code.**

---

## Features (المميزات)

### ✅ Syntax Highlighting (تلوين الكود)
- **24 Arabic Keywords** (24 كلمة عربية) highlighted with appropriate colors
- **Operators** (المعاملات): Arithmetic, comparison, logical, and assignment
- **Strings** (النصوص), **Numbers** (الأرقام), and **Booleans** (القيم المنطقية)
- **Comments** (التعليقات) properly styled
- **RTL Support** (دعم اليمين-ل-يسار) for Arabic text

### ✅ Auto-Completion (إكمال تلقائي)
- **24 Keywords** with Arabic and English descriptions
- **Context-aware suggestions** (اقتراحات ذكية حسب السياق)
- **Bilingual documentation** (وثائق ثنائية اللغة)
- **Trigger characters**: `:`, `(`, `{`, and Space

### ✅ Code Snippets (مقاطع الكود)
- **15+ Common Patterns** (أنماط شائعة):
  - Variable declarations
  - If/else statements
  - Loops (while, for-range, for-each, do-while)
  - Function declarations
  - Function calls
  - I/O operations
- **Easy insertion** with tab stops and placeholders

### ✅ Hover Documentation (المعلومات عند التمرير)
- **Keyword explanations** (شرح الكلمات الرئيسية) in Arabic and English
- **Code examples** (أمثلة الكود) for each keyword
- **Type hints** (تلميحات الأنواع) where applicable

### ✅ File Extensions (امتدادات الملفات)
- **Primary**: `.ramz`
- **Secondary**: `.رمز` (Arabic script extension)

---

## Installation (التثبيت)

### Method 1: VSCode Marketplace (مستودي VSCode)

1. Open **Extensions** (الإضافات) in VSCode (`Ctrl+Shift+X`)
2. Search for: **"Ramz Language"** or **"رمز"**
3. Click **Install** (تثبيت)

### Method 2: Manual Installation (التثبيت اليدوي)

1. Download the latest `.vsix` file from [Releases](../../releases)
2. Open VSCode
3. Go to **Extensions** → **...** (three dots) → **Install from VSIX...**
4. Select the downloaded `.vsix` file

---

## Usage (الاستخدام)

### Opening Ramz Files

Open any file with `.ramz` or `.رمز` extension:
```
مثال: hello.ramz
```

The extension will automatically activate and provide:
- Syntax highlighting (تلوين الكود)
- Auto-completion (إكمال تلقائي)
- Hover documentation (معلومات عند التمرير)
- Code snippets (مقاطع الكود)

---

## Settings (الإعدادات)

Open VSCode Settings (`Ctrl+,`) and search for **"Ramz"**:

| Setting (الإعداد) | Description (الوصف) | Default (الافتراضي) |
|-------------------|-------------------|---------------------|
| `ramz.interpreterPath` | Path to Ramz interpreter (مسار مفسر رمز) | `ramz` |
| `ramz.enableDiagnostics` | Enable real-time error checking (تفعيل فحص الأخطاء) | `true` |
| `ramz.language` | Interface language (لغة الواجهة) | `ar` |

---

## Keyboard Shortcuts (اختصارات لوحة المفاتيح)

### Auto-Completion Triggers (إكمال تلقائي)
- `:` - Show type suggestions
- `(` - Show parameter suggestions
- `{` - Show block suggestions
- `Ctrl+Space` - Trigger completion anytime

### Commands (الأوامر)

- `Ctrl+Shift+P` → **"Ramz: Run Program"** - Run current Ramz file
- `Ctrl+Shift+P` → **"Ramz: Check for Errors"** - Check for syntax errors

---

## Examples (أمثلة)

### Hello World (مرحباً بالعالم)

```ramz
# برنامج مرحبا بالعالم
اكتب("مرحباً بالعالم!")
```

### Variable Declaration (إعلان متغير)

```ramz
# إعلان متغيرات
متغير الاسم = "أحمد"
متغير العمر: رقم = 25
متغير الدرجات = [90, 85, 92]
```

### If Statement (جملة شرطية)

```ramz
إذا العمر >= 18:
    اكتب("أنت بالغ")
وإلا:
    اكتب("أنت قاصر")
```

### For Loop (حلقة تكرار)

```ramz
لكل i من 1 إلى 10:
    اكتب("الرقم: " + i)
```

### Function Definition (تعريف دالة)

```ramz
دالة جمع(أ, ب) {
    ارجع أ + ب
}

ادع جمع(5, 3)  # الناتج: 8
```

### Complete Program (برنامج كامل)

```ramz
# برنامج حساب مجموع الأرقام
دالة حساب_المجموع() {
    متغير مجموع = 0
    لكل رقم في الأرقام:
        مجموع = مجموع + رقم
    ارجع مجموع
}

متغير الأرقام = [10, 20, 30, 40, 50]
متغير النتيجة = حساب_المجموع()
اكتب("المجموع هو: " + النتيجة)
```

---

## Contributing (المساهمة)

Contributions are welcome! (المساهمات مرحب بها!)

### Development (التطوير)

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

### Reporting Issues (الإبلاغ عن المشاكل)

Found a bug? (وجدت خطأ؟)

1. Go to [Issues](../../issues)
2. Search for existing issues
3. Create a new issue if needed
4. Provide:
   - Steps to reproduce (خطوات إعادة الإنتاج)
   - Expected behavior (السلوك المتوقع)
   - Actual behavior (السلوك الفعلي)
   - Screenshots (لقطة شاشة)

---

## Changelog (سجل التغييرات)

### Version 0.1.0
- ✅ Initial release (الإصدار الأولي)
- ✅ Syntax highlighting for 24 keywords
- ✅ Auto-completion with Arabic/English descriptions
- ✅ 15+ code snippets
- ✅ Hover documentation
- ✅ RTL support
- ✅ Dual file extensions (`.ramz` and `.رمز`)

---

## License (الرخصة)

[MIT License](../../blob/main/LICENSE)

---

## Credits (الائتمان)

- **Ramz Language** by [Laamiri Ouail](../../)
- **VSCode Extension** - [Full Team](../../)

---

## Links (روابط)

- [Ramz Language Repository](../../)
- [Ramz Documentation](../../docs/)
- [VSCode Marketplace](https://marketplace.visualstudio.com/) (when published)
- [Report Issues](../../issues)

---

**Made with ❤️ for Arabic programming community** | **صُنع بحب للمجتمع البرمجة العربي**
