/**
 * Step1Basic.tsx
 *
 * AIヒアリングナビフォームの第1ステップ（基本情報入力画面）
 *
 * 役割：
 * ・患者様の基本情報を入力するフォームを表示
 * ・氏名、ふりがな、生年月日、性別、連絡先（電話・メール）、住所を収集
 * ・必須項目のバリデーション表示
 * ・入力内容の説明・ガイダンスを提供
 *
 * このコンポーネントは
 * ・フォームの state を自分で持たない
 * ・react-hook-form の control を受け取り、FormField で各項目を定義
 * ・バリデーションは schema（intakeSchema.ts）側で定義されている
 *
 * 「UI 表示・フォーム項目定義」専用コンポーネント
 */

'use client';

import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IntakeFormData } from '@/lib/types/intake';

/**
 * Step1Basic が受け取る props
 *
 * control : react-hook-form の control（フォーム状態管理用）
 */
interface Step1BasicProps {
  control: Control<IntakeFormData>;
}

const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export function Step1Basic({ control }: Step1BasicProps) {
  return (
    <div className="space-y-6">
      {/* 氏名・ふりがな */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                氏名 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="田中 太郎"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="furigana"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                ふりがな <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="たなか たろう"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 生年月日・性別 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                生年月日 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="text-base"
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">性別</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                  <SelectItem value="回答しない">回答しない</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 職業 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
          control={control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                職業
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="製造業・士業など"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 連絡先（電話・メール） */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                電話番号 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="090-1234-5678"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormDescription>
                ハイフンありなしどちらでも構いません
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                メールアドレス <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormDescription>
                予約確認メールなどをお送りします
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 住所（都道府県・市区町村） */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="prefecture"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">都道府県</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {prefectures.map((prefecture) => (
                    <SelectItem key={prefecture} value={prefecture}>
                      {prefecture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">市区町村</FormLabel>
              <FormControl>
                <Input
                  placeholder="渋谷区"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 入力ガイダンス */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">ご入力について：</span>
          入力内容は自動保存されます。必須項目（<span className="text-red-500">*</span>マーク）を入力してから次のステップにお進みください。
        </p>
      </div>
    </div>
  );
}
