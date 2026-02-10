
import { FileText, HandHeart, Clock } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';


/**
 * app/privacy/page.tsx
 *
 * プライバシーポリシー（AIヒアリングナビ）
 */

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          プライバシーポリシー
        </h1>

        <section className="space-y-6 text-gray-700 leading-relaxed text-sm">
          <p>
            カイロシガ整体院（以下「当院」）は、当院が提供する
            「AIヒアリングナビ」（以下「本サービス」）において、
            利用者の個人情報を以下の方針に基づき適切に取り扱います。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            1. 取得する情報について
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>氏名、フリガナ</li>
            <li>生年月日、性別、連絡先（メールアドレス等）</li>
            <li>症状、既往歴、生活習慣、目標などのヒアリング内容</li>
            <li>LINE連携に必要な識別情報（LINEユーザーID 等）</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">
            2. 利用目的について
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>来院時のカウンセリングや施術時の参考情報として活用するため</li>
            <li>ヒアリング内容を整理し、分かりやすく提示するため</li>
            <li>利用者への連絡や案内を行うため</li>
            <li>本サービスの品質向上・改善のため</li>
          </ul>

          <p className="text-xs text-gray-600">
            ※本サービスは、医療行為や医学的な判断を行うものではありません。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            3. LINE連携および外部サービスの利用について
          </h2>
          <p>
            本サービスでは、利便性向上のためLINE公式アカウントや
            AIサービスを利用する場合があります。
            これらは入力内容を整理し、利用者に分かりやすく伝える目的に限って使用されます。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            4. 個人情報の管理について
          </h2>
          <p>
            当院は、取得した個人情報について、
            不正アクセス・漏えい・改ざん等を防止するため、
            適切な安全管理措置を講じます。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            5. 第三者提供について
          </h2>
          <p>
            法令に基づく場合を除き、
            本人の同意なく個人情報を第三者に提供することはありません。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            6. 開示・訂正・削除について
          </h2>
          <p>
            ご本人から、自己の個人情報について
            開示・訂正・削除等を希望される場合は、
            合理的な範囲で速やかに対応いたします。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            7. ポリシーの変更について
          </h2>
          <p>
            本ポリシーの内容は、必要に応じて予告なく変更する場合があります。
            変更後の内容は本ページにて公表します。
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            8. お問い合わせ先
          </h2>
          <p>
            カイロシガ整体院<br />
            滋賀県草津市野路4-10-9<br />
            お問い合わせはお問い合わせページよりご連絡ください。
          </p>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
