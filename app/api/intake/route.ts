import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the FastAPI backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
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

    const apiUrl = `${backendUrl}/api/intake`;
    console.log('Proxying request to:', apiUrl);

    // Forward the request to the FastAPI backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization headers if present
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} - ${errorText}`);
      
      // Return a user-friendly error message
      return NextResponse.json(
        { 
          success: false, 
          message: response.status === 404 
            ? 'サーバーに接続できませんでした。しばらく時間をおいてから再度お試しください。'
            : 'サーバーエラーが発生しました。管理者にお問い合わせください。'
        },
        { status: response.status }
      );
    }

    // Parse the response from the backend
    const data = await response.json();
    
    // Return the backend response
    return NextResponse.json({
      success: true,
      message: '問診フォームを正常に送信しました。',
      ...data
    });

  } catch (error) {
    console.error('API route error:', error);
    
    // Handle network errors or JSON parsing errors
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

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}