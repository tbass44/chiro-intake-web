import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HandHeart, Clock } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AIヒアリングナビフォームへようこそ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          AIヒアリングナビでは、現在のお身体の状態やお悩みについていくつかご質問させていただきます。<br />
          ご入力内容は、施術やサポートの参考として整理されます。<br />
            所要時間は約5-10分です。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-100 hover:shadow-lg transition-shadow mx-auto w-full max-w-md">
            <CardHeader  className="items-center">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">詳細なヒアリング</CardTitle>
              <CardDescription>
                症状や既往歴について詳しくお伺いします
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow mx-auto w-full max-w-md">
            <CardHeader  className="items-center">
              <Clock className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">時間短縮</CardTitle>
              <CardDescription>
                来院時の受付時間を大幅に短縮できます
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow mx-auto w-full max-w-md">
            <CardHeader  className="items-center">
              <HandHeart className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">最適な施術</CardTitle>
              <CardDescription>
                お客様に最適な施術プランを提案します
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-gray-700 md:flex-row md:justify-center md:gap-8">
          <span>🧠 状態を整理するだけでもOK</span>
          <span>🏠 来院しなくても利用できます</span>
          <span>📩 内容はLINEでも確認できます</span>
        </div>

        <div className="mt-6 mb-6 text-center">
          <a
            href="https://chiroshiga.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            🔗 カイロシガ整体院 公式サイトを見る
          </a>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">ヒアリングを開始する</CardTitle>
            <CardDescription className="text-base">
              5つのステップで簡単に入力できます。途中で保存も可能です。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/intake">
              <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700">
                ヒアリングを開始
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
            ※ 入力内容は自動保存されます<br />
            ※ 内容はLINEでも確認できます
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
