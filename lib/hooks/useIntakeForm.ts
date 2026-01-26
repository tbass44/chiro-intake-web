/**
 * useIntakeForm
 * ------------------------------------------------------
 * フォーム全体を管理するカスタムフック。
 *
 * 【役割】
 * - フォーム状態の管理（react-hook-form）
 * - バリデーション連携（zod）
 * - ステップ管理（次へ / 戻る）
 * - localStorage への自動保存・復元
 *
 * 【このファイルがやらないこと】
 * - UI描画（Input / Button など）
 * - レイアウト制御
 *
 * UI側（Step1Basic など）は、このフックから渡される
 * form / currentStep / nextStep などを使って画面を組み立てる。
 */


'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { intakeFormSchema, type IntakeFormData } from '@/lib/validation/intakeSchema';

// localStorage に保存する際のキー
// フォーム構造を変更した場合は v2 に上げる想定
const STORAGE_KEY = 'intake:v1';

// フォームの初期状態
// 新規入力時、または保存データが無い場合に使われる
const defaultValues: IntakeFormData = {
  name: '',
  furigana: '',
  dob: '',
  sex: '回答しない',
  phone: '',
  email: '',
  prefecture: '',
  city: '',
  chiefComplaint: '',
  onset: '日',
  painScale: 0,
  aggravatingFactors: [],
  relievingFactors: '',
  previousTreatments: '',
  medicalHistory: '',
  injuries: '',
  medications: '',
  allergies: '',
  surgeries: '',
  sleepHours: 7,
  stressLevel: 5,
  exerciseFreq: 'ほぼなし',
  deskHours: 8,
  waterIntake: 1.5,
  smoking: false,
  alcohol: 'なし',
  goal: '',
  consent: false,
  occupation: '',
};

export function useIntakeForm() {
   /**
   * currentStep
   * --------------------------------------------------
   * 現在表示しているステップ番号
   * （1: 基本情報, 2: 症状, ...）
   */
  const [currentStep, setCurrentStep] = useState(1);

  /**
   * isLoaded
   * --------------------------------------------------
   * localStorage からの復元が完了したかどうか。
   * 初期ロード前に自動保存が走らないよう制御するために使用。
   */
  const [isLoaded, setIsLoaded] = useState(false);

    /**
   * react-hook-form 本体
   * --------------------------------------------------
   * - 入力値の管理
   * - zod によるバリデーション
   * - エラー管理
   * をまとめて担当する。
   */
  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues,
    mode: 'onChange', // 入力中にリアルタイムで validation
  });

  /**
   * 初回マウント時に localStorage から
   * 前回の入力内容を復元する。
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        form.reset(data);
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    } finally {
      // 復元完了フラグ 何があっても必ず実行される
      setIsLoaded(true);
    }
  }, [form]);

  /**
   * 入力内容が変更されるたびに localStorage へ自動保存。
   * 途中離脱してもデータが残るようにする。
   */
  useEffect(() => {
    if (!isLoaded) return;

    const subscription = form.watch((data) => {
      // フォームの中身が変わるたびに呼ばれる
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isLoaded]);

  // localStorage の保存データを削除（最初からやり直す場合）
  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  };

  // 次のステップへ進む（最大 5）
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  // 前のステップへ戻る（最小 1）
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // 任意のステップへ移動
  const goToStep = (step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 5)));
  };

  /**
   * 親コンポーネントが使用する公開API
   */
  return {
    form,          // react-hook-form の操作一式
    currentStep,   // 現在のステップ番号
    isLoaded,      // 初期復元が完了したか
    nextStep,      // 次へ
    prevStep,      // 戻る
    goToStep,      // ステップ指定移動
    clearStorage,  // 保存データ削除
  };
}
