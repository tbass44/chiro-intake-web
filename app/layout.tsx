import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] });
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  variable: '--font-noto-sans-jp',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hearing.chiroshiga.com'),
  title: 'あなたの体の状態をAIが分析｜AIヒアリングナビ｜カイロシガ整体院',
  description:
    'AIヒアリングナビは、AIを使って体の状態や生活習慣を整理する健康チェックサービスです。整体前のセルフチェックとしても活用できます。',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'あなたの体の状態をAIが分析｜AIヒアリングナビ｜カイロシガ整体院',
    description: 'AIを使って体の状態や生活習慣を整理する健康チェックサービス。',
    url: 'https://hearing.chiroshiga.com',
    siteName: 'AIヒアリングナビ',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/images/ogp-ai-hearing-navi.png',
        width: 1200,
        height: 630,
        alt: 'AIヒアリングナビ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'あなたの体の状態をAIが分析｜AIヒアリングナビ｜カイロシガ整体院',
    description: 'AIを使って体の状態や生活習慣を整理する健康チェックサービス。',
    images: ['/images/ogp-ai-hearing-navi.png'],
  },
};

// Placeholder ClerkProvider component
function ClerkProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`}>
      <body className={`${inter.className} font-sans`}>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DRGNP15GMS"
          strategy="afterInteractive"
        />

        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-DRGNP15GMS');
          `}
        </Script>

        <ClerkProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {children}
          </div>
          <Toaster position="top-right" />
        </ClerkProvider>

      </body>
    </html>
  );
}
