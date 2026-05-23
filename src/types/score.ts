import type { ScoreBreakdown } from './index';

export interface ApiScoreFactor {
  points: number;
  maxPoints: number;
  [key: string]: unknown;
}

export interface ApiScore {
  score: number;
  minScore: number;
  maxScore: number;
  grade: string;
  breakdown: Record<string, ApiScoreFactor>;
  lastCalculatedAt: string;
}

export function toUiScoreBreakdown(score: ApiScore): ScoreBreakdown[] {
  return Object.entries(score.breakdown ?? {}).map(([key, factor]) => ({
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase()),
    points: factor.points,
    maxPoints: factor.maxPoints,
  }));
}
