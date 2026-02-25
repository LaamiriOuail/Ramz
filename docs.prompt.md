# Ramz Programming Language - Frontend Implementation Guide

## Overview

This document provides comprehensive information about the Ramz programming language syntax for frontend engineers implementing syntax highlighting, code editors, or other developer tools. Ramz is an Arabic programming language designed for teaching children programming, featuring a pure Arabic keyword set and Python-like syntax.

## Language Purpose

- **Target Audience**: Arabic-speaking children learning programming
- **Language Style**: Pure Arabic keywords, simple syntax, Python-like indentation
- **Key Features**: 
  - Easy-to-read Arabic keywords
  - Simple syntax patterns
  - Interactive REPL environment
  - Comprehensive error messages in Arabic

## Tokenization Rules

### Keywords (All Arabic)

The following Arabic keywords are reserved and cannot be used as identifiers:

| Keyword | Category | Usage |
|---------|----------|-------|
| `متغير` | Variables | Variable declaration |
| `رقم` | Types | Integer type |
| `عشري` | Types | Float type |
| `نص` | Types | String type |
| `منطقية` | Types | Boolean type |
| `قائمة` | Types | List type |
| `قاموس` | Types | Dictionary type |
| `زوج` | Types | Tuple type |
| `إذا` | Control Flow | If statement |
| `وإلا` | Control Flow | Else clause |
| `وإلا إذا` | Control Flow | Else if clause |
| `بينما` | Control Flow | While loop |
| `افعل` | Control Flow | Do-while start |
| `طالما` | Control Flow | Do-while condition |
| `لكل` | Control Flow | For loop |
| `في` | Control Flow | In (for loops) |
| `من` | Control Flow | From (range start) |
| `إلى` | Control Flow | To (range end) |
| `خطوة` | Control Flow | Step (range increment) |
| `اوقف` | Control Flow | Break statement |
| `تخطى` | Control Flow | Continue statement |
| `دالة` | Functions | Function definition |
| `ارجع` | Functions | Return statement |
| `ادع` | Functions | Function call |
| `اقرأ` | I/O | Read input |
| `اكتب` | I/O | Print output |

### Literal Values

- **Numbers**: `42`, `3.14`, `0`, `-5`
- **Strings**: `"مرحباً"`, `"Hello"`
- **Booleans**: `صحيح`, `خطأ`
- **Comments**: Starting with `#` (single-line)

### Identifiers

- Must start with Arabic letter or underscore
- Can contain Arabic letters, numbers, and underscores
- Cannot match reserved keywords
- Examples: `الاسم`, `عمر_الطالب`, `_مخفي`

### Operators

| Type | Operators | Examples |
|------|-----------|----------|
| Arithmetic | `+`, `-`, `*`, `/`, `%` | `+`, `-=` |
| Comparison | `==`, `!=`, `<`, `>`, `<=`, `>=` | `==`, `!=` |
| Logical | `و`, `أو`, `!` | `و`, `أو`, `!` |
| Assignment | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | `=`, `+=` |

### Punctuation

| Character | Usage | Example |
|-----------|-------|---------|
| `(` `)` | Function calls, expressions | `ادع دالة(أ, ب)` |
| `[` `]` | List access, slicing | `القائمة[0]` |
| `{` `}` | Block statements | `إذا الشرط: { ... }` |
| `,` | Parameter/argument separation | `ادع دالة(أ, ب, ج)` |
| `:` | Statement terminator | `إذا الشرط:` |
| `#` | Comment start | `# هذا تعليق` |

## Grammar and Syntax Patterns

### Variable Declaration

```ramz
# Simple declaration
متغير الاسم = "أحمد"

# With type annotation
متغير العمر: رقم = 15

# Multiple declarations
متغير x = 10, y = 20
```

### Statements

Each statement ends with a newline or block:

```ramz
# Simple statement
اكتب("مرحباً")

# Block statement
إذا العمر >= 18:
    اكتب("بالغ")
    اكتب("يمكنك التصويت")
```

### Expressions

