import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "رمز - لغة برمجة عربية للأطفال",
  description: "تعلم البرمجة بلغتك الأم! رمز هي لغة برمجة عربية سهلة وممتعة للأطفال.",
  keywords: ["رمز", "Ramz", "برمجة", "أطفال", "تعلم", "عربي", "لغة برمجة"],
  authors: [{ name: "فريق رمز" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "رمز - لغة برمجة عربية للأطفال",
    description: "تعلم البرمجة بلغتك الأم!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${notoKufiArabic.variable} font-arabic antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Noto Kufi Arabic', 'Segoe UI', Tahoma, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
