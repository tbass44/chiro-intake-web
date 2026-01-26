import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Stethoscope, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">カイロシガ整体院</h1>
                <p className="text-sm text-blue-600">AIヒアリングナビシステム</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            初回AIヒアリングナビフォームへようこそ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          AIヒアリングナビでは、現在のお身体の状態やお悩みについていくつかご質問させていただきます。<br />
          ご入力内容は、施術やサポートの参考として整理されます。<br />
            所要時間は約5-10分です。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">詳細なヒアリング</CardTitle>
              <CardDescription>
                症状や既往歴について詳しくお伺いします
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">時間短縮</CardTitle>
              <CardDescription>
                来院時の受付時間を大幅に短縮できます
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Stethoscope className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">最適な施術</CardTitle>
              <CardDescription>
                お客様に最適な施術プランを提案します
              </CardDescription>
            </CardHeader>
          </Card>
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
              ※ 入力内容は自動保存されます
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 カイロシガ整体院. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="#" className="hover:text-blue-600 transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                利用規約
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