```ramz
# Arithmetic
5 + 3 * 2
(10 - 5) / 2

# Comparison
العمر >= 18
الاسم == "أحمد"

# Logical
العمر >= 18 و له_رخصة
الطقس == "مشمس" أو لدي_مظلة
!متعب
```

### Control Flow

#### If Statements

```ramz
# Simple if
إذا الشرط:
    # code here

# If-else
إذا الشرط:
    # code here
وإلا:
    # alternative code

# If-else if-else
إذا الشرط1:
    # code here
وإلا إذا الشرط2:
    # code here
وإلا:
    # default code
```

#### Loops

```ramz
# While loop
بينما الشرط:
    # code here

# Do-while loop
افعل:
    # code here
طالما الشرط

# For loop with range
لكل i من 1 إلى 10:
    اكتب(i)

# For loop with step
لكل i من 1 إلى 10 خطوة 2:
    اكتب(i)

# For loop with list
لكل عنصر في القائمة:
    اكتب(عنصر)
```

#### Loop Control

```ramz
# Break
لكل i من 1 إلى 100:
    إذا i == 50:
        اوقف  # Exit loop
    اكتب(i)

# Continue
لكل i من 1 إلى 10:
    إذا i % 2 == 0:
        تخطي  # Skip this iteration
    اكتب(i)
```

### Functions

```ramz
# Simple function
دالة مرحب() {
    اكتب("مرحباً!")
}

# Function with parameters
دالة ترحيب(الاسم) {
    اكتب("مرحباً " + الاسم + "!")
}

# Function with return
دالة جمع(أ, ب) {
    ارجع أ + ب
}

# Function with type annotation
دالة عمر_بالغة(العمر: رقم): منطقية {
    ارجع العمر >= 18
}

# Function call
ادع مرحب("أحمد")
متغير نتيجة = ادع جمع(5, 3)
```

### Data Structures

```ramz
# Lists
مت الأسماء = ["أحمد", "محمد", "خالد"]
اكتب(الأسماء[0])  # أحمد
اكتب(الأسماء[-1])  # خالد

# Dictionaries
مت الشخص = {"الاسم": "أحمد", "العمر": 15}
اكتب(الشخص["الاسم"])

# Tuples
مت الإحداثيات = (10, 20)
اكتب(الإحداثيات[0])
```

### Input/Output

```ramz
# Output
اكتب("مرحباً بالعالم!")
اكتب("النتيجة: " + نتيجة)

# Input
متغير الاسم = اقرأ("ما اسمك؟ ")
متغير العمر = اقرأ("عمرك؟ ")

# Built-in functions with parameters
ادع اكتب("Hello")
ادع اقرأ("اسمك؟ ")
```

## Visual Design Guidelines

### Color Scheme for Syntax Highlighting

