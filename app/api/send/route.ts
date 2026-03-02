import { NextResponse } from "next/server";
import { Resend } from "resend";

// APIキーを読み込む
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  // フロントから送られたデータを取得
  const data = await req.json();

  try {
    // メール送信
    await resend.emails.send({
      from: "AIヒアリングナビ <info@chiroshiga.com>",
      to: "info@chiroshiga.com",
      subject: "ヒアリング送信通知",
      text: `
      ヒアリングが送信されました。

      ${JSON.stringify(data, null, 2)}
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "送信失敗" }, { status: 500 });
  }
}
