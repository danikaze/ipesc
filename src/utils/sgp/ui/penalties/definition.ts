export type PenaltyTier = 1 | 2 | 3 | 4 | 5;
export type PenaltyMultiplier = 1 | 2 | 3;

export type PenaltyQuerier = (
  tier: PenaltyTier,
  multiplier?: PenaltyMultiplier
) => { secs: number; points: number } | undefined;

export function getPenaltyQuerier(circuit: string): PenaltyQuerier | undefined {
  const tiers = PENALTIES[circuit];
  if (!tiers) return undefined;

  return (tier, multiplier = 1) => {
    return {
      secs: tiers[tier - 1],
      points: PENALTY_POINTS[tier] * multiplier,
    };
  };
}

export const FASTEST_LAP_POINTS = 1;

// circuit => seconds per tier
const PENALTIES: Record<string, number[]> = {
  Kyalami: [5, 15, 30, 50, 69],
  COTA: [5, 15, 37, 62, 86],
  'Brands Hatch': [5, 15, 24, 41, 57],
  Barcelona: [5, 15, 31, 51, 71],
  Misano: [5, 15, 27, 46, 64],
  'Red Bull Ring': [5, 15, 26, 43, 60],
  'Paul Ricard': [5, 15, 33, 56, 78],
  Hungaroring: [5, 15, 30, 51, 71],
  'Watkins Glen': [5, 15, 60, 51, 71],
  Spa: [5, 15, 40, 67, 94],
};

// tier => pp
const PENALTY_POINTS = {
  1: 1,
  2: 2,
  3: 4,
  4: 5,
  5: 6,
};
