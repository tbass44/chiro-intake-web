'use client';

import { Control, useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IntakeFormData } from '@/lib/validation/intakeSchema';
import { Plus, Trash2 } from 'lucide-react';

interface Step2SymptomsProps {
  control: Control<IntakeFormData>;
}

/**
 * Step2Symptoms
 * ------------------------------------------------------
 * 主訴・症状を「複数入力」するための Step2 UI。
 *
 * ・useFieldArray を使用
 * ・主訴は無制限に追加可能
 * ・最低1件は必須（削除不可）
 */
export function Step2Symptoms({ control }: Step2SymptomsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'symptoms',
  });

  return (
    <div className="space-y-8">

      {/* =========================
          主訴・症状（複数）
         ========================= */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-lg p-4 space-y-4 bg-white"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              主訴・症状 {index + 1}
            </h3>

            {/* 削除ボタン（1件のみの場合は不可） */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* 主訴名 */}
          <FormField
            control={control}
            name={`symptoms.${index}.symptom`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>主訴・症状 <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="例：首の痛み、腰のだるさ"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 発症のしかた */}
          <FormField
            control={control}
            name={`symptoms.${index}.onset`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>発症のしかた</FormLabel>
                <Select
                  value={field.value ?? ''}
                  onValueChange={(v) =>
                    field.onChange(v === '' ? null : v)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="acute">急性（急に出た）</SelectItem>
                    <SelectItem value="chronic">慢性（徐々に出てきた）</SelectItem>
                    <SelectItem value="unknown">わからない</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* 痛みレベル */}
          <FormField
            control={control}
            name={`symptoms.${index}.severity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>つらさの程度</FormLabel>
                <Select
                  value={field.value?.toString() ?? ''}
                  onValueChange={(v) =>
                    field.onChange(v === '' ? null : Number(v))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">軽い</SelectItem>
                    <SelectItem value="2">やや気になる</SelectItem>
                    <SelectItem value="3">つらい</SelectItem>
                    <SelectItem value="4">かなりつらい</SelectItem>
                    <SelectItem value="5">非常につらい</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* 本人が思う原因 */}
          <FormField
            control={control}
            name={`symptoms.${index}.perceivedCause`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>思い当たる原因</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="例：デスクワーク、運動不足 など"
                    value={field.value ?? ''}
                    // ↑ null の場合は空文字に変換
                    onChange={(e) =>
                      field.onChange(e.target.value || null)
                      // ↑ 空文字なら null として保存
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}

      {/* 追加ボタン */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            symptom: '',
            onset: null,
            severity: null,
            perceivedCause: null,
          })
        }
      >
        <Plus className="h-4 w-4 mr-2" />
        主訴・症状を追加
      </Button>

      {/* =========================
          これまでの治療歴
         ========================= */}
      <FormField
        control={control}
        name="previousTreatments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>これまでの治療歴</FormLabel>
            <FormControl>
              <Textarea
                placeholder="例：整形外科、接骨院、整体など"
                {...field}
              />
            </FormControl>
            <FormDescription>
              同じ症状で受けた治療があればご記入ください
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
