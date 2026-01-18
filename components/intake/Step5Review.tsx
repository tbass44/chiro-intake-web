/**
 * Step5Review.tsx
 *
 * AI問診フォームの最終ステップ（確認・送信画面）
 *
 * 役割：
 * ・これまで入力された全フォーム内容を一覧表示する
 * ・各セクションごとに「編集（該当ステップへ戻る）」を提供
 * ・必須項目がすべて入力されているかを最終チェック
 * ・送信処理のトリガー（onSubmit）を呼び出す
 * ・送信成功／失敗の結果表示を行う
 *
 * このコンポーネントは
 * ・フォームの state を自分で持たない
 * ・useWatch を使って react-hook-form の値を参照するだけ
 *
 * ＝ 完全に「表示・確認・分岐」専用コンポーネント
 */

'use client';

import { Control, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Edit, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { IntakeFormData } from '@/lib/types/intake';

/**
 * Step5Review が受け取る props
 *
 * control       : react-hook-form の control（useWatch 用）
 * onEdit(step)  : 編集ボタン押下時に、指定ステップへ戻す
 * onSubmit      : 最終送信処理（page.tsx 側）
 * isSubmitting  : 送信中フラグ（多重送信防止）
 * submitResult  : 送信結果（成功／失敗／PDF URL など）
 */
interface Step5ReviewProps {
  control: Control<IntakeFormData>;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitResult?: { success: boolean; message?: string; pdfUrl?: string } | null;
}

export function Step5Review({ 
  control, 
  onEdit, 
  onSubmit, 
  isSubmitting, 
  submitResult 
}: Step5ReviewProps) {
    /**
   * useWatch によりフォーム全体の現在値を取得
   *
   * ・state は保持しない
   * ・変更があれば自動で再描画される
   * ・確認画面専用の安全な読み取り方法
   */
  const formData = useWatch({ control });

    /**
   * 送信成功後の完了画面
   *
   * ・成功メッセージ表示
   * ・PDF ダウンロードリンク（あれば）
   * ・次の案内文言を表示
   */
  if (submitResult?.success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          問診フォームを送信しました
        </h3>
        <p className="text-gray-600 mb-6">
          ご入力いただきありがとうございます。担当者が内容を確認後、ご連絡いたします。
        </p>

        {/* PDF ダウンロード（任意） */}
        {submitResult.pdfUrl && (
          <Button
            onClick={() => window.open(submitResult.pdfUrl, '_blank')}
            className="mb-4"
          >
            問診票PDFをダウンロード
          </Button>
        )}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          <p>
            <span className="font-semibold">次のステップ：</span>
            3営業日以内に担当者よりご連絡いたします。ご質問等がございましたら、
            お気軽にお電話またはメールでお問い合わせください。
          </p>
        </div>
      </div>
    );
  }

    /**
   * 値を人が読める文字列に変換する関数
   *
   * ・未入力 → 「未入力」
   * ・配列 → カンマ区切り
   * ・boolean → はい / いいえ
   * ・number → 数値文字列
   */
  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return '未入力';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '選択なし';
    }
    if (typeof value === 'boolean') {
      return value ? 'はい' : 'いいえ';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return value.toString();
  };

    /**
   * 必須項目チェック用の空判定関数
   *
   * ・空文字
   * ・false
   * ・空配列
   * を「未入力」とみなす
   */
  const isEmptyValue = (value: any): boolean => {
    if (value === undefined || value === null || value === '') return true;
    if (typeof value === 'boolean' && value === false) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  };

    /**
   * 表示セクション定義
   *
   * ・title : セクション名
   * ・step  : 編集時に戻るステップ番号
   * ・fields: 表示項目（ラベル／値／必須）
   *
   * ※ UI 表示専用
   * ※ schema とは直接連動しない
   */
  const sections = [
    {
      title: '基本情報',
      step: 1,
      fields: [
        { label: '氏名', value: formData.name, required: true },
        { label: 'ふりがな', value: formData.furigana, required: true },
        { label: '生年月日', value: formData.dob, required: true },
        { label: '性別', value: formData.sex, required: false },
        { label: '職業', value: formData.occupation, required: false },
        { label: '電話番号', value: formData.phone, required: true },
        { label: 'メールアドレス', value: formData.email, required: true },
        { label: '都道府県', value: formData.prefecture, required: false },
        { label: '市区町村', value: formData.city, required: false },
      ]
    },
    {
      title: '主訴・症状',
      step: 2,
      fields: [
        { label: '主訴・症状の詳細', value: formData.chiefComplaint, required: true },
        { label: '発症時期', value: `数${formData.onset}前から`, required: false },
        { label: '痛みの程度', value: `${formData.painScale}/10`, required: true },
        { label: '悪化要因', value: formData.aggravatingFactors, required: false },
        { label: '軽快要因', value: formData.relievingFactors, required: false },
        { label: '治療歴', value: formData.previousTreatments, required: false },
      ]
    },
    {
      title: '既往歴・服薬',
      step: 3,
      fields: [
        { label: '既往歴', value: formData.medicalHistory, required: false },
        { label: '外傷歴', value: formData.injuries, required: false },
        { label: '服薬中の薬', value: formData.medications, required: false },
        { label: 'アレルギー', value: formData.allergies, required: false },
        { label: '手術歴', value: formData.surgeries, required: false },
      ]
    },
    {
      title: '生活習慣・目標',
      step: 4,
      fields: [
        { label: '睡眠時間', value: `${formData.sleepHours}時間`, required: false },
        { label: 'ストレスレベル', value: `${formData.stressLevel}/10`, required: false },
        { label: '運動頻度', value: formData.exerciseFreq, required: false },
        { label: 'デスクワーク', value: `${formData.deskHours}時間/日`, required: false },
        { label: '水分摂取', value: `${formData.waterIntake}L/日`, required: false },
        { label: '喫煙', value: formData.smoking, required: false },
        { label: '飲酒頻度', value: formData.alcohol, required: false },
        { label: '来院目的', value: formData.goal, required: true },
        { label: 'プライバシー同意', value: formData.consent, required: true },
      ]
    }
  ];

    /**
   * 全必須項目が入力済みかをチェック
   *
   * ・送信ボタン有効／無効判定
   * ・警告表示の制御に使用
   */
  const hasRequiredFields = sections.every(section =>
    section.fields.filter(field => field.required).every(field => !isEmptyValue(field.value))
  );

    /**
   * 確認画面のメイン表示
   */
  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="text-center mb-6">
        <FileCheck className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900">入力内容の確認</h3>
        <p className="text-gray-600">
          内容をご確認の上、送信ボタンを押してください。修正が必要な場合は各セクションの編集ボタンをクリックしてください。
        </p>
      </div>

      {/* 必須未入力警告 */}
      {!hasRequiredFields && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">必須項目が未入力です</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            必須項目（赤いアスタリスクマーク）をすべて入力してから送信してください。
          </p>
        </div>
      )}

      {/* 各セクション表示 */}
      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-900">
                {section.title}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(section.step)}
                className="flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>編集</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 min-w-32">
                      {field.label}
                    </span>
                    {field.required && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    {field.required && isEmptyValue(field.value) ? (
                      <Badge variant="destructive" className="text-xs">
                        未入力
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-900 break-words">
                        {formatValue(field.value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator />

      {/* 注意文 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">送信について：</span>
          送信後は内容の変更ができません。内容をよくご確認の上、送信ボタンを押してください。
          送信後、担当者より確認のご連絡をいたします。
        </p>
      </div>

      {/* 送信エラー表示 */}
      {submitResult && !submitResult.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">送信エラー</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            {submitResult.message || '送信中にエラーが発生しました。もう一度お試しください。'}
          </p>
        </div>
      )}

      {/* 送信ボタン */}
      <div className="text-center">
        <Button
          onClick={onSubmit}
          disabled={!hasRequiredFields || isSubmitting}
          size="lg"
          className="px-12 py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : '問診フォームを送信'}
        </Button>
      </div>
    </div>
  );
}
