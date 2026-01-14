import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  variable: '--font-noto-sans-jp',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'カイロシガ整体院｜AI問診',
  description: 'カイロシガ整体院の初回AI問診フォーム',
  lang: 'ja',
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