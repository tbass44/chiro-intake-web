/**
 * intakeSchema.ts
 *
 * AIヒアリングナビフォーム全体の「入力ルール定義ファイル」
 *
 * 役割：
 * ・各入力項目が「必須か／任意か」を決める
 * ・入力できる値の種類・範囲を制限する
 * ・バリデーションエラー時のメッセージを定義する
 *
 * このファイルは UI（見た目）には一切関与しない。
 * 「正しい問診データとは何か？」だけを定義するルールブック。
 *
 * react-hook-form と zodResolver により、
 * フォーム送信時に自動でチェックされる。
 *
 * ※ 基本的に UI 側を触らず、
 *    ・必須/任意を変えたい
 *    ・数値範囲を変えたい
 *    ・エラーメッセージを変えたい
 *    ときだけ編集すればOK。
 */

import { z } from 'zod';

/* =========================================================
 * Step1：基本情報（氏名・連絡先など）
 * ======================================================= */
export const basicInfoSchema = z.object({
  // 氏名：必須（空文字不可）
  name: z.string().min(1, '氏名を入力してください'),
  // ふりがな：必須
  furigana: z.string().min(1, 'ふりがなを入力してください'),
  // 生年月日：必須
  // ・1900年以降
  // ・今日より過去の日付のみ許可
  dob: z.string()
    .min(1, '生年月日を入力してください')
    .refine((date) => {
      const d = new Date(date);
      return d < new Date() && d > new Date('1900-01-01');
    }, '有効な過去の日付を入力してください'),
  // 性別：選択肢は enum で固定
  sex: z.enum(['男', '女', 'その他', '回答しない']),
  // 職業
  occupation: z.string().optional(),
  // 電話番号
  // ・数字とハイフンのみ許可
  phone: z.string()
  .regex(/^[0-9\-]+$/, '正しい電話番号形式で入力してください')
  .optional(),
  // メールアドレス：必須
  // ・メール形式チェックあり
  email: z.string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレス形式で入力してください'),
  // 都道府県：任意
  prefecture: z.string().optional(),
  // 市区町村：任意
  city: z.string().optional(),
    // 当院を知ったきっかけ
    referralSource: z.enum([
      '紹介',
      'Google検索',
      'SNS',
      'まいぷれ',
      'チラシ',
      'その他',
    ]), 
    // 身長（cm）※必須
    height: z
      .number({
        required_error: '身長を入力してください',
        invalid_type_error: '身長を数値で入力してください',
      })
      .min(100, '身長は100cm以上で入力してください')
      .max(220, '身長は220cm以下で入力してください'),
    // 体重（kg・任意）
    weight: z.number()
    .min(20, '体重は20kg以上で入力してください')
    .max(200, '体重は200kg以下で入力してください')
    .optional(),
});

/* =========================================================
 * Step2：症状に関する情報
 * ======================================================= */
// 主訴1件分の schema
export const symptomItemSchema = z.object({
  id: z.string(),
  // ここだけ必須
  symptom: z
  .string()
  .min(1, '主訴・症状を入力してください'),
  onset: z.enum(['acute', 'chronic', 'unknown']).nullable().optional(),
  severity: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]).nullable().optional(),
  perceivedCause: z.string().nullable().optional(),
});
// Step2 全体
export const symptomsSchema = z.object({
  // 単一主訴 → 複数主訴配列
  symptoms: z
    .array(symptomItemSchema)
    .min(1, '主訴・症状を1つ以上入力してください'),
  previousTreatments: z.string().optional(),
});

/* =========================================================
 * Step3：既往歴・医療情報
 * ======================================================= */
export const medicalHistorySchema = z.object({
  // 既往歴：任意
  medicalHistory: z.string().optional(),

  // 外傷歴：任意
  injuries: z.string().optional(),

  // 服用中の薬：任意
  medications: z.string().optional(),

  // アレルギー：任意
  allergies: z.string().optional(),

  // 手術歴：任意
  surgeries: z.string().optional(),

  // 金属・人工関節の有無
  hasImplant: z.boolean().optional().default(false),

  // 部位（hasImplant === true のときのみ使う）
  implantDetail: z.string().optional(),
});

/* =========================================================
 * Step4：生活習慣・同意
 * ======================================================= */
export const lifestyleSchema = z.object({
  // 睡眠時間：0〜12時間
  sleepHours: z.number().min(0).max(12),

  // ストレス度：0〜10
  stressLevel: z.number().min(0).max(10),

  // 運動頻度：選択式
  exerciseFreq: z.enum(['ほぼなし', '週1-2', '週3-4', 'ほぼ毎日']),

  // 水分摂取量：0〜5（単位はUI側で管理）
  waterIntake: z.number().min(0).max(5),

  // 喫煙の有無：true / false
  smoking: z.boolean(),

  // 飲酒頻度：選択式
  alcohol: z.enum(['なし', 'ときどき', '週数回', '毎日']),

  // 布団の種類
  beddingType: z
    .array(z.enum(['硬め', '普通', '柔らかめ' , '低反発', '高反発', 'その他']))
    .optional(),

  // 枕の種類
  pillowType: z
    .array(z.enum(['硬め', '硬さ普通', '柔らかめ' , '低い', '高さ普通', '高い', 'その他']))
    .optional(),

  // 肌の状態
  skinCondition: z
    .array(z.enum(['乾燥', '脂性', 'ニキビ', 'シワ', 'シミ', 'むくみ', '痒み', 'アトピー', '赤み', 'アレルギー', 'その他']))
    .optional(),

  // 来院目的・達成したいこと：必須
  goal: z.string().min(1, '来院目的・達成したいことを入力してください'),

  // プライバシーポリシー同意：
  // true でなければ送信不可
  consent: z.boolean().refine(
    (val) => val === true,
    'プライバシーポリシーへの同意が必要です'
  ),
});

/* =========================================================
 * 全 Step の schema を結合した最終フォーム定義
 *
 * どれか1つでもバリデーションエラーがあると
 * フォーム送信はできない。
 * ======================================================= */
export const intakeFormSchema = basicInfoSchema
  .merge(symptomsSchema)
  .merge(medicalHistorySchema)
  .merge(lifestyleSchema);

  /**
 * IntakeFormData
 *
 * intakeFormSchema から自動生成される TypeScript 型。
 * ・フォーム全体の設計図
 * ・useForm<IntakeFormData> で使用
 *
 * Schema と型定義がズレないようにするための安全装置。
 */
export type IntakeFormData = z.infer<typeof intakeFormSchema>;
