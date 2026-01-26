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

  // 電話番号：必須
  // ・数字とハイフンのみ許可
  phone: z.string()
    .min(1, '電話番号を入力してください')
    .regex(/^[0-9\-]+$/, '正しい電話番号形式で入力してください'),

  // メールアドレス：必須
  // ・メール形式チェックあり
  email: z.string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレス形式で入力してください'),

  // 都道府県：任意
  prefecture: z.string().optional(),

  // 市区町村：任意
  city: z.string().optional(),
});

/* =========================================================
 * Step2：症状に関する情報
 * ======================================================= */
export const symptomsSchema = z.object({
  // 主訴（一番つらい症状）：必須
  chiefComplaint: z.string().min(1, '主訴を入力してください'),

  // いつから症状があるか（選択式）
  onset: z.enum(['日', '週', '月', '年']),

  // 痛みの強さ：0〜10 の数値
  painScale: z.number().min(0).max(10),

  // 悪化要因：複数選択を想定（配列）
  aggravatingFactors: z.array(z.string()),

  // 楽になる要因：任意
  relievingFactors: z.string().optional(),

  // 過去の治療歴：任意
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

  // デスクワーク時間：0〜16時間
  deskHours: z.number().min(0).max(16),

  // 水分摂取量：0〜5（単位はUI側で管理）
  waterIntake: z.number().min(0).max(5),

  // 喫煙の有無：true / false
  smoking: z.boolean(),

  // 飲酒頻度：選択式
  alcohol: z.enum(['なし', 'ときどき', '週数回', '毎日']),

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
