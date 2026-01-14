'use client';

import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntakeFormData } from '@/lib/types/intake';

interface Step3HistoryProps {
  control: Control<IntakeFormData>;
}

export function Step3History({ control }: Step3HistoryProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="medicalHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">既往歴</FormLabel>
            <FormControl>
              <Textarea
                placeholder="これまでにかかった病気や怪我があれば教えてください"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              例：高血圧、糖尿病、ヘルニア、骨折歴など
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="injuries"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">外傷歴</FormLabel>
            <FormControl>
              <Textarea
                placeholder="交通事故、転倒、スポーツでの怪我などがあれば教えてください"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              いつ頃の出来事かも分かる範囲でお聞かせください
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">現在服用中のお薬</FormLabel>
            <FormControl>
              <Textarea
                placeholder="現在服用しているお薬があれば教えてください"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              処方薬・市販薬・サプリメントを含む
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">アレルギー</FormLabel>
            <FormControl>
              <Textarea
                placeholder="薬物アレルギーや食物アレルギーなどがあれば教えてください"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              治療で使用する可能性のある薬剤や材料に関する情報です
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="surgeries"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">手術歴</FormLabel>
            <FormControl>
              <Textarea
                placeholder="これまでに受けた手術があれば教えてください"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              手術名と時期が分かる範囲でお聞かせください
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          <span className="font-semibold">重要：</span>
          既往歴や服薬状況は治療方針に大きく関わります。些細なことでも遠慮なくご記入ください。
          情報は厳重に管理し、治療以外の目的で使用することはありません。
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <span className="font-semibold">ご記入について：</span>
          「特になし」の項目がある場合は空欄のままで構いません。
          思い出せない詳細についても、分かる範囲でのご記入で十分です。
        </p>
      </div>
    </div>
  );
}