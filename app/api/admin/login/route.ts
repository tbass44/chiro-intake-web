// Next.jsのレスポンス作成用
import { NextResponse } from "next/server";

// 管理者用のセッショントークンを作る関数
// (JWTなどを生成している可能性が高い)
import { createAdminSessionToken } from "@/lib/adminAuth";

/*
POST /api/admin/login

管理画面ログインAPI
*/
export async function POST(req: Request) {

  /*
  リクエストボディ(JSON)を取得

  フロントから送られるデータ例

  {
    username: "admin",
    password: "password"
  }
  */
  const { username, password } = await req.json().catch(() => ({}));

  /*
  .envに設定された管理者情報を取得
  */
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";  
  const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

  const days = Number(process.env.ADMIN_SESSION_DAYS ?? "7");

  /*
  SECRETが設定されていない場合
  → サーバー設定ミス
  */
  if (!ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured" }, 
      { status: 500 }
    );
  }

  /*
  ログイン認証

  入力された username/password と
  環境変数の管理者情報を比較
  */
  const ok = 
    username === ADMIN_USERNAME && 
    password === ADMIN_PASSWORD;

  /*
  認証失敗
  */
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid credentials" }, 
      { status: 401 }
    );
  }

  /*
  認証成功

  管理者セッショントークン生成
  */
  const token = await createAdminSessionToken(
    username,
    ADMIN_SECRET,
    days
  );

  /*
  フロントに返すレスポンス
  */
  const res = NextResponse.json({ ok: true });

  /*
  Cookieを作成
  */
  res.cookies.set("admin_session", token, {

    /*
    JavaScriptからアクセス不可
    → XSS対策
    */
    httpOnly: true,

    /*
    HTTPSのみ
    (本番環境のみ)
    */
    secure: process.env.NODE_ENV === "production",

    /*
    CSRF対策
    */
    sameSite: "lax",

    /*
    全ページで有効
    */
    path: "/",

    /*
    有効期限
    */
    maxAge: days * 24 * 60 * 60,
  });

  /*
  Cookie付きレスポンスを返す
  */
  return res;
}
