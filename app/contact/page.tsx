
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';


/**
 * app/terms/page.tsx
 *
 * 利用規約（AIヒアリングナビ）
 */

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">お問い合わせ</h1>

        <p className="mb-8 text-gray-700 leading-relaxed">
          カイロシガ整体院およびAIヒアリングナビに関するご質問・ご相談は、
          以下の方法よりお気軽にお問い合わせください。
        </p>

        {/* ===============================
            LINE お問い合わせ
        =============================== */}
        <section className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="text-lg font-semibold mb-2 text-green-800">
            LINEでのお問い合わせ
          </h2>

          <p className="mb-4 text-sm text-green-900 leading-relaxed">
            もっともスムーズなご連絡方法です。
            内容確認後、順次ご返信いたします。
          </p>

          <Link
            href="https://lin.ee/aTBmYT4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-green-600 px-6 py-3 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            LINE公式アカウントを開く
          </Link>
        </section>

        {/* ===============================
            メール案内（予備）
        =============================== */}
        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">
            メールでのお問い合わせ
          </h2>

          <p className="text-sm text-gray-700 leading-relaxed">
            LINEのご利用が難しい場合は、下記ページよりご連絡ください。
          </p>

          <p className="mt-3 text-sm">
            ▶︎{' '}
            <a
              href="https://chiroshiga.com/contacts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              カイロシガ整体院 お問い合わせページ
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
