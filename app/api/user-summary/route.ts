import { NextResponse } from 'next/server';

/**
 * ユーザー向け AI summary（ダミー）
 *
 * ・現時点では AI は使わない
 * ・固定文を返すだけ
 * ・将来この中身を AI 呼び出しに差し替える
 */
export async function POST(req: Request) {
  // 受信データ（将来使う）
  const body = await req.json();

  // TODO: 将来ここで AI に body を渡して文章生成
  console.log('user-summary input (dummy)', body);

  return NextResponse.json({
    summary: `
ご入力いただいた内容を拝見しました。

現在は、体の不調や日常生活での負担が
少し重なっているように感じられます。

これはヒアリング内容を整理したもので、
診断や判断を行うものではありません。

来院時に、あなたの状態を一緒に確認していきましょう。
`.trim(),
  });
}
