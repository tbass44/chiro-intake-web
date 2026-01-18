export interface BasicInfo {
  name: string;
  furigana: string;
  dob: string;
  sex: '男' | '女' | 'その他' | '回答しない';
  occupation?: string;
  phone: string;
  email: string;
  prefecture?: string;
  city?: string;
}

export interface Symptoms {
  chiefComplaint: string;
  onset: '日' | '週' | '月' | '年';
  painScale: number;
  aggravatingFactors: string[];
  relievingFactors?: string;
  previousTreatments?: string;
}

export interface MedicalHistory {
  medicalHistory?: string;
  injuries?: string;
  medications?: string;
  allergies?: string;
  surgeries?: string;
}

export interface Lifestyle {
  sleepHours: number;
  stressLevel: number;
  exerciseFreq: 'ほぼなし' | '週1-2' | '週3-4' | 'ほぼ毎日';
  deskHours: number;
  waterIntake: number;
  smoking: boolean;
  alcohol: 'なし' | 'ときどき' | '週数回' | '毎日';
  goal: string;
  consent: boolean;
}

// IntakeFormData は intakeSchema.ts から生成される型を使用
// 型の一貫性を保つため、ここでは再エクスポートのみ
export type { IntakeFormData } from '@/lib/validation/intakeSchema';

export interface ApiResponse {
  success: boolean;
  message?: string;
  pdfUrl?: string;
  data?: any;
}
