/** Quy đổi số câu đúng (0-40) sang Band điểm IELTS Reading/Listening. */
export const BAND_TABLE: { min: number; max: number; band: number }[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 20, max: 22, band: 5.5 },
  { min: 16, max: 19, band: 5.0 },
  { min: 13, max: 15, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 7, max: 9, band: 3.5 },
  { min: 5, max: 6, band: 3.0 },
  { min: 3, max: 4, band: 2.5 },
  { min: 2, max: 2, band: 2.0 },
  { min: 1, max: 1, band: 1.0 },
  { min: 0, max: 0, band: 0.0 },
];

export function rawToBand(correct: number): number {
  const row = BAND_TABLE.find((r) => correct >= r.min && correct <= r.max);
  return row ? row.band : 0;
}
