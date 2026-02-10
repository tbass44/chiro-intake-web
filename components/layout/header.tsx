// components/layout/Header.tsx

import { FileText, HandHeart, Clock } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HandHeart className="h-8 w-8 text-blue-600" />
          <Link href="/" className="block hover:opacity-80 transition-opacity">
            <div className="cursor-pointer">
              <h1 className="text-xl font-bold text-blue-900">
                カイロシガ整体院
              </h1>
              <p className="text-sm text-blue-600">
                AIヒアリングナビ
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </header>
  );
}
