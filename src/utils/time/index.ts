/**
 * Converts milliseconds to days, rounding up to the next whole number
 * @param milliseconds The time in milliseconds
 * @returns The number of days (rounded up)
 */
export const millisecondsToRoundedDays = (milliseconds: number): number => {
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

  const days = milliseconds / MILLISECONDS_PER_DAY

  return Math.ceil(days)
}
