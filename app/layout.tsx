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
  title: 'カイロシガ整体院｜AIヒアリングナビ',
  description: 'AIヒアリングナビは、AIを活用してお身体の状態やお悩みを整理するサポートチェックサービスです。ご入力いただいた内容は、施術やサポートの参考として活用されます。',
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
