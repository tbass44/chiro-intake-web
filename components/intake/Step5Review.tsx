/**
 * Step5Review.tsx
 *
 * AIヒアリングナビフォームの最終ステップ（確認・送信画面）
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  FileCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { IntakeFormData } from '@/lib/types/intake';

type ReviewField = {
  label: string;
  value: any;
  required?: boolean;
};

type ReviewSection = {
  title: string;
  step: number;
  fields: ReviewField[];
};

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
  submitResult?: { 
    success: boolean; 
    message?: string; 
    pdfUrl?: string 
  } | null;
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

    /* ===============================
   * 共通ユーティリティ
   * =============================== */

    const formatValue = (value: any): string => {
      if (value === undefined || value === null || value === '') return '未入力';
      if (Array.isArray(value)) {
        return value.length ? value.join(', ') : '選択なし';
      }
      if (typeof value === 'boolean') return value ? 'はい' : 'いいえ';
      return String(value);
    };
  
    const isEmpty = (value: any): boolean => {
      if (value === undefined || value === null || value === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      if (typeof value === 'boolean' && value === false) return true;
      return false;
    };

    /* ===============================
    * Step2 必須判定用
    * =============================== */

    const hasMainSymptom =
    Array.isArray(formData.symptoms) &&
    formData.symptoms.length > 0 &&
    !!formData.symptoms[0]?.symptom?.trim();

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
          フォームを送信しました
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
   * 表示セクション定義
   *
   * ・title : セクション名
   * ・step  : 編集時に戻るステップ番号
   * ・fields: 表示項目（ラベル／値／必須）
   *
   * ※ UI 表示専用
   * ※ schema とは直接連動しない
   */
   const sections: ReviewSection[] = [
      {
        title: '基本情報',
        step: 1,
        fields: [
          { label: '氏名', value: formData.name, required: true },
          { label: 'ふりがな', value: formData.furigana, required: true },
          { label: '生年月日', value: formData.dob, required: true },
          { label: '性別', value: formData.sex, required: true },
          { label: '職業', value: formData.occupation },
          { label: '電話番号', value: formData.phone },
          { label: 'メール', value: formData.email, required: true },
          { label: '身長', value: `${formData.height} cm`, required: true },
          { label: '体重', value: formData.weight ? `${formData.weight} kg` : undefined },
          { label: '来院経路', value: formData.referralSource, required: true },
          { label: '都道府県', value: formData.prefecture },
          { label: '市区町村', value: formData.city },
        ],
      },
      {
        title: '主訴・症状',
        step: 2,
        fields: formData.symptoms?.map((s, i) => ({
          label: `症状 ${i + 1}`,
          value: [
            `主訴：${s.symptom}`,
            s.onset && `経過：${s.onset}`,
            s.severity && `痛み：${s.severity}/5`,
            s.perceivedCause && `原因：${s.perceivedCause}`,
          ]
            .filter(Boolean)
            .join(' / '),
          required: i === 0, // 最初の主訴のみ必須
        })) ?? [],
      },
      {
        title: '既往歴・服薬',
        step: 3,
        fields: [
          { label: '既往歴', value: formData.medicalHistory },
          { label: '外傷歴', value: formData.injuries },
          { label: '服薬', value: formData.medications },
          { label: 'アレルギー', value: formData.allergies },
          { label: '手術歴', value: formData.surgeries },
          {
            label: '金属・人工関節',
            value: formData.hasImplant,
          },
          {
            label: '部位',
            value: formData.hasImplant
              ? formData.implantDetail
              : undefined,
          },
        ],
      },
      {
        title: '生活習慣・目標',
        step: 4,
        fields: [
          { label: '睡眠時間', value: `${formData.sleepHours} 時間` },
          { label: 'ストレス', value: `${formData.stressLevel}/10` },
          { label: '運動頻度', value: formData.exerciseFreq },
          { label: '布団', value: formData.beddingType },
          { label: '枕', value: formData.pillowType },
          { label: '肌の状態', value: formData.skinCondition },
          { label: '水分摂取量', value: formData.waterIntake },
          { label: '来院目的', value: formData.goal, required: true },
          { label: '同意', value: formData.consent, required: true },
        ],
      },
    ];
  
    const hasRequiredFields =
      formData.name &&
      formData.furigana &&
      formData.dob &&
      formData.sex &&
      formData.email &&
      formData.height &&
      formData.referralSource &&
      hasMainSymptom &&
      formData.goal &&
      formData.consent === true;

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
                    {field.required && isEmpty(field.value) ? (
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
          {isSubmitting ? '送信中...' : 'フォームを送信'}
        </Button>
      </div>
    </div>
  );
}
