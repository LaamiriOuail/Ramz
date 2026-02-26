# Ramz Language Icons

## Icon Design (تصميم الأيقونات)

This directory contains the language icons for VSCode.

### Current Status (الحالة الحالية)
Icons need to be created. Two versions are required:

1. **ramz-light.png** - For light theme (للمظهر الفاتح)
   - Size: 128x128 pixels
   - Format: PNG with transparency
   - Background: Dark color (e.g., #2D3748)
   - Foreground: Light color (e.g., #E2E8F0)

2. **ramz-dark.png** - For dark theme (للمظهر المظلم)
   - Size: 128x128 pixels  
   - Format: PNG with transparency
   - Background: Light color (e.g., #E2E8F0)
   - Foreground: Dark color (e.g., #2D3748)

### Design Concepts (مفاهيم التصميم)

**Option 1: Stylized "ر" (Arabic Ra)**
- First letter of "رمز" (Ramz)
- Simple, recognizable at small sizes
- Use Arabic calligraphy style

**Option 2: Combined Logo**
- Latin "R" + Arabic "ر"
- Modern, clean design
- Works well at 16x16 and 128x128

**Option 3: Code Brackets**
- `{ }` or `[ ]` brackets
- "رمز" text inside or next to brackets
- Represents code blocks

### Quick Creation Tools (أدوات الإنشاء السريع)

**Online Tools:**
- [Canva](https://www.canva.com/) - Free templates
- [Figma](https://www.figma.com/) - Professional design
- [Adobe Express](https://www.adobe.com/express/) - Easy to use

**Desktop Tools:**
- [Inkscape](https://inkscape.org/) - Free vector editor
- [GIMP](https://www.gimp.org/) - Free image editor
- [Paint.NET](https://www.getpaint.net/) - Windows

### Temporary Solution (حل مؤقت)

Until custom icons are created, you can:

1. Use generic VSCode language icon
2. Copy icons from another language extension
3. Use online icon generators:
   - [Favicon.io](https://favicon.io/)
   - [Icon Kitchen](https://icon.kitchen/)

### Icon Guidelines (إرشادات الأيقونات)

- **Keep it simple** (اجعلها بسيطة) - Complex designs are hard to read at 16x16
- **High contrast** (تباين عالي) - Ensure visibility on all backgrounds
- **Unique shape** (شكل فريد) - Different from standard code icons
- **Scalable** (قابل للتوسيع) - Should look good at multiple sizes
- **Transparent background** (خلفية شفافة) - PNG with alpha channel

---

## Once Icons Are Created (عند إنشاء الأيقونات)

1. Place `ramz-light.png` in this directory
2. Place `ramz-dark.png` in this directory
3. Test in VSCode by opening a `.ramz` file
4. The icons should appear in the file explorer and tabs

**Ready for use!** ✅