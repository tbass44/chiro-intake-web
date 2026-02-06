'use client';

import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { IntakeFormData } from '@/lib/types/intake';

interface Step4LifestyleProps {
  control: Control<IntakeFormData>;
}

/**
 * Step4Lifestyle
 * ------------------------------------------------------
 * 生活習慣・目標入力ステップ
 * ・追加項目（布団・枕・肌）はすべて任意
 * ・goal / consent は必須
 */
export function Step4Lifestyle({ control }: Step4LifestyleProps) {
  const beddingOptions = ['硬め', '普通', '柔らかめ' , '低反発', '高反発', 'その他'] as const;
  const pillowOptions = ['硬め', '硬さ普通', '柔らかめ' , '低い', '高さ普通', '高い', 'その他'] as const;
  const skinOptions = ['乾燥', '脂性', 'ニキビ', 'シワ', 'シミ', 'むくみ', '痒み', 'アトピー', '赤み', 'アレルギー', 'その他'] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="sleepHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">睡眠時間</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    min={0}
                    max={12}
                    step={0.5}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0時間</span>
                    <span className="font-semibold text-lg text-gray-900">
                      {field.value}時間
                    </span>
                    <span>12時間</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>平均的な睡眠時間をお選びください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="stressLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">ストレスレベル</FormLabel>
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
                    <span>0: なし</span>
                    <span className="font-semibold text-lg text-gray-900">
                      {field.value}
                    </span>
                    <span>10: 非常に高い</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>日常的に感じているストレスの程度</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="exerciseFreq"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">運動頻度</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ほぼなし">ほぼなし</SelectItem>
                  <SelectItem value="週1-2">週1-2回</SelectItem>
                  <SelectItem value="週3-4">週3-4回</SelectItem>
                  <SelectItem value="ほぼ毎日">ほぼ毎日</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>30分以上の運動の頻度</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 布団 */}
        <FormField
          control={control}
          name="beddingType"
          render={() => (
            <FormItem>
              <FormLabel>布団の種類（複数選択可）</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {beddingOptions.map((item) => (
                  <FormField
                    key={item}
                    control={control}
                    name="beddingType"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              const next = checked
                                ? [...(field.value ?? []), item]
                                : (field.value ?? []).filter((v) => v !== item);
                              field.onChange(next);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

      {/* 枕 */}
      <FormField
        control={control}
        name="pillowType"
        render={() => (
          <FormItem>
            <FormLabel>枕の種類（複数選択可）</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pillowOptions.map((item) => (
                <FormField
                  key={item}
                  control={control}
                  name="pillowType"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...(field.value ?? []), item]
                              : (field.value ?? []).filter((v) => v !== item);
                            field.onChange(next);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormItem>
        )}
      />

      {/* 肌 */}
      <FormField
        control={control}
        name="skinCondition"
        render={() => (
          <FormItem>
            <FormLabel>肌の状態（複数選択可）</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {skinOptions.map((item) => (
                <FormField
                  key={item}
                  control={control}
                  name="skinCondition"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...(field.value ?? []), item]
                              : (field.value ?? []).filter((v) => v !== item);
                            field.onChange(next);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="waterIntake"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">水分摂取量</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0L</span>
                    <span className="font-semibold text-lg text-gray-900">
                      {field.value}L/日
                    </span>
                    <span>5L</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>1日あたりの水分摂取量（水・お茶など）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="alcohol"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">飲酒頻度</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="なし">なし</SelectItem>
                  <SelectItem value="ときどき">ときどき</SelectItem>
                  <SelectItem value="週数回">週数回</SelectItem>
                  <SelectItem value="毎日">毎日</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="smoking"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base font-semibold">喫煙</FormLabel>
              <FormDescription>現在喫煙をされていますか？</FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              来院目的・達成したいこと <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="施術を通じて達成したい目標や改善したい点をお聞かせください"
                className="min-h-32 text-base resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              例：痛みなく仕事ができるようになりたい、スポーツを再開したい、日常生活を快適に過ごしたいなど
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="consent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-semibold">
                プライバシーポリシーに同意します <span className="text-red-500">*</span>
              </FormLabel>
              <FormDescription className="text-sm">
                ご入力いただいた情報は当院のプライバシーポリシーに基づき安全に取り扱います。
                施術以外の目的で使用することはありません。
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">施術計画について：</span>
          生活習慣の情報は、お客様に最適な施術計画を立てるために重要です。
          正確な情報をご提供いただくことで、より効果的な施術をご提案できます。
        </p>
      </div>
    </div>
  );
}
