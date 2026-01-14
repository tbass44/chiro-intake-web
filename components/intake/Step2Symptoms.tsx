'use client';

import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { IntakeFormData } from '@/lib/types/intake';

interface Step2SymptomsProps {
  control: Control<IntakeFormData>;
}

const aggravatingFactorOptions = [
  '長時間座位',
  '長時間立位',
  '屈曲',
  '伸展',
  '睡眠不足',
  '冷え'
];

export function Step2Symptoms({ control }: Step2SymptomsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="chiefComplaint"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              主訴・症状の詳細 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="どのような症状でお困りですか？痛みの部位、程度、性質などを詳しくお聞かせください。"
                className="min-h-32 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              例：腰の右側に鈍い痛みがあり、座ってから立ち上がる時に特に痛みます
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="onset"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">発症時期</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="日">数日前から</SelectItem>
                  <SelectItem value="週">数週間前から</SelectItem>
                  <SelectItem value="月">数ヶ月前から</SelectItem>
                  <SelectItem value="年">数年前から</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="painScale"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                痛みの程度 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0: 痛みなし</span>
                    <span className="font-semibold text-lg text-gray-900">
                      {field.value}
                    </span>
                    <span>10: 我慢できない</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="aggravatingFactors"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-semibold">痛みが悪化する要因</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {aggravatingFactorOptions.map((factor) => (
                <FormField
                  key={factor}
                  control={control}
                  name="aggravatingFactors"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(factor)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), factor]
                              : (field.value || []).filter((value) => value !== factor);
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {factor}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="relievingFactors"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">痛みが楽になる方法</FormLabel>
            <FormControl>
              <Textarea
                placeholder="どのような時に痛みが楽になりますか？"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              例：温める、安静にする、特定の姿勢をとる など
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="previousTreatments"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">これまでの治療歴</FormLabel>
            <FormControl>
              <Textarea
                placeholder="同じ症状で他の治療院や病院を受診されましたか？"
                className="min-h-24 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              整形外科、接骨院、マッサージ、鍼灸など
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">症状について：</span>
          詳しい症状の情報をいただくことで、より適切な治療プランをご提案できます。気になることがあれば遠慮なくご記入ください。
        </p>
      </div>
    </div>
  );
}