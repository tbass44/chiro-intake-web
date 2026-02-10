
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';


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
        <h1 className="text-2xl font-bold mb-6">利用規約</h1>

        <p className="mb-6 text-gray-700 leading-relaxed">
          本利用規約（以下「本規約」）は、カイロシガ整体院（以下「当院」）が提供する
          「AIヒアリングナビ」（以下「本サービス」）の利用条件を定めるものです。
          利用者は、本サービスを利用することで、本規約に同意したものとみなします。
        </p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">第1条（本サービスについて）</h2>
          <p className="text-gray-700 leading-relaxed">
            本サービスは、利用者が入力した情報をもとに、
            来院時のカウンセリングや状態確認をスムーズに行うための
            情報整理・補助を目的としたツールです。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">第2条（提供内容の性質）</h2>
          <p className="text-gray-700 leading-relaxed">
            本サービスで表示・送信される内容は、利用者が入力した情報を
            分かりやすく整理したものであり、
            特定の判断や結論を示すものではありません。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">第3条（利用者の責任）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、本サービスに入力する情報について、
            自らの判断と責任のもとで正確に入力するものとします。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">第4条（外部サービスの利用）</h2>
          <p className="text-gray-700 leading-relaxed">
            本サービスでは、利便性向上のため、
            LINE等の外部サービスを利用する場合があります。
            外部サービスの利用に関しては、
            各サービス提供者の定める条件が適用されます。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">第5条（免責事項）</h2>
          <p className="text-gray-700 leading-relaxed">
            当院は、本サービスの利用によって生じた
            直接的または間接的な不利益や損害について、
            故意または重大な過失がある場合を除き、
            責任を負わないものとします。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">第6条（サービスの変更・停止）</h2>
          <p className="text-gray-700 leading-relaxed">
            当院は、利用者への事前の通知なく、
            本サービスの内容変更、提供の中断または終了を
            行うことがあります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">第7条（規約の変更）</h2>
          <p className="text-gray-700 leading-relaxed">
            本規約は、必要に応じて内容を変更することがあります。
            変更後の規約は、本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
