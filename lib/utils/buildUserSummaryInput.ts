// lib/utils/buildUserSummaryInput.ts

import { UserSummaryInput } from '@/lib/types/userSummary';

export function buildUserSummaryInput(payload: Record<string, any>): UserSummaryInput {
  return {
    mainConcern: payload.mainConcern ?? undefined,
    onset: payload.onset ?? undefined,

    severityLevel: mapSeverity(payload.severity),
    sleep: mapSleep(payload.sleepQuality),
    stress: mapStress(payload.stressLevel),
  };
}

/**
 * 数値 → 主観レベルに変換
 * ※ ユーザー向けなので細かすぎない
 */
function mapSeverity(v?: number): UserSummaryInput['severityLevel'] {
  if (v == null) return undefined;
  if (v >= 7) return 'high';
  if (v >= 4) return 'medium';
  return 'low';
}

function mapSleep(v?: number): UserSummaryInput['sleep'] {
  if (v == null) return undefined;
  if (v <= 3) return 'poor';
  if (v <= 6) return 'normal';
  return 'good';
}

function mapStress(v?: number): UserSummaryInput['stress'] {
  if (v == null) return undefined;
  if (v >= 7) return 'high';
  if (v >= 4) return 'normal';
  return 'low';
}
