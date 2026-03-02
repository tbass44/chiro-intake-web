import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HandHeart, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden">  
      {/* 背景レイヤー */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
      {/* うっすら光エフェクト */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white rounded-full blur-3xl opacity-40" />
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-room.png"
          alt="カイロシガ整体院の施術室"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      </div>

        {/* テキスト */}
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h1 className="relative inline-block text-4xl md:text-5xl font-bold leading-[1.2] text-slate-900">
            <span className="relative z-10">
              AIでお身体の状態を見える化
            </span>
            <span className="absolute left-0 bottom-2 w-full h-4 bg-blue-200/60 -z-0 rounded-sm"></span>
          </h1>
          <div className="mt-6 mb-6">
            <span className="inline-block text-lg font-medium px-4 py-1 rounded-full bg-blue-100 text-blue-700">
              AIヒアリングナビ
            </span>
          </div>

          <p className="mt-6 text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
            施術をより良いものにするために、
            <br className="hidden md:block" />
            まずは今のお身体の状態を整理してみませんか？
          </p>

          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            入力内容はAIが整理し、施術やアドバイスの参考として活用されます。<br />
            所要時間は約5〜10分。<br />
            来院予定がなくてもご利用いただけます。
          </p>

          <Link href="/intake">
            <Button
              size="lg"
              className="mt-8 text-lg px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all"
            >
              今すぐヒアリング開始
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-20">

        <div className="text-center">
          <h2 className="relative inline-block text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            <span className="relative z-10">
              AIヒアリングナビでできること
            </span>
            <span className="absolute left-0 right-0 bottom-1 h-3 bg-blue-300/60 rounded-sm z-0"></span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader  className="items-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">事前に状態を整理</CardTitle>
              <CardDescription className="mt-2 leading-relaxed text-slate-600 text-lg">
                現在の症状や既往歴を整理し、施術の参考として活用します
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader  className="items-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">来院時の負担を軽減</CardTitle>
              <CardDescription className="mt-2 leading-relaxed text-slate-600 text-lg">
                受付やカウンセリングをスムーズにし、施術に集中できる環境を整えます
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader  className="items-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HandHeart className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">より適した施術へ</CardTitle>
              <CardDescription className="mt-2 leading-relaxed text-slate-600 text-lg">
                事前情報をもとに、お身体の状態に合わせた施術を行います
              </CardDescription>
            </CardHeader>
          </Card>
        </div>       

        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">

            {/* セクション見出し（中央寄せ） */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold relative inline-block">
                <span className="relative z-10">入力後について</span>
                <span className="absolute left-0 bottom-2 w-full h-3 bg-blue-300/40 -z-0"></span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* 左：画像 */}
              <div className="relative aspect-[16/9] lg:aspect-[3/4] w-full max-w-lg mx-auto">
                <Image
                  src="/images/hearing.jpg"
                  alt="ヒアリング風景"
                  fill
                  className="object-cover object-[50%_30%] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
                />
                <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/40 to-transparent rounded-r-2xl" />
              </div>

              {/* 右：テキスト */}
              <div className="space-y-12 m-auto">

                <div>
                <p className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                  <span className="absolute inset-0 rounded-full bg-blue-100"></span>
                  <span className="absolute inset-0 rounded-full border border-blue-300"></span>
                  <span className="relative text-blue-600 font-bold text-lg">01</span>
                </p>
                  <h3 className="font-bold text-xl mb-2">状態が整理される</h3>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    入力内容はAIが整理し、現在のお身体の状態を客観的に確認できます。
                  </p>
                </div>

                <div>
                <p className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                  <span className="absolute inset-0 rounded-full bg-blue-100"></span>
                  <span className="absolute inset-0 rounded-full border border-blue-300"></span>
                  <span className="relative text-blue-600 font-bold text-lg">02</span>
                </p>
                  <h3 className="font-bold text-xl mb-2">改善の方向性が見える</h3>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    状態に合わせた施術の考え方やポイントを確認できます。
                  </p>
                </div>

                <div>
                <p className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
                  <span className="absolute inset-0 rounded-full bg-blue-100"></span>
                  <span className="absolute inset-0 rounded-full border border-blue-300"></span>
                  <span className="relative text-blue-600 font-bold text-lg">03</span>
                </p>
                  <h3 className="font-bold text-xl mb-2">来院前の不安が減る</h3>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    事前に整理することで、安心して施術を受けていただけます。
                  </p>
                </div>

                <div className="mt-12 p-8 bg-white rounded-2xl shadow-md text-lg text-slate-700 leading-relaxed">
                  ご入力内容は自動で整理され、その場でご確認いただけます。<br />
                  LINE連携をご利用の場合は、内容をLINEでも確認できます。
                </div>

              </div>
            </div>
          </div>
        </section>

        <Card className="max-w-2xl mx-auto shadow-lg border-0 mt-6">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-blue-900 font-bold">
              AIヒアリングをはじめる
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              5つのステップで簡単に入力できます。途中で保存も可能です。
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center pt-2">
            <Link href="/intake">
              <Button
                size="lg"
                className="text-lg px-10 py-4 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                ヒアリングを開始
              </Button>
            </Link>

            <p className="text-base text-gray-600 mt-6 leading-relaxed">
              ※ 入力内容は自動保存されます<br />
              ※ 内容はLINEでも確認できます
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 mb-10 text-center">
          <a
            href="https://chiroshiga.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline text-base"
          >
            🔗 カイロシガ整体院 公式サイトを見る
          </a>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
