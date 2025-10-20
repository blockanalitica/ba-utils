/**
 * Formats a decimal number as a percentage with the % symbol (e.g., 0.5 → "50%", 0.1234 → "12.34%").
 *
 * @param options - Configuration object for percentage formatting
 * @param options.value - The decimal number to format (e.g., 0.5 for 50%, 1 for 100%)
 * @param options.minimumFractionDigits - Minimum number of decimal places to display (default: 0)
 * @param options.maximumFractionDigits - Maximum number of decimal places to display (default: 2)
 *
 * @returns Formatted percentage string, empty string for invalid values, or "<0.01%" for very small values
 *
 * @example
 * // Basic usage
 * formatPercentage({ value: 0.5 }) // "50%"
 * formatPercentage({ value: 0.1234 }) // "12.34%"
 * formatPercentage({ value: 1 }) // "100%"
 * formatPercentage({ value: 1.5 }) // "150%"
 *
 * // Negative percentages
 * formatPercentage({ value: -0.25 }) // "-25%"
 *
 * // Custom precision
 * formatPercentage({ value: 0.5, minimumFractionDigits: 2 }) // "50.00%"
 * formatPercentage({ value: 0.123456, maximumFractionDigits: 4 }) // "12.3456%"
 * formatPercentage({ value: 0.123456, maximumFractionDigits: 0 }) // "12%"
 *
 * // Very small values
 * formatPercentage({ value: 0.00009 }) // "<0.01%"
 * formatPercentage({ value: 0.0001 }) // "0.01%"
 *
 * // Invalid values
 * formatPercentage({ value: null }) // "-"
 * formatPercentage({ value: NaN }) // "-"
 *
 * @remarks
 * - Multiplies the input value by 100 to convert decimal to percentage
 * - Values with absolute value < 0.01% display as "<0.01%" (both positive and negative)
 * - Returns "-" for null, undefined, or NaN values
 * - Uses en-US locale formatting with thousands separators for large values
 * - Supports negative percentages with proper sign handling
 * - Handles Infinity as "∞%" and -Infinity as "-∞%"
 */

type Options = {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function formatPercentage(value: number, options: Options = {}): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '-'
  }

  const absPercent = Math.abs(value * 100)

  // If less than 0.01%, show "<0.01%"
  if (absPercent > 0 && absPercent < 0.01) {
    return '<0.01%'
  }

  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value)
}
