// components/layout/Footer.tsx
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
      <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p className="mb-2">© { year } カイロシガ整体院. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="https://chiroshiga.com"  target="_blank"
            rel="noopener noreferrer"className="hover:text-blue-600 transition-colors">
              カイロシガ整体院公式サイト
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              利用規約
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
