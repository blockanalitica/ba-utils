type BaseFractionOptions = {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Fraction digit options for formatters. At least one field is required.
 */
export type FractionOptions = {
  [K in keyof BaseFractionOptions]-?: Required<Pick<BaseFractionOptions, K>> &
    Partial<Pick<BaseFractionOptions, Exclude<keyof BaseFractionOptions, K>>>
}[keyof BaseFractionOptions]
