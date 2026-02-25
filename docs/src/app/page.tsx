'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  BookOpen, 
  Code, 
  Lightbulb, 
  Rocket, 
  Sparkles, 
  Star, 
  Zap,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Heart,
  GraduationCap,
  Puzzle,
  Terminal,
  FileCode,
  MessageCircle,
  Menu,
  X,
  Moon,
  Sun,
  Github,
  Linkedin
} from 'lucide-react'

// VS Code-style syntax highlighting component for Ramz code
function CodeBlock({ code, title, language = 'ramz' }: { code: string; title?: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const highlightLine = (line: string): string => {
    // Define token types with their VS Code colors
    const controlKeywords = ['إذا', 'وإلا', 'وإلا إذا', 'بينما', 'افعل', 'طالما', 'لكل', 'في', 'من', 'إلى', 'خطوة', 'اوقف', 'تخطى']
    const typeKeywords = ['رقم', 'عشري', 'نص', 'منطقية', 'قائمة', 'قاموس', 'زوج']
    const declarationKeywords = ['متغير', 'دالة']
    const returnKeywords = ['ارجع']
    const callKeywords = ['ادع']
    const builtinFunctions = ['اكتب', 'اقرأ']
    const booleans = ['صحيح', 'خطأ']
    
    // Use unique placeholder tokens that won't appear in code
    const PH_PREFIX = '\x00PH_'
    const PH_SUFFIX = '_PH\x00'
    const placeholders: string[] = []
    
    const savePlaceholder = (html: string): string => {
      const index = placeholders.length
      placeholders.push(html)
      return `${PH_PREFIX}${index}${PH_SUFFIX}`
    }
    
    let result = line
    
    // 1. Highlight strings FIRST
    result = result.replace(/"([^"]*)"/g, (_, content) => {
      const escaped = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return savePlaceholder(`<span class="token-string">"${escaped}"</span>`)
    })
    
    // 2. Highlight comments
    result = result.replace(/#(.*)$/g, (_, content) => {
      const escaped = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return savePlaceholder(`<span class="token-comment">#${escaped}</span>`)
    })
    
    // 3. Highlight multi-character operators (before HTML escaping)
    result = result.replace(/&&/g, () => savePlaceholder('<span class="token-operator">&amp;&amp;</span>'))
    result = result.replace(/\|\|/g, () => savePlaceholder('<span class="token-operator">||</span>'))
    result = result.replace(/>=/g, () => savePlaceholder('<span class="token-operator">&gt;=</span>'))
    result = result.replace(/<=/g, () => savePlaceholder('<span class="token-operator">&lt;=</span>'))
    result = result.replace(/==/g, () => savePlaceholder('<span class="token-operator">==</span>'))
    result = result.replace(/!=/g, () => savePlaceholder('<span class="token-operator">!=</span>'))
    
    // 4. Escape remaining HTML
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    // 5. Highlight keywords (using word boundaries for Arabic)
    const highlightKeyword = (keywords: string[], className: string) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`(?<![\\w\u0600-\u06FF])${keyword}(?![\\w\u0600-\u06FF])`, 'g')
        result = result.replace(regex, () => savePlaceholder(`<span class="${className}">${keyword}</span>`))
      })
    }
    
    highlightKeyword(controlKeywords, 'token-control')
    highlightKeyword(typeKeywords, 'token-type')
    highlightKeyword(declarationKeywords, 'token-declaration')
    highlightKeyword(returnKeywords, 'token-return')
    highlightKeyword(callKeywords, 'token-builtin')
    highlightKeyword(builtinFunctions, 'token-builtin')
    highlightKeyword(booleans, 'token-boolean')
    
    // 6. Highlight numbers
    result = result.replace(/\b(\d+\.?\d*)\b/g, (_, num) => 
      savePlaceholder(`<span class="token-number">${num}</span>`)
    )
    
    // 7. Highlight single-character operators
    result = result.replace(/([+\-*/%=!&|^~])/g, (_, op) => 
      savePlaceholder(`<span class="token-operator">${op}</span>`)
    )
    
    // 8. Highlight comparison operators (after escaping)
    result = result.replace(/(&gt;|&lt;)/g, (_, op) => 
      savePlaceholder(`<span class="token-operator">${op}</span>`)
    )
    
    // 9. Highlight punctuation
    result = result.replace(/([(){}\[\],;:])/g, (_, punct) => 
      savePlaceholder(`<span class="token-punctuation">${punct}</span>`)
    )
    
    // 10. Restore all placeholders
    placeholders.forEach((html, index) => {
      result = result.replace(`${PH_PREFIX}${index}${PH_SUFFIX}`, html)
    })
    
    return result || '&nbsp;'
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className="code-wrapper">
      <div className="code-editor">
        {/* Header */}
        <div className="code-editor-header">
          <div className="code-editor-tab">
            <FileCode className="w-4 h-4 text-yellow-500" />
            <span>{title || 'code.ramz'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="code-lang-badge">{language}</span>
            <button 
              onClick={copyCode}
              className="code-copy-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Code content with line numbers */}
        <div className="code-content">
          {/* Line numbers column */}
          <div className="line-numbers">
            {lines.map((_, i) => (
              <div key={i} className="line-num">{i + 1}</div>
            ))}
          </div>
          
          {/* Code lines */}
          <div className="code-lines">
            {lines.map((line, i) => (
              <div key={i} className="code-line">
                <span dangerouslySetInnerHTML={{ __html: highlightLine(line) }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Navigation section component
function NavSection({ 
  id, 
  icon: Icon, 
  title, 
  children 
}: { 
  id: string
  icon: React.ElementType
  title: string
  children: React.ReactNode 
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

// Keyword card component
function KeywordCard({ keyword, category, description, example }: { 
  keyword: string
  category: string
  description: string
  example?: string
}) {
  const categoryColors: Record<string, string> = {
    'المتغيرات': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    'الأنواع': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    'التحكم': 'from-green-500/20 to-green-600/20 border-green-500/30',
    'الدوال': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    'الإدخال/الإخراج': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  }

  return (
    <Card className={`card-hover bg-gradient-to-br ${categoryColors[category] || 'from-muted/50 to-muted/30'} border-2`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{keyword}</CardTitle>
          <Badge variant="secondary" className="text-xs">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{description}</p>
        {example && (
          <div className="bg-background/50 rounded-lg p-2 text-sm font-mono text-primary">
            {example}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Feature card for landing
function FeatureCard({ icon: Icon, title, description, color }: { 
  icon: React.ElementType
  title: string
  description: string
  color: string
}) {
  return (
    <Card className="card-hover bg-gradient-to-br from-card to-muted/30 border-2 group">
      <CardContent className="pt-6">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Sparkles },
    { id: 'intro', label: 'مقدمة', icon: Rocket },
    { id: 'getting-started', label: 'ابدأ الآن', icon: GraduationCap },
    { id: 'keywords', label: 'الكلمات المفتاحية', icon: BookOpen },
    { id: 'variables', label: 'المتغيرات', icon: Puzzle },
    { id: 'control-flow', label: 'التحكم', icon: Zap },
    { id: 'functions', label: 'الدوال', icon: Code },
    { id: 'data-structures', label: 'هياكل البيانات', icon: Terminal },
    { id: 'examples', label: 'أمثلة', icon: FileCode },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                  رمـز
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">لغة برمجة عربية للأطفال</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActiveSection(item.id)
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm"
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setActiveSection(item.id)
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                      setMobileMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <item.icon className="h-4 w-4 ml-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden py-16 md:py-24">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo animation */}
              <div className="inline-flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="text-8xl md:text-9xl font-bold bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse-soft">
                    رمـز
                  </div>
                  <div className="absolute -top-4 -right-4">
                    <Star className="h-8 w-8 text-yellow-500 animate-bounce-gentle" />
                  </div>
                  <div className="absolute -bottom-2 -left-4">
                    <Sparkles className="h-6 w-6 text-accent animate-wiggle" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                لغة برمجة عربية سهلة وممتعة للأطفال
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                تعلم البرمجة بلغتك الأم! رمز هي لغة برمجة مصممة خصيصاً للأطفال العرب 
                لتعلم مفاهيم البرمجة بطريقة سهلة وممتعة.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button size="lg" className="btn-fun text-lg px-8 py-6 rounded-2xl" asChild>
                  <a href="#getting-started">
                    <Rocket className="ml-2 h-5 w-5" />
                    ابدأ التعلم الآن
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-2" asChild>
                  <a href="#examples">
                    <FileCode className="ml-2 h-5 w-5" />
                    شاهد الأمثلة
                  </a>
                </Button>
              </div>

              {/* Quick code preview */}
              <div className="max-w-xl mx-auto">
                <CodeBlock 
                  code={`# أول برنامج لك في رمز!
اكتب("مرحباً بالعالم!")

# متغير بسيط
متغير اسمك = "أحمد"
اكتب("أهلاً " + اسمك + "!")`}
                  title="أول برنامج لك"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <Heart className="inline-block h-8 w-8 text-red-500 ml-2 animate-pulse" />
              لماذا رمز؟
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={MessageCircle}
                title="لغة عربية خالصة"
                description="كل الكلمات المفتاحية بالعربية! لا حاجة لتعلم الإنجليزية أولاً"
                color="from-purple-500 to-purple-600"
              />
              <FeatureCard 
                icon={Lightbulb}
                title="سهلة التعلم"
                description="صممت خصيصاً للأطفال مع أمثلة بسيطة وتفاعلية"
                color="from-yellow-500 to-orange-500"
              />
              <FeatureCard 
                icon={Sparkles}
                title="ممتعة وتفاعلية"
                description="نتائج فورية وأمثلة ممتعة تجعل التعلم ممتعاً"
                color="from-pink-500 to-rose-500"
              />
              <FeatureCard 
                icon={GraduationCap}
                title="مفاهيم أساسية"
                description="تعلم أساسيات البرمجة التي ستنفعك في أي لغة أخرى"
                color="from-green-500 to-teal-500"
              />
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-20">
            
            {/* Introduction Section */}
            <NavSection id="intro" icon={Rocket} title="ما هي رمز؟">
              <Card className="bg-gradient-to-br from-card to-muted/30 border-2">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed mb-6">
                    <strong>رمز</strong> هي لغة برمجة عربية مصممة خصيصاً لتعليم الأطفال العرب مفاهيم البرمجة. 
                    تتميز بالآتي:
                  </p>
                  <ul className="space-y-4">
                    {[
                      { icon: '🎯', text: 'كلمات مفتاحية عربية سهلة الحفظ والفهم' },
                      { icon: '📝', text: 'صياغة بسيطة تشبه بايثون' },
                      { icon: '🎨', text: 'رسائل خطأ واضحة بالعربية' },
                      { icon: '🎮', text: 'بيئة تفاعلية للتجربة والتعلم' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg">
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </NavSection>

            {/* Getting Started Section */}
            <NavSection id="getting-started" icon={GraduationCap} title="ابدأ الآن">
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🚀</span>
                      الخطوة 1: برنامجك الأول
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">لنكتب أول برنامج لك! هذا البرنامج سيطبع رسالة ترحيب:</p>
                    <CodeBlock 
                      code={`# هذا برنامج ترحيب بسيط
اكتب("مرحباً بالعالم!")`}
                      title="أول برنامج"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">📝</span>
                      الخطوة 2: المتغيرات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">المتغيرات هي صناديق لحفظ المعلومات:</p>
                    <CodeBlock 
                      code={`# إنشاء متغير لحفظ الاسم
متغير اسمي = "محمد"
متغير عمري = 10

# طباعة المتغيرات
اكتب("اسمي هو: " + اسمي)
اكتب("وعمري: " + عمري)`}
                      title="المتغيرات"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🔢</span>
                      الخطوة 3: العمليات الحسابية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">يمكنك إجراء عمليات حسابية بسهولة:</p>
                    <CodeBlock 
                      code={`# عمليات حسابية بسيطة
متغير أ = 10
متغير ب = 5

اكتب("الجمع: " + (أ + ب))      # 15
اكتب("الطرح: " + (أ - ب))      # 5
اكتب("الضرب: " + (أ * ب))      # 50
اكتب("القسمة: " + (أ / ب))     # 2`}
                      title="العمليات الحسابية"
                    />
                  </CardContent>
                </Card>
              </div>
            </NavSection>

            {/* Keywords Section */}
            <NavSection id="keywords" icon={BookOpen} title="الكلمات المفتاحية">
              <p className="text-lg text-muted-foreground mb-8">
                هذه هي الكلمات الخاصة التي تستخدمها في كتابة برامج رمز. كل كلمة لها استخدام محدد!
              </p>
              
              <Tabs defaultValue="variables" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2">
                  <TabsTrigger value="variables" className="text-sm md:text-base">المتغيرات</TabsTrigger>
                  <TabsTrigger value="types" className="text-sm md:text-base">الأنواع</TabsTrigger>
                  <TabsTrigger value="control" className="text-sm md:text-base">التحكم</TabsTrigger>
                  <TabsTrigger value="functions" className="text-sm md:text-base">الدوال</TabsTrigger>
                  <TabsTrigger value="io" className="text-sm md:text-base">الإدخال/الإخراج</TabsTrigger>
                </TabsList>

                <TabsContent value="variables" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <KeywordCard 
                      keyword="متغير"
                      category="المتغيرات"
                      description="لإنشاء متغير جديد لحفظ البيانات"
                      example='متغير الاسم = "أحمد"'
                    />
                  </div>
                </TabsContent>

                <TabsContent value="types" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <KeywordCard keyword="رقم" category="الأنواع" description="نوع للأرقام الصحيحة مثل: 1، 2، 100" example="متغير العمر: رقم = 10" />
                    <KeywordCard keyword="عشري" category="الأنواع" description="نوع للأرقام العشرية مثل: 3.14" example="متغير السعر: عشري = 9.99" />
                    <KeywordCard keyword="نص" category="الأنواع" description="نوع للنصوص والكلمات" example='متغير الاسم: نص = "علي"' />
                    <KeywordCard keyword="منطقية" category="الأنواع" description="نوع للقيم المنطقية (صحيح/خطأ)" example="متغير نشط: منطقية = صحيح" />
                    <KeywordCard keyword="قائمة" category="الأنواع" description="قائمة من العناصر" example='متغير أرقام: قائمة = [1, 2, 3]' />
                    <KeywordCard keyword="قاموس" category="الأنواع" description="مجموعة من الأزواج (مفتاح وقيمة)" example='متغير شخص: قاموس = {"الاسم": "أحمد"}' />
                  </div>
                </TabsContent>

                <TabsContent value="control" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <KeywordCard keyword="إذا" category="التحكم" description="للتحقق من شرط معين" example="إذا العمر >= 18: اكتب('بالغ')" />
                    <KeywordCard keyword="وإلا" category="التحكم" description="إذا لم يتحقق الشرط" example="وإلا: اكتب('قاصر')" />
                    <KeywordCard keyword="وإلا إذا" category="التحكم" description="شرط آخر إذا لم يتحقق الأول" example="وإلا إذا العمر >= 13:" />
                    <KeywordCard keyword="بينما" category="التحكم" description="تكرار طالما الشرط صحيح" example="بينما العداد < 10:" />
                    <KeywordCard keyword="لكل" category="التحكم" description="للتكرار على عناصر قائمة" example="لكل عنصر في القائمة:" />
                    <KeywordCard keyword="من" category="التحكم" description="بداية نطاق التكرار" example="لكل i من 1 إلى 10:" />
                    <KeywordCard keyword="إلى" category="التحكم" description="نهاية نطاق التكرار" example="لكل i من 1 إلى 10:" />
                    <KeywordCard keyword="اوقف" category="التحكم" description="للخروج من حلقة التكرار" example="اوقف" />
                    <KeywordCard keyword="تخطى" category="التحكم" description="لتخطي الدورة الحالية" example="تخطى" />
                  </div>
                </TabsContent>

                <TabsContent value="functions" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <KeywordCard keyword="دالة" category="الدوال" description="لإنشاء دالة جديدة" example="دالة ترحيب(الاسم) { ... }" />
                    <KeywordCard keyword="ارجع" category="الدوال" description="لإرجاع قيمة من الدالة" example="ارجع أ + ب" />
                    <KeywordCard keyword="ادع" category="الدوال" description="لاستدعاء دالة" example="ادع ترحيب('أحمد')" />
                  </div>
                </TabsContent>

                <TabsContent value="io" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <KeywordCard keyword="اكتب" category="الإدخال/الإخراج" description="لطباعة نص على الشاشة" example='اكتب("مرحباً!")' />
                    <KeywordCard keyword="اقرأ" category="الإدخال/الإخراج" description="لقراءة إدخال من المستخدم" example='متغير الاسم = اقرأ("اسمك؟")' />
                  </div>
                </TabsContent>
              </Tabs>
            </NavSection>

            {/* Variables Section */}
            <NavSection id="variables" icon={Puzzle} title="المتغيرات">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-muted/30 border-2">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4">📌 ما هي المتغيرات؟</h3>
                    <p className="text-lg leading-relaxed mb-4">
                      المتغيرات مثل الصناديق التي تحفظ فيها الأشياء! كل صندوق له اسم ونوع معين من الأشياء التي يمكن حفظها فيه.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-muted-foreground">
                        💡 <strong>تخيل:</strong> المتغير مثل علبة عليها ملصق "ألعاب"، يمكنك وضع أي لعبة بداخلها!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <CodeBlock 
                  code={`# متغيرات بدون تحديد النوع
متغير الاسم = "سارة"
متغير العمر = 12
متغير الطول = 1.45

# متغيرات مع تحديد النوع
متغير النقاط: رقم = 100
متغير النشط: منطقية = صحيح

# طباعة المتغيرات
اكتب("الاسم: " + الاسم)
اكتب("العمر: " + العمر)`}
                  title="أمثلة على المتغيرات"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">✅ صحيح</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm font-mono bg-background/50 rounded-lg p-2">
                        متغير اسم_الطالب = "أحمد"<br/>
                        متغير العمر = 10
                      </pre>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">❌ خطأ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm font-mono bg-background/50 rounded-lg p-2">
                        متغير 123اسم = "أحمد"  # يبدأ برقم<br/>
                        متغير متغير = 10       # كلمة محجوزة
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </NavSection>

            {/* Control Flow Section */}
            <NavSection id="control-flow" icon={Zap} title="التحكم والشروط">
              <div className="space-y-8">
                {/* Comparison Operators */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">⚖️</span>
                      عوامل المقارنة
                    </CardTitle>
                    <CardDescription>تدعم لغة رمز جميع عوامل المقارنة الأساسية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right p-3 font-bold">العامل</th>
                            <th className="text-right p-3 font-bold">الاسم</th>
                            <th className="text-right p-3 font-bold">المثال</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">==</td><td className="p-3">يساوي</td><td className="p-3 font-mono">العمر == 18</td></tr>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">!=</td><td className="p-3">لا يساوي</td><td className="p-3 font-mono">الاسم != "علي"</td></tr>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">&gt;</td><td className="p-3">أكبر من</td><td className="p-3 font-mono">الدرجة &gt; 80</td></tr>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">&lt;</td><td className="p-3">أصغر من</td><td className="p-3 font-mono">العدد &lt; 100</td></tr>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">&gt;=</td><td className="p-3">أكبر أو يساوي</td><td className="p-3 font-mono">العمر &gt;= 18</td></tr>
                          <tr><td className="p-3 font-mono text-primary">&lt;=</td><td className="p-3">أصغر أو يساوي</td><td className="p-3 font-mono">الدرجة &lt;= 100</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <CodeBlock 
                      code={`# مقارنة الأرقام
متغير x = 10
متغير y = 20

إذا x < y:
    اكتب("x أصغر من y")

إذا x != y:
    اكتب("x لا يساوي y")

# مقارنة النصوص
متغير اسم = "أحمد"
إذا اسم == "أحمد":
    اكتب("مرحباً أحمد!")`}
                      title="أمثلة على المقارنات"
                    />
                  </CardContent>
                </Card>

                {/* Logical Operators */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🔗</span>
                      العوامل المنطقية
                    </CardTitle>
                    <CardDescription>لدمج شروط متعددة معاً</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right p-3 font-bold">العامل</th>
                            <th className="text-right p-3 font-bold">الاسم</th>
                            <th className="text-right p-3 font-bold">المعنى</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">&&</td><td className="p-3">و (AND)</td><td className="p-3">صحيح إذا كان كلا الشرطين صحيحين</td></tr>
                          <tr className="border-b"><td className="p-3 font-mono text-primary">||</td><td className="p-3">أو (OR)</td><td className="p-3">صحيح إذا كان أي شرط صحيح</td></tr>
                          <tr><td className="p-3 font-mono text-primary">!</td><td className="p-3">ليس (NOT)</td><td className="p-3">عكس القيمة المنطقية</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <CodeBlock 
                      code={`# استخدام AND (&&)
متغير العمر = 20
متغير له_رخصة = صحيح

إذا العمر >= 18 && له_رخصة:
    اكتب("يمكنك قيادة السيارة!")

# استخدام OR (||)
متغير الطقس = "مشمس"

إذا الطقس == "مشمس" || الطقس == "غائم جزئيا":
    اكتب("وقت مثالي للخروج!")

# استخدام NOT (!)
متغير متعب = صحيح
إذا !متعب:
    اكتب("أنت لست متعباً!")`}
                      title="العوامل المنطقية"
                    />
                  </CardContent>
                </Card>

                {/* If Statement */}
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🔀</span>
                      الجمل الشرطية
                    </CardTitle>
                    <CardDescription>اتخاذ قرارات بناءً على شروط معينة</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold mb-2">إذا - شرط بسيط:</p>
                        <CodeBlock 
                          code={`متغير العمر = 20

إذا العمر >= 18:
    اكتب("أنت بالغ")`}
                          title="إذا"
                        />
                      </div>
                      <div>
                        <p className="font-bold mb-2">إذا-وإلا - شرط بديل:</p>
                        <CodeBlock 
                          code={`متغير العمر = 15

إذا العمر >= 18:
    اكتب("أنت بالغ")
وإلا:
    اكتب("ما زلت طفلاً")`}
                          title="إذا-وإلا"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold mb-2">إذا-وإلا إذا-وإلا - شروط متعددة:</p>
                      <CodeBlock 
                        code={`متغير الدرجة = 85

إذا الدرجة >= 90:
    اكتب("ممتاز! 🌟")
وإلا إذا الدرجة >= 80:
    اكتب("جيد جداً! 👍")
وإلا إذا الدرجة >= 70:
    اكتب("جيد! 👌")
وإلا إذا الدرجة >= 60:
    اكتب("مقبول! 📝")
وإلا:
    اكتب("راسب! ❌")`}
                        title="شروط متعددة"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Loops Section */}
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-2 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🔄</span>
                      حلقات التكرار
                    </CardTitle>
                    <CardDescription>تكرار الكود عدة مرات</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="while" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 gap-2 h-auto p-2">
                        <TabsTrigger value="while">بينما</TabsTrigger>
                        <TabsTrigger value="for">لكل</TabsTrigger>
                        <TabsTrigger value="control">تحكم</TabsTrigger>
                      </TabsList>

                      <TabsContent value="while" className="mt-4">
                        <p className="mb-2 text-muted-foreground">تكرار طالما الشرط صحيح:</p>
                        <CodeBlock 
                          code={`# عد من 1 إلى 5
متغير عداد = 1

بينما عداد <= 5:
    اكتب("العدد: " + عداد)
    عداد = عداد + 1

اكتب("انتهى العد!")`}
                          title="حلقة بينما"
                        />
                      </TabsContent>

                      <TabsContent value="for" className="mt-4">
                        <p className="mb-2 text-muted-foreground">تكرار محدد بعدد معين:</p>
                        <CodeBlock 
                          code={`# عد من 1 إلى 10
لكل i من 1 إلى 10:
    اكتب(i)

# عد بخطوة 2
لكل i من 1 إلى 10 خطوة 2:
    اكتب(i)  # 1, 3, 5, 7, 9

# التكرار على قائمة
متغير الفواكه = ["تفاح", "موز", "برتقال"]
لكل فاكهة في الفواكه:
    اكتب("أحب " + فاكهة)`}
                          title="حلقة لكل"
                        />
                      </TabsContent>

                      <TabsContent value="control" className="mt-4">
                        <p className="mb-2 text-muted-foreground">التحكم في الحلقات:</p>
                        <div className="space-y-4">
                          <CodeBlock 
                            code={`# اوقف - للخروج من الحلقة
لكل i من 1 إلى 100:
    إذا i == 50:
        اوقف  # أوقف عند 50
    اكتب(i)`}
                            title="اوقف"
                          />
                          <CodeBlock 
                            code={`# تخطى - لتخطي الدورة
لكل i من 1 إلى 10:
    إذا i % 2 == 0:
        تخطى  # تخطي الزوجية
    اكتب(i)  # 1, 3, 5, 7, 9`}
                            title="تخطى"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Advanced Examples */}
                <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-2 border-pink-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🚀</span>
                      أمثلة متقدمة
                    </CardTitle>
                    <CardDescription>تطبيقات عملية للشروط</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 gap-2 h-auto p-2">
                        <TabsTrigger value="login">تسجيل دخول</TabsTrigger>
                        <TabsTrigger value="calculator">آلة حاسبة</TabsTrigger>
                        <TabsTrigger value="grade">التقدير</TabsTrigger>
                      </TabsList>

                      <TabsContent value="login" className="mt-4">
                        <CodeBlock 
                          code={`# نظام تسجيل دخول
اكتب("=== تسجيل الدخول ===")

متغير الاسم = اقرأ("اسم المستخدم: ")
متغير كلمة_المرور = اقرأ("كلمة المرور: ")

إذا الاسم == "admin" && كلمة_المرور == "123456":
    اكتب("✅ تسجيل ناجح!")
    اكتب("مرحباً " + الاسم + "!")
وإلا:
    اكتب("❌ بيانات خاطئة!")`}
                          title="نظام تسجيل دخول"
                        />
                      </TabsContent>

                      <TabsContent value="calculator" className="mt-4">
                        <CodeBlock 
                          code={`# آلة حاسبة ذكية
متغير الرقم1 = اقرأ("الرقم الأول: ")
متغير الرقم2 = اقرأ("الرقم الثاني: ")
متغير العملية = اقرأ("العملية (+,-,*,/): ")

إذا العملية == "+":
    اكتب("النتيجة: " + (الرقم1 + الرقم2))
وإلا إذا العملية == "-":
    اكتب("النتيجة: " + (الرقم1 - الرقم2))
وإلا إذا العملية == "*":
    اكتب("النتيجة: " + (الرقم1 * الرقم2))
وإلا إذا العملية == "/":
    اكتب("النتيجة: " + (الرقم1 / الرقم2))
وإلا:
    اكتب("❌ عملية غير صالحة!")`}
                          title="آلة حاسبة"
                        />
                      </TabsContent>

                      <TabsContent value="grade" className="mt-4">
                        <CodeBlock 
                          code={`# تحديد الفصل الدراسي
متغير العمر = اقرأ("ما عمرك؟ ")

إذا العمر < 6:
    اكتب("👶 الروضة")
وإلا إذا العمر < 12:
    اكتب("📚 الابتدائية")
وإلا إذا العمر < 15:
    اكتب("📖 الإعدادية")
وإلا إذا العمر < 18:
    اكتب("🎓 الثانوية")
وإلا:
    اكتب("👨‍🎓 الجامعة")`}
                          title="تحديد الفصل"
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Common Mistakes */}
                <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">⚠️</span>
                      أخطاء شائعة
                    </CardTitle>
                    <CardDescription>تجنب هذه الأخطاء الشائعة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold mb-2 text-red-500">❌ خطأ - استخدام = بدل ==</p>
                        <CodeBlock 
                          code={`# خطأ!
إذا العمر = 18:
    اكتب("بالغ")`}
                          title="خطأ"
                        />
                      </div>
                      <div>
                        <p className="font-bold mb-2 text-green-500">✅ صحيح</p>
                        <CodeBlock 
                          code={`# صحيح
إذا العمر == 18:
    اكتب("بالغ")`}
                          title="صحيح"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </NavSection>

            {/* Functions Section */}
            <NavSection id="functions" icon={Code} title="الدوال">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-muted/30 border-2">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4">🎁 ما هي الدوال؟</h3>
                    <p className="text-lg leading-relaxed mb-4">
                      الدوال هي مجموعات من الأوامر التي تقوم بمهمة محددة. يمكنك استخدامها مراراً وتكراراً!
                    </p>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-muted-foreground">
                        💡 <strong>تخيل:</strong> الدالة مثل وصفة طعام - يمكنك استخدامها لعمل نفس الطبق في أي وقت!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="simple" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 gap-2 h-auto p-2">
                    <TabsTrigger value="simple" className="text-sm md:text-base">دالة بسيطة</TabsTrigger>
                    <TabsTrigger value="params" className="text-sm md:text-base">مع بارامترات</TabsTrigger>
                    <TabsTrigger value="return" className="text-sm md:text-base">مع إرجاع</TabsTrigger>
                  </TabsList>

                  <TabsContent value="simple" className="mt-6">
                    <CodeBlock 
                      code={`# دالة بسيطة بدون بارامترات
دالة قل_مرحبا() {
    اكتب("مرحباً!")
    اكتب("أهلاً وسهلاً!")
}

# استدعاء الدالة
ادع قل_مرحبا()`}
                      title="دالة بسيطة"
                    />
                  </TabsContent>

                  <TabsContent value="params" className="mt-6">
                    <CodeBlock 
                      code={`# دالة مع بارامترات
دالة ترحيب(الاسم) {
    اكتب("مرحباً " + الاسم + "!")
    اكتب("أهلاً بك في رمز!")
}

# استدعاء الدالة مع قيم مختلفة
ادع ترحيب("أحمد")
ادع ترحيب("سارة")
ادع ترحيب("محمد")`}
                      title="دالة مع بارامترات"
                    />
                  </TabsContent>

                  <TabsContent value="return" className="mt-6">
                    <CodeBlock 
                      code={`# دالة تجمع رقمين وترجع النتيجة
دالة جمع(أ, ب) {
    ارجع أ + ب
}

# دالة تحسب المضروب
دالة مضروب(ن: رقم): رقم {
    متغير النتيجة = 1
    لكل i من 1 إلى ن:
        النتيجة = النتيجة * i
    ارجع النتيجة
}

# استخدام الدوال
متغير المجموع = ادع جمع(5, 3)
اكتب("المجموع: " + المجموع)

متبر المضروب = ادع مضروب(5)
اكتب("مضروب 5 = " + المضروب)  # 120`}
                      title="دالة مع إرجاع"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </NavSection>

            {/* Data Structures Section */}
            <NavSection id="data-structures" icon={Terminal} title="هياكل البيانات">
              <div className="space-y-8">
                {/* Lists */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">📋</span>
                      القوائم
                    </CardTitle>
                    <CardDescription>قائمة مرتبة من العناصر</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock 
                      code={`# إنشاء قائمة
متغير الألوان = ["أحمر", "أخضر", "أزرق"]
مت الأرقام = [10, 20, 30, 40, 50]

# الوصول للعناصر
اكتب(الألوان[0])   # أحمر (أول عنصر)
اكتب(الألوان[2])   # أزرق
اكتب(الأرقام[-1])  # 50 (آخر عنصر)

# التكرار على القائمة
لكل لون في الألوان:
    اكتب("اللون: " + لون)`}
                      title="القوائم"
                    />
                  </CardContent>
                </Card>

                {/* Dictionaries */}
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">📖</span>
                      القواميس
                    </CardTitle>
                    <CardDescription>مجموعة من الأزواج (مفتاح وقيمة)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock 
                      code={`# إنشاء قاموس
متغير الطالب = {
    "الاسم": "أحمد",
    "العمر": 12,
    "الصف": "السادس"
}

# الوصول للقيم
اكتب(الطالب["الاسم"])  # أحمد
اكتب(الطالب["العمر"])   # 12

# تغيير قيمة
الطالب["العمر"] = 13
اكتب("العمر الجديد: " + الطالب["العمر"])`}
                      title="القواميس"
                    />
                  </CardContent>
                </Card>

                {/* Tuples */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">📍</span>
                      الأزواج
                    </CardTitle>
                    <CardDescription>مجموعة ثابتة من العناصر</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock 
                      code={`# إنشاء زوج (إحداثيات)
متغير الموقع = (150, 200)
مت الألوان_rgb = ("أحمر", "أخضر", "أزرق")

# الوصول للعناصر
اكتب("X: " + الموقع[0])  # 150
اكتب("Y: " + الموقع[1])  # 200

# الأزواج لا يمكن تغييرها!
# الموقع[0] = 100  # خطأ!`}
                      title="الأزواج"
                    />
                  </CardContent>
                </Card>
              </div>
            </NavSection>

            {/* Examples Section */}
            <NavSection id="examples" icon={FileCode} title="أمثلة كاملة">
              <div className="space-y-8">
                <Tabs defaultValue="calculator" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2">
                    <TabsTrigger value="calculator" className="text-sm">آلة حاسبة</TabsTrigger>
                    <TabsTrigger value="guessing" className="text-sm">لعبة التخمين</TabsTrigger>
                    <TabsTrigger value="grades" className="text-sm">حساب المعدل</TabsTrigger>
                    <TabsTrigger value="multiplication" className="text-sm">جدول الضرب</TabsTrigger>
                  </TabsList>

                  <TabsContent value="calculator" className="mt-6">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>🔢 آلة حاسبة بسيطة</CardTitle>
                        <CardDescription>برنامج يجري عمليات حسابية أساسية</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CodeBlock 
                          code={`# آلة حاسبة بسيطة
دالة الجمع(أ, ب) {
    ارجع أ + ب
}

دالة الطرح(أ, ب) {
    ارجع أ - ب
}

دالة الضرب(أ, ب) {
    ارجع أ * ب
}

دالة القسمة(أ, ب) {
    ارجع أ / ب
}

# استخدام الآلة الحاسبة
متغير الرقم1 = 20
متغير الرقم2 = 5

اكتب("الجمع: " + ادع الجمع(الرقم1, الرقم2))
اكتب("الطرح: " + ادع الطرح(الرقم1, الرقم2))
اكتب("الضرب: " + ادع الضرب(الرقم1, الرقم2))
اكتب("القسمة: " + ادع القسمة(الرقم1, الرقم2))`}
                          title="آلة حاسبة"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="guessing" className="mt-6">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>🎮 لعبة تخمين الرقم</CardTitle>
                        <CardDescription>لعبة ممتعة لتخمين رقم عشوائي</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CodeBlock 
                          code={`# لعبة تخمين الرقم
متغير الرقم_السري = 7
متغير المحاولات = 0
متغير النتيجة = ""

اكتب("🎯 خمّن الرقم من 1 إلى 10!")

بينما النتيجة != "صحيح":
    متغير التخمين = اقرأ("أدخل تخمينك: ")
    المحاولات = المحاولات + 1
    
    إذا التخمين == الرقم_السري:
        اكتب("🎉 أحسنت! الرقم صحيح!")
        اكتب("عدد المحاولات: " + المحاولات)
        النتيجة = "صحيح"
    وإلا إذا التخمين > الرقم_السري:
        اكتب("⬇️ الرقم أصغر!")
    وإلا:
        اكتب("⬆️ الرقم أكبر!")`}
                          title="لعبة التخمين"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="grades" className="mt-6">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>📊 حساب المعدل الدراسي</CardTitle>
                        <CardDescription>برنامج لحساب المعدل وتحديد التقدير</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CodeBlock 
                          code={`# حساب المعدل الدراسي
دالة حساب_المعدل(الدرجات) {
    متغير المجموع = 0
    مت العدد = 0
    
    لكل درجة في الدرجات:
        المجموع = المجموع + درجة
        العدد = العدد + 1
    
    ارجع المجموع / العدد
}

دالة التقدير(المعدل) {
    إذا المعدل >= 90:
        ارجع "ممتاز 🌟"
    وإلا إذا المعدل >= 80:
        ارجع "جيد جداً 👏"
    وإلا إذا المعدل >= 70:
        ارجع "جيد 👍"
    وإلا إذا المعدل >= 60:
        ارجع "مقبول 😊"
    وإلا:
        ارجع "راسب 😢"
}

# حساب المعدل
مت درجات_الطالب = [85, 92, 78, 95, 88]
مت المعدل = ادع حساب_المعدل(درجات_الطالب)
مت التقدير_النهائي = ادع التقدير(المعدل)

اكتب("المعدل: " + المعدل)
اكتب("التقدير: " + التقدير_النهائي)`}
                          title="حساب المعدل"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="multiplication" className="mt-6">
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle>✖️ جدول الضرب</CardTitle>
                        <CardDescription>برنامج يطبع جدول الضرب لأي رقم</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CodeBlock 
                          code={`# جدول الضرب
دالة جدول_الضرب(الرقم) {
    اكتب("═════════════════════")
    اكتب("   جدول ضرب " + الرقم)
    اكتب("═════════════════════")
    
    لكل i من 1 إلى 10:
        مت النتيجة = الرقم * i
        اكتب("   " + الرقم + " × " + i + " = " + النتيجة)
    
    اكتب("═════════════════════")
}

# طباعة جداول الضرب
مت الرقم = 5
ادع جدول_الضرب(الرقم)

# طباعة عدة جداول
لكل ن من 2 إلى 5:
    ادع جدول_الضرب(ن)
    اكتب("")`}
                          title="جدول الضرب"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </NavSection>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-muted/50 to-background border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                رمـز
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              لغة برمجة عربية للأطفال - تعلم البرمجة بلغتك الأم
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
              <a 
                href="https://github.com/LaamiriOuail/Ramz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/ouaillaamiri/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>صُنع بـ ❤️ للأطفال العرب</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
