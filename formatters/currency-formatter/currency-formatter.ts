import { FractionOptions } from '../types.js'

/**
 * Formats a number as currency with compact notation (e.g., $1.5K, $2.3M, $1.2B).
 *
 * @param value - The number or string to format. Accepts integers, decimals, and numeric strings.
 * @param currency - The currency code to use (default: "USD"). Supports: USD, USDC, DAI, SKY
 * @param options - Configuration object for formatting precision
 * @param options.minimumFractionDigits - Minimum number of decimal places to display (default: 2)
 * @param options.maximumFractionDigits - Maximum number of decimal places to display (default: 2)
 *
 * @returns Formatted currency string with compact notation or "-" for invalid values
 *
 * @throws {Error} When currency is an empty string
 * @throws {Error} When currency contains only whitespace
 * @throws {Error} When currency is not in the supported list
 *
 * @example
 * // Basic usage (USD)
 * formatCurrencyCompact(1500) // "$1.50K"
 * formatCurrencyCompact(1234567) // "$1.23M"
 * formatCurrencyCompact(1000000000) // "$1.00B"
 *
 * // Cryptocurrencies
 * formatCurrencyCompact(1500, "USDC") // "USDC 1.50K"
 * formatCurrencyCompact(1234567, "DAI") // "DAI 1.23M"
 * formatCurrencyCompact(1000000000, "SKY") // "SKY 1.00B"
 *
 * // Decimal values
 * formatCurrencyCompact(1234.56) // "$1.23K"
 * formatCurrencyCompact(99.99) // "$99.99"
 *
 * // String input
 * formatCurrencyCompact("1000") // "$1.00K"
 * formatCurrencyCompact("1234.56") // "$1.23K"
 *
 * // Custom precision
 * formatCurrencyCompact(1234, "USD", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) // "$1K"
 * formatCurrencyCompact(1234, "USD", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) // "$1.234K"
 *
 * // Negative values
 * formatCurrencyCompact(-1500) // "-$1.50K"
 *
 * // Invalid values
 * formatCurrencyCompact(null) // "-"
 * formatCurrencyCompact("abc") // "-"
 *
 * // Edge cases that throw errors
 * formatCurrencyCompact(1000, "") // throws Error: "Currency shouldn't be empty string"
 * formatCurrencyCompact(1000, "   ") // throws Error: "Currency shouldn't be empty string"
 * formatCurrencyCompact(1000, "BTC") // throws Error: "Unsupported currency: BTC. Supported currencies: USD, USDC, DAI, SKY"
 *
 * @remarks
 * - Supports USD and common stablecoins/crypto (USDC, DAI, SKY)
 * - USD uses en-US locale with $ symbol
 * - Crypto currencies use de-DE locale (symbol appears after the number)
 * - Numbers below 1000 are not compacted (e.g., $999.99)
 * - Supports negative values with proper sign handling
 * - Returns "-" for null, undefined, empty strings, or invalid numeric values
 * - Handles Infinity as "$∞" and -Infinity as "-$∞"
 * - Both minimumFractionDigits and maximumFractionDigits default to 2
 */
export function formatCurrencyCompact(
  value: number | string,
  currency: string = 'USD',
  options?: FractionOptions
): string {
  return formatCurrency(value, 'compact', currency, options)
}

