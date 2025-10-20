/**
 * Options for formatting numbers.
 */
type FormatNumberOptions = {
  /** Minimum number of decimal places to display (default: 0) */
  minimumFractionDigits?: number
  /** Maximum number of decimal places to display (default: 2) */
  maximumFractionDigits?: number
}

/**
 * Formats a number using compact notation (e.g., 1.5K, 2.3M, 1.2B).
 *
 * @param value - The number or string to format. Accepts integers, decimals, and numeric strings.
 * @param options - Configuration object for number formatting
 * @param options.minimumFractionDigits - Minimum number of decimal places to display (default: 0)
 * @param options.maximumFractionDigits - Maximum number of decimal places to display (default: 2)
 *
 * @returns Formatted string with compact notation or "-" for invalid values
 *
 * @example
 * // Basic usage
 * formatNumberCompact(1500) // "1.5K"
 * formatNumberCompact(1234567) // "1.23M"
 * formatNumberCompact(1000000000) // "1B"
 *
 * // Decimal values
 * formatNumberCompact(1234.56) // "1.23K"
 * formatNumberCompact(999.99) // "999.99"
 *
 * // String input
 * formatNumberCompact("1000") // "1K"
 * formatNumberCompact("1.5e6") // "1.5M"
 *
 * // Custom precision
 * formatNumberCompact(1234, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // "1.23K"
 * formatNumberCompact(1000, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) // "1K"
 *
 * // Negative values
 * formatNumberCompact(-1500) // "-1.5K"
 *
 * // Invalid values
 * formatNumberCompact(null) // "-"
 * formatNumberCompact("abc") // "-"
 *
 * @remarks
 * - Uses en-US locale formatting
 * - Numbers below 1000 are not compacted (e.g., 999 returns "999")
 * - Supports negative numbers (e.g., -1500 returns "-1.5K")
 * - Handles Infinity as "∞" and -Infinity as "-∞"
 * - Returns "-" for null, undefined, empty strings, or invalid values
 * - Uses Number internally, so it supports decimals but has precision limits
 * - minimumFractionDigits defaults to 0, maximumFractionDigits defaults to 2
 *
 * - **Assumption**: Values will not exceed Number.MAX_SAFE_INTEGER (9,007,199,254,740,991).
 *   Numbers beyond this threshold may lose precision. For large integer values that require
 *   exact precision, consider using BigInt-based formatting instead.
 */
export function formatNumberCompact(
  value: number | string,
  options: FormatNumberOptions = {}
): string {
  return formatNumber(
    value,
    { notation: 'compact', compactDisplay: 'short' },
    options
  )
}

/**
 * Formats a number in full with thousand separators (e.g., 1,500, 2,300,000, 1,200,000,000).
 *
 * @param value - The number or string to format. Accepts integers, decimals, and numeric strings.
 * @param options - Configuration object for number formatting
 * @param options.minimumFractionDigits - Minimum number of decimal places to display (default: 0)
 * @param options.maximumFractionDigits - Maximum number of decimal places to display (default: 2)
 *
 * @returns Formatted string with thousand separators or "-" for invalid values
 *
 * @example
 * // Basic usage
 * formatNumberFull(1500) // "1,500"
 * formatNumberFull(1234567) // "1,234,567"
 * formatNumberFull(1000000000) // "1,000,000,000"
 *
 * // Decimal values
 * formatNumberFull(1234.56) // "1,234.56"
 * formatNumberFull(999.99) // "999.99"
 *
 * // String input
 * formatNumberFull("1000") // "1,000"
 * formatNumberFull("1.5e6") // "1,500,000"
 *
 * // Custom precision
 * formatNumberFull(1234, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // "1,234.00"
 * formatNumberFull(1234.5678, { minimumFractionDigits: 0, maximumFractionDigits: 4 }) // "1,234.5678"
 *
 * // Negative values
 * formatNumberFull(-1500) // "-1,500"
 *
 * // Invalid values
 * formatNumberFull(null) // "-"
 * formatNumberFull("abc") // "-"
 *
 * @remarks
 * - Uses en-US locale formatting with comma as thousand separator
 * - All numbers are formatted in full (no compact notation)
 * - Supports negative numbers (e.g., -1500 returns "-1,500")
 * - Handles Infinity as "∞" and -Infinity as "-∞"
 * - Returns "-" for null, undefined, empty strings, or invalid values
 * - Uses Number internally, so it supports decimals but has precision limits
 * - minimumFractionDigits defaults to 0, maximumFractionDigits defaults to 2
 * - Useful for displaying precise values in tables, financial data, or detailed reports
 *
 * - **Assumption**: Values will not exceed Number.MAX_SAFE_INTEGER (9,007,199,254,740,991).
 *   Numbers beyond this threshold may lose precision. For large integer values that require
 *   exact precision, consider using BigInt-based formatting instead.
 */
export function formatNumberFull(
  value: number | string,
  options: FormatNumberOptions = {}
): string {
  return formatNumber(value, { notation: 'standard' }, options)
}

type NotationOptions =
  | {
      notation: 'compact'
      compactDisplay: 'short'
    }
  | {
      notation: 'standard'
    }

function formatNumber(
  value: number | string,
  notationOptions: NotationOptions,
  options: FormatNumberOptions
): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const numValue = typeof value === 'number' ? value : Number(value)

  if (isNaN(numValue)) {
    return '-'
  }

  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options

  return new Intl.NumberFormat('en-US', {
    ...notationOptions,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numValue)
}