| Token Type | Recommended Color | Hex Code | Rationale |
|------------|-------------------|----------|-----------|
| Keywords | Blue (#007ACC) | High contrast, traditional for keywords |
| Strings | Green (#008000) | Easy to read text representation |
| Numbers/Booleans | Purple (#800080) | Distinguished from text |
| Operators | Red (#FF0000) | Important for understanding operations |
| Identifiers | Black/Dark Gray (#333333) | Natural text color |
| Comments | Gray (#696969) | Subtle, non-distracting |
| Punctuation | Blue (#0000CD) | Similar to keywords but lighter |
| Error Text | Red (#FF0000) | Attention-grabbing for errors |

### Font and Spacing

- **Font**: Use a monospaced font like:
  - Arabic: "Segoe UI", "Arial", "Tahoma"
  - Code: "Consolas", "Monaco", "Courier New"
- **Font Size**: 14-16px for comfortable reading
- **Line Height**: 1.5-1.6 for better readability
- **Indentation**: 4 spaces per level (no tabs)

### Visual Elements

1. **Indentation Guidelines**:
   - Show soft tabs with 4-space width
   - Use subtle guides if possible
   - Consistent indentation is crucial for Python-like syntax

2. **Matching Brackets**:
   - Highlight matching `{}` `()` `[]` pairs
   - Use different colors for opening/closing

3. **Current Line Highlight**:
   - Subtle background color for current line
   - Should not distract from syntax highlighting

## Implementation Considerations

### Text Editor Features to Implement

1. **Auto-indentation**: Follow Python-like 4-space indentation
2. **Smart indentation**: After `إذا`, `بينما`, `لكل`, `افعل`, `دالة`
3. **Bracket matching**: Visual indicators for `{}` `()` `[]`
4. **Code completion**: Suggest keywords and variables
5. **Error highlighting**: Real-time syntax validation
6. **Line numbers**: Essential for debugging

### Performance Considerations

- **Tokenization**: Should be fast for real-time highlighting
- **Memory usage**: Handle large files efficiently
- **Responsive**: Update highlighting as user types
- **Language server**: Consider implementing LSP for better IDE integration

### Accessibility Features

1. **High contrast mode**: Ensure all colors are accessible
2. **Screen reader support**: Proper ARIA labels for code elements
3. **Keyboard navigation**: Full keyboard support for editing
4. **Zoom support**: Maintain readability at different zoom levels

### Error Handling and Messages

- Display Arabic error messages as generated by the interpreter
- Show line numbers for errors
- Provide suggestions for common mistakes
- Highlight error locations in the code

## Example Implementation Structure

```javascript
// Token types
const tokenTypes = {
  KEYWORD: 'keyword',
  IDENTIFIER: 'identifier',
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OPERATOR: 'operator',
  PUNCTUATION: 'punctuation',
  COMMENT: 'comment',
  ERROR: 'error'
};

// Arabic keywords
const keywords = new Set([
  'متغير', 'رقم', 'عشري', 'نص', 'منطقية', 'قائمة', 'قاموس', 'زوج',
  'إذا', 'وإلا', 'وإلا إذا', 'بينما', 'افعل', 'طالما', 'لكل', 'في',
  'من', 'إلى', 'خطوة', 'اوقف', 'تخطى', 'دالة', 'ارجع', 'ادع', 'اقرأ', 'اكتب'
]);

// Syntax highlighting function
function highlightRamz(code) {
  const tokens = tokenize(code); // Implement tokenizer
  return tokens.map(token => {
    const className = `token-${token.type}`;
    const style = token.type === 'keyword' ? 'color: #007ACC' : 
                  token.type === 'string' ? 'color: #008000' :
                  token.type === 'number' ? 'color: #800080' :
                  token.type === 'operator' ? 'color: #FF0000' : '';
    return `<span class="${className}" style="${style}">${token.value}</span>`;
  }).join('');
}
```

## Testing and Validation

### Test Cases to Implement

1. **Basic Syntax**:
   ```ramz
   # Simple hello world
   اكتب("مرحباً!")
   ```

2. **Variable Declaration**:
   ```ramz
   متغير x = 10
   متغير النص: نص = "أحمد"
   ```

3. **Control Flow**:
   ```ramz
   إذا x > 5:
       اكتب("x أكبر من 5")
   وإلا:
       اكتب("x أقل من أو يساوي 5")
   ```

4. **Functions**:
   ```ramz
   دالة اختبار() {
       ارجع "نجاح!"
   }
   ```

5. **Loops**:
   ```ramz
   لكل i من 1 إلى 5:
       اكتب(i)
   ```

### Edge Cases to Consider

- Arabic text mixing with code
- Comments with code snippets
- Multi-line strings
- Nested structures
- Error recovery for invalid syntax

## Integration Points

### IDE Integration

- VSCode extension support
- Web editor components
- Mobile app integration
- Online playground environment

### Language Services

- LSP (Language Server Protocol) implementation
- IntelliSense for code completion
- Real-time error checking
- Refactoring support

### Documentation Integration

- Hover tooltips for keywords
- Inline documentation
- Quick reference guide
- Tutorial integration

## Conclusion

The Ramz programming language combines Arabic keywords with a simple, Python-like syntax that makes programming accessible to Arabic-speaking children. Frontend implementations should prioritize readability, cultural appropriateness, and educational value while maintaining technical accuracy.

The syntax highlighting and editor features should be designed to support learning and make the programming experience as smooth and intuitive as possible for young Arabic-speaking programmers.