/**
 * Formats a number as currency in full with thousand separators (e.g., $1,500.00, $2,300,000.00, $1,200,000,000.00).
 *
 * @param value - The number or string to format. Accepts integers, decimals, and numeric strings.
 * @param currency - The currency code to use (default: "USD"). Supports: USD, USDC, DAI, SKY
 * @param options - Configuration object for formatting precision
 * @param options.minimumFractionDigits - Minimum number of decimal places to display (default: 2)
 * @param options.maximumFractionDigits - Maximum number of decimal places to display (default: 2)
 *
 * @returns Formatted currency string with thousand separators or "-" for invalid values
 *
 * @throws {Error} When currency is an empty string
 * @throws {Error} When currency contains only whitespace
 *
 * @example
 * // Basic usage (USD)
 * formatCurrencyFull(1500) // "$1,500.00"
 * formatCurrencyFull(1234567) // "$1,234,567.00"
 * formatCurrencyFull(1000000000) // "$1,000,000,000.00"
 *
 * // Cryptocurrencies
 * formatCurrencyFull(1500, "USDC") // "1,500.00 USDC"
 * formatCurrencyFull(1234567, "DAI") // "1,234,567.00 DAI"
 * formatCurrencyFull(1000000000, "SKY") // "1,000,000,000.00 SKY"
 *
 * // Decimal values
 * formatCurrencyFull(1234.56) // "$1,234.56"
 * formatCurrencyFull(99.99) // "$99.99"
 *
 * // String input
 * formatCurrencyFull("1000") // "$1,000.00"
 * formatCurrencyFull("1234.56") // "$1,234.56"
 *
 * // Custom precision
 * formatCurrencyFull(1234, "USD", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) // "$1,234"
 * formatCurrencyFull(1234.5, "USD", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) // "$1,234.500"
 *
 * // Negative values
 * formatCurrencyFull(-1500) // "-$1,500.00"
 *
 * // Invalid values
 * formatCurrencyFull(null) // "-"
 * formatCurrencyFull("abc") // "-"
 *
 * // Edge cases that throw errors
 * formatCurrencyFull(1000, "") // throws Error: "Currency shouldn't be empty string"
 * formatCurrencyFull(1000, "   ") // throws Error: "Currency shouldn't be empty string"
 *
 * @remarks
 * - Supports USD and common stablecoins/crypto (USDC, DAI, SKY)
 * - USD uses en-US locale with $ symbol before the number (e.g., $1,500.00)
 * - Crypto currencies have symbol after the number (e.g., 1,500.00 USDC)
 * - All numbers are formatted in full with comma as thousand separator
 * - No compact notation (all digits are displayed)
 * - Supports negative values with proper sign handling
 * - Returns "-" for null, undefined, empty strings, or invalid numeric values
 * - Handles Infinity as "$∞" and -Infinity as "-$∞"
 * - Both minimumFractionDigits and maximumFractionDigits default to 2
 * - Uses en-US locale formatting (period as decimal separator, comma as thousand separator)
 * - Useful for displaying precise financial values in tables, invoices, or detailed reports
 */
export function formatCurrencyFull(
  value: number | string,
  currency: string = 'USD',
  options?: FractionOptions
): string {
  return formatCurrency(value, 'standard', currency, options)
}

function formatCurrency(
  value: number | string,
  notation: 'standard' | 'compact',
  currency: string = 'USD',
  options?: FractionOptions
): string {
  // Edge case: empty string or whitespace-only currency
  if (currency === '' || currency.trim() === '') {
    throw new Error("Currency shouldn't be empty string")
  }

  // Edge case: unsupported currency
  if (!currency || currency.trim() === '') {
    throw new Error(
      `Unsupported currency: ${currency}. Currency shouldn't be empty string`
    )
  }

  // Edge case: null, undefined, or empty value
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const numValue = typeof value === 'number' ? value : Number(value)

  // Edge case: NaN (invalid numeric string)
  if (isNaN(numValue)) {
    return '-'
  }

  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options ?? {}

  if (maximumFractionDigits >= 1) {
    const absValue = Math.abs(numValue)
    const threshold = 1 / Math.pow(10, maximumFractionDigits)

    if (absValue > 0 && absValue < threshold) {
      const formattedThreshold = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: maximumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
      }).format(threshold)

      if (currency === 'USD') {
        return `<${formattedThreshold}`
      }
      const withoutCurrency = formattedThreshold.replace('$', '')
      return `<${withoutCurrency} ${currency}`
    }
  }

  const formattedValue = new Intl.NumberFormat('en-US', {
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
    style: 'currency',
    currency: 'USD',
  }).format(numValue)

  if (currency === 'USD') {
    return formattedValue
  }

  const formattedValueWithoutCurrency = formattedValue.replace('$', '')
  return `${formattedValueWithoutCurrency} ${currency}`
}
