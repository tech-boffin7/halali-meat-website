import { getSettings } from "@/app/actions/settings-actions";
import AuthProvider from '@/components/auth/auth-provider';
import { DynamicFavicon } from "@/components/common/dynamic-favicon";
import CookieConsent from "@/components/cookie-consent";
import FooterRenderer from '@/components/layout/footer-renderer';
import PageWrapper from "@/components/layout/page-wrapper";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Halali Meat Ltd.",
    template: "%s | Halali Meat Ltd.",
  },
  description: "Premium Halal Meat, Exported with Trust. We specialize in sourcing, processing, and exporting high-quality, 100% halal-certified meat from East Africa to the GCC and beyond.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: ["halal meat", "meat exporter", "beef", "goat", "lamb", "kenya", "tanzania", "somalia", "GCC"],
  openGraph: {
    title: "Halali Meat Ltd.",
    description: "Halal Meat, Exported with Trust.",
    url: "https://halalimeatltd.com",
    siteName: "Halali Meat Ltd..",
    images: [
      {
        url: "https://halalimeatltd.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halali Meat Ltd.",
    description: "Halal Meat, Exported with Trust.",
    images: ["https://halalimeatltd.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function FaviconProvider() {
  const result = await getSettings().catch(() => ({ success: false, settings: null }));
  const faviconUrl = result.success && result.settings ? result.settings.faviconUrl : null;
  return <DynamicFavicon faviconUrl={faviconUrl} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <FaviconProvider />
        <AuthProvider>
          <ThemeProviderWrapper
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PageWrapper>{children}</PageWrapper>
            <CookieConsent />
            <Toaster richColors position="top-right" />
            <FooterRenderer />
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
