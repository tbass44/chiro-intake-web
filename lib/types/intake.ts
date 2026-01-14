export interface BasicInfo {
  name: string;
  furigana: string;
  dob: string;
  sex: '男' | '女' | 'その他' | '回答しない';
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

export interface IntakeFormData extends BasicInfo, Symptoms, MedicalHistory, Lifestyle {}

export interface ApiResponse {
  success: boolean;
  message?: string;
  pdfUrl?: string;
  data?: any;
}