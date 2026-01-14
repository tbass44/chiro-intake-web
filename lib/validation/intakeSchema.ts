import { z } from 'zod';

export const basicInfoSchema = z.object({
  name: z.string().min(1, '氏名を入力してください'),
  furigana: z.string().min(1, 'ふりがなを入力してください'),
  dob: z.string()
    .min(1, '生年月日を入力してください')
    .refine((date) => {
      const d = new Date(date);
      return d < new Date() && d > new Date('1900-01-01');
    }, '有効な過去の日付を入力してください'),
  sex: z.enum(['男', '女', 'その他', '回答しない']),
  phone: z.string()
    .min(1, '電話番号を入力してください')
    .regex(/^[0-9\-]+$/, '正しい電話番号形式で入力してください'),
  email: z.string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレス形式で入力してください'),
  prefecture: z.string().optional(),
  city: z.string().optional(),
});

export const symptomsSchema = z.object({
  chiefComplaint: z.string().min(1, '主訴を入力してください'),
  onset: z.enum(['日', '週', '月', '年']),
  painScale: z.number().min(0).max(10),
  aggravatingFactors: z.array(z.string()),
  relievingFactors: z.string().optional(),
  previousTreatments: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  medicalHistory: z.string().optional(),
  injuries: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  surgeries: z.string().optional(),
});

export const lifestyleSchema = z.object({
  sleepHours: z.number().min(0).max(12),
  stressLevel: z.number().min(0).max(10),
  exerciseFreq: z.enum(['ほぼなし', '週1-2', '週3-4', 'ほぼ毎日']),
  deskHours: z.number().min(0).max(16),
  waterIntake: z.number().min(0).max(5),
  smoking: z.boolean(),
  alcohol: z.enum(['なし', 'ときどき', '週数回', '毎日']),
  goal: z.string().min(1, '来院目的・達成したいことを入力してください'),
  consent: z.boolean().refine((val) => val === true, 'プライバシーポリシーへの同意が必要です'),
});

export const intakeFormSchema = basicInfoSchema
  .merge(symptomsSchema)
  .merge(medicalHistorySchema)
  .merge(lifestyleSchema);

export type IntakeFormData = z.infer<typeof intakeFormSchema>;