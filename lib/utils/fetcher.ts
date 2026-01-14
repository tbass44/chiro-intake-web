import { ApiResponse } from '@/lib/types/intake';

export async function submitIntakeForm(data: any): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Submit error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'エラーが発生しました',
    };
  }
}