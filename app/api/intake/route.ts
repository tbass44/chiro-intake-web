import { NextRequest, NextResponse } from 'next/server';

/*
Next.jsのAPIルート

POST /api/intake

というURLにアクセスされたときに
この関数が実行される
*/
export async function POST(request: NextRequest) {
  try {
    /*
    フロントエンドから送られてきたJSONデータを取得

    例
    {
      name: "山田",
      symptom: "腰痛"
    }
    */
    const body = await request.json();
    
    // Get the FastAPI backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    /*
    環境変数が設定されていない場合はエラー
    */
    if (!backendUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not configured');
      return NextResponse.json(
        { 
          success: false, 
          message: 'バックエンドサーバーの設定エラーです。管理者にお問い合わせください。' 
        },
        { status: 500 }
      );
    }

    /*
    FastAPIのエンドポイント

    例
    https://api.example.com/intake
    */
    const apiUrl = `${backendUrl}/intake`;
    console.log('Proxying request to:', apiUrl);

    /*
    FastAPIへリクエストを転送

    fetch = HTTPリクエストを送る関数
    */
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {

        // JSON送信
        'Content-Type': 'application/json',

        /*
        Authorizationヘッダーがあれば
        そのままFastAPIに転送

        ログイン認証などに使う
        */
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        }),
      },

      // フロントから受け取ったデータをそのまま送る
      body: JSON.stringify(body),
    });


    /*
    FastAPIがエラーだった場合
    */
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} - ${errorText}`);
      
      // Return a user-friendly error message
      return NextResponse.json(
        { 
          success: false, 

          // ユーザー向けのメッセージ
          message: response.status === 404 
            ? 'サーバーに接続できませんでした。しばらく時間をおいてから再度お試しください。'
            : 'サーバーエラーが発生しました。管理者にお問い合わせください。'
        },
        { status: response.status }
      );
    }

    /*
    FastAPIのレスポンスを取得
    */
    const data = await response.json();
    
    /*
    フロントへ結果を返す
    */
    return NextResponse.json({
      success: true,
      // FastAPIが返したsummaryを表示
      message: data.summary ?? 'フォームを送信しました。',
    });

  } catch (error) {
    console.error('API route error:', error);
    
    /*
    ネットワークエラーなど
    */
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error && error.message.includes('fetch')
          ? 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
          : 'システムエラーが発生しました。しばらく時間をおいてから再度お試しください。'
      },
      { status: 500 }
    );
  }
}

/*
CORS対応

ブラウザが送る
OPTIONSリクエスト（事前確認）に対応
*/
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      // どこからのアクセスでも許可
      'Access-Control-Allow-Origin': '*',

      // 許可するHTTPメソッド
      'Access-Control-Allow-Methods': 'POST, OPTIONS',

      // 許可するヘッダー
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
