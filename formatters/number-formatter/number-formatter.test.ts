import { describe, expect, it } from 'vitest'
import { formatNumberCompact, formatNumberFull } from './number-formatter'

describe('formatNumberCompact', () => {
  describe('given valid numeric inputs', () => {
    it('formats small numbers without compacting', () => {
      expect(formatNumberCompact(123)).toBe('123')
      expect(formatNumberCompact(999)).toBe('999')
    })

    it('formats thousands with K suffix', () => {
      expect(formatNumberCompact(1000)).toBe('1K')
      expect(formatNumberCompact(1500)).toBe('1.5K')
      expect(formatNumberCompact(999999)).toBe('1M')
    })

    it('formats millions with M suffix', () => {
      expect(formatNumberCompact(1000000)).toBe('1M')
      expect(formatNumberCompact(1500000)).toBe('1.5M')
      expect(formatNumberCompact(999999999)).toBe('1B')
    })

    it('formats billions with B suffix', () => {
      expect(formatNumberCompact(1000000000)).toBe('1B')
      expect(formatNumberCompact(1500000000)).toBe('1.5B')
    })

    it('formats trillions with T suffix', () => {
      expect(formatNumberCompact(1000000000000)).toBe('1T')
      expect(formatNumberCompact(1500000000000)).toBe('1.5T')
    })

    it('handles zero correctly', () => {
      expect(formatNumberCompact(0)).toBe('0')
    })

    it('accepts string numeric values', () => {
      expect(formatNumberCompact('1000')).toBe('1K')
      expect(formatNumberCompact('1000000')).toBe('1M')
    })
  })

  describe('given custom fraction digits', () => {
    it('respects minimumFractionDigits parameter', () => {
      expect(
        formatNumberCompact(1000, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('1.00K')
      expect(
        formatNumberCompact(1500, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })
      ).toBe('1.5K')
    })

    it('respects maximumFractionDigits parameter', () => {
      // Very small numbers don't get compacted
      expect(
        formatNumberCompact(1.234, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('1')
      expect(
        formatNumberCompact(1567, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        })
      ).toBe('1.6K')
      expect(
        formatNumberCompact(1567, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3,
        })
      ).toBe('1.567K')
    })

    it('uses default fraction digits when not specified', () => {
      expect(formatNumberCompact(1500)).toBe('1.5K')
      expect(formatNumberCompact(1567)).toBe('1.57K')
    })
  })

  describe('given null, undefined or empty values', () => {
    it('returns dash for null values', () => {
      expect(formatNumberCompact(null as unknown as number)).toBe('-')
    })

    it('returns dash for undefined values', () => {
      expect(formatNumberCompact(undefined as unknown as number)).toBe('-')
    })

    it('returns dash for empty string', () => {
      expect(formatNumberCompact('' as unknown as number)).toBe('-')
    })
  })

  describe('given edge cases', () => {
    it('handles very large numbers', () => {
      expect(formatNumberCompact(1000000000000000)).toBe('1000T')
    })

    it('handles negative numbers', () => {
      expect(formatNumberCompact(-1000)).toBe('-1K')
      expect(formatNumberCompact(-1500000)).toBe('-1.5M')
    })

    it('handles decimal numbers correctly', () => {
      // Now supports decimal values using Number instead of BigInt
      expect(formatNumberCompact(1234.56)).toBe('1.23K')
      expect(formatNumberCompact(1567.89)).toBe('1.57K')
      // Numbers below 1000 don't compact
      expect(formatNumberCompact(999.99)).toBe('999.99')
    })

    it('handles string decimals', () => {
      // String decimals now work with Number conversion
      expect(formatNumberCompact('1000.0')).toBe('1K')
      expect(formatNumberCompact('1234.56')).toBe('1.23K')
    })

    it('handles invalid string values', () => {
      // Invalid strings return dash
      expect(formatNumberCompact('abc')).toBe('-')
      expect(formatNumberCompact('not a number')).toBe('-')
    })

    it('handles edge decimal cases', () => {
      expect(formatNumberCompact(0.5)).toBe('0.5')
      expect(formatNumberCompact(0.123)).toBe('0.12')
      expect(formatNumberCompact(999.999)).toBe('1K')
    })

    it('handles scientific notation strings', () => {
      expect(formatNumberCompact('1e6')).toBe('1M')
      expect(formatNumberCompact('1.5e3')).toBe('1.5K')
    })

    it('handles extremely small decimals', () => {
      expect(formatNumberCompact(0.00001)).toBe('0')
      expect(formatNumberCompact(0.001)).toBe('0')
      expect(formatNumberCompact(0.01)).toBe('0.01')
    })

    it('handles precision edge cases', () => {
      // Test rounding behavior with compact notation
      expect(formatNumberCompact(1999)).toBe('2K')
      expect(formatNumberCompact(1499)).toBe('1.5K')
      expect(formatNumberCompact(1001)).toBe('1K')
    })

    it('handles Number.MAX_SAFE_INTEGER and beyond', () => {
      // JavaScript can safely represent integers up to 2^53 - 1
      expect(formatNumberCompact(Number.MAX_SAFE_INTEGER)).toContain('T')
      // With default maximumFractionDigits=2, shows decimal places
      expect(formatNumberCompact(9007199254740991)).toBe('9007.2T')
    })

    it('handles negative decimals', () => {
      expect(formatNumberCompact(-1234.56)).toBe('-1.23K')
      expect(formatNumberCompact(-0.5)).toBe('-0.5')
      expect(formatNumberCompact(-999.99)).toBe('-999.99')
    })

    it('handles Infinity and -Infinity', () => {
      expect(formatNumberCompact(Infinity)).toBe('∞')
      expect(formatNumberCompact(-Infinity)).toBe('-∞')
    })
  })

  describe('given various formatting scenarios', () => {
    it('formats compact display correctly', () => {
      expect(formatNumberCompact(1200)).toBe('1.2K')
      expect(formatNumberCompact(12000)).toBe('12K')
      expect(formatNumberCompact(120000)).toBe('120K')
      expect(formatNumberCompact(1200000)).toBe('1.2M')
    })

    it('maintains precision within max fraction digits', () => {
      expect(
        formatNumberCompact(1234567, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      ).toBe('1.23M')
      expect(
        formatNumberCompact(1234567, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        })
      ).toBe('1.2M')
      expect(
        formatNumberCompact(1234567, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('1M')
    })
  })
})

describe('formatNumberFull', () => {
  describe('given valid numeric inputs', () => {
    it('formats small numbers in full', () => {
      expect(formatNumberFull(123)).toBe('123')
      expect(formatNumberFull(999)).toBe('999')
    })

    it('formats thousands with comma separator', () => {
      expect(formatNumberFull(1000)).toBe('1,000')
      expect(formatNumberFull(1500)).toBe('1,500')
      expect(formatNumberFull(999999)).toBe('999,999')
    })

    it('formats millions with comma separators', () => {
      expect(formatNumberFull(1000000)).toBe('1,000,000')
      expect(formatNumberFull(1500000)).toBe('1,500,000')
      expect(formatNumberFull(999999999)).toBe('999,999,999')
    })

    it('formats billions with comma separators', () => {
      expect(formatNumberFull(1000000000)).toBe('1,000,000,000')
      expect(formatNumberFull(1500000000)).toBe('1,500,000,000')
    })

    it('formats trillions with comma separators', () => {
      expect(formatNumberFull(1000000000000)).toBe('1,000,000,000,000')
      expect(formatNumberFull(1500000000000)).toBe('1,500,000,000,000')
    })

    it('handles zero correctly', () => {
      expect(formatNumberFull(0)).toBe('0')
    })

    it('accepts string numeric values', () => {
      expect(formatNumberFull('1000')).toBe('1,000')
      expect(formatNumberFull('1000000')).toBe('1,000,000')
    })
  })

  describe('given custom fraction digits', () => {
    it('respects minimumFractionDigits parameter', () => {
      expect(
        formatNumberFull(1000, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('1,000.00')
      expect(
        formatNumberFull(1500, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })
      ).toBe('1,500.0')
    })

    it('respects maximumFractionDigits parameter', () => {
      expect(
        formatNumberFull(1.234, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('1')
      expect(
        formatNumberFull(1567.89, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        })
      ).toBe('1,567.9')
      expect(
        formatNumberFull(1567.89123, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3,
        })
      ).toBe('1,567.891')
    })

    it('uses default fraction digits when not specified', () => {
      expect(formatNumberFull(1500)).toBe('1,500')
      expect(formatNumberFull(1567.89)).toBe('1,567.89')
    })
  })

  describe('given null, undefined or empty values', () => {
    it('returns dash for null values', () => {
      expect(formatNumberFull(null as unknown as number)).toBe('-')
    })

    it('returns dash for undefined values', () => {
      expect(formatNumberFull(undefined as unknown as number)).toBe('-')
    })

    it('returns dash for empty string', () => {
      expect(formatNumberFull('' as unknown as number)).toBe('-')
    })
  })

  describe('given edge cases', () => {
    it('handles very large numbers', () => {
      expect(formatNumberFull(1000000000000000)).toBe('1,000,000,000,000,000')
    })

    it('handles negative numbers', () => {
      expect(formatNumberFull(-1000)).toBe('-1,000')
      expect(formatNumberFull(-1500000)).toBe('-1,500,000')
    })

    it('handles decimal numbers correctly', () => {
      expect(formatNumberFull(1234.56)).toBe('1,234.56')
      expect(formatNumberFull(1567.89)).toBe('1,567.89')
      expect(formatNumberFull(999.99)).toBe('999.99')
    })

    it('handles string decimals', () => {
      expect(formatNumberFull('1000.0')).toBe('1,000')
      expect(formatNumberFull('1234.56')).toBe('1,234.56')
    })

    it('handles invalid string values', () => {
      expect(formatNumberFull('abc')).toBe('-')
      expect(formatNumberFull('not a number')).toBe('-')
    })

    it('handles edge decimal cases', () => {
      expect(formatNumberFull(0.5)).toBe('0.5')
      expect(formatNumberFull(0.123)).toBe('0.12')
      expect(formatNumberFull(999.999)).toBe('1,000')
    })

    it('handles scientific notation strings', () => {
      expect(formatNumberFull('1e6')).toBe('1,000,000')
      expect(formatNumberFull('1.5e3')).toBe('1,500')
    })

    it('handles extremely small decimals', () => {
      expect(formatNumberFull(0.00001)).toBe('0')
      expect(formatNumberFull(0.001)).toBe('0')
      expect(formatNumberFull(0.01)).toBe('0.01')
    })

    it('handles precision edge cases', () => {
      expect(formatNumberFull(1999)).toBe('1,999')
      expect(formatNumberFull(1499)).toBe('1,499')
      expect(formatNumberFull(1001)).toBe('1,001')
    })

    it('handles Number.MAX_SAFE_INTEGER and beyond', () => {
      expect(formatNumberFull(Number.MAX_SAFE_INTEGER)).toBe(
        '9,007,199,254,740,991'
      )
      expect(formatNumberFull(9007199254740991)).toBe('9,007,199,254,740,991')
    })

    it('handles negative decimals', () => {
      expect(formatNumberFull(-1234.56)).toBe('-1,234.56')
      expect(formatNumberFull(-0.5)).toBe('-0.5')
      expect(formatNumberFull(-999.99)).toBe('-999.99')
    })

    it('handles Infinity and -Infinity', () => {
      expect(formatNumberFull(Infinity)).toBe('∞')
      expect(formatNumberFull(-Infinity)).toBe('-∞')
    })
  })

  describe('given various formatting scenarios', () => {
    it('formats full numbers with comma separators', () => {
      expect(formatNumberFull(1200)).toBe('1,200')
      expect(formatNumberFull(12000)).toBe('12,000')
      expect(formatNumberFull(120000)).toBe('120,000')
      expect(formatNumberFull(1200000)).toBe('1,200,000')
    })

    it('maintains precision within max fraction digits', () => {
      expect(
        formatNumberFull(1234567, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      ).toBe('1,234,567')
      expect(
        formatNumberFull(1234567.89, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        })
      ).toBe('1,234,567.9')
      expect(
        formatNumberFull(1234567.89, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('1,234,568')
    })

    it('formats with minimum fraction digits', () => {
      expect(
        formatNumberFull(1234, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('1,234.00')
      expect(
        formatNumberFull(1234.5, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('1,234.50')
    })

    it('formats very small numbers with custom precision', () => {
      expect(
        formatNumberFull(0.123456, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      ).toBe('0.1235')
      expect(
        formatNumberFull(0.001, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('0.001')
    })
  })

  describe('given real-world usage scenarios', () => {
    it('formats population counts', () => {
      expect(formatNumberFull(328000000)).toBe('328,000,000')
      expect(formatNumberFull(7800000000)).toBe('7,800,000,000')
    })

    it('formats precise financial amounts', () => {
      expect(
        formatNumberFull(1234567.89, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('1,234,567.89')
      expect(
        formatNumberFull(999.99, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('999.99')
    })

    it('formats large integer counts', () => {
      expect(formatNumberFull(1234567890)).toBe('1,234,567,890')
      expect(formatNumberFull(42000)).toBe('42,000')
    })

    it('formats percentages as decimal numbers', () => {
      expect(
        formatNumberFull(0.1234, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('0.12')
      expect(
        formatNumberFull(99.999, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('100.00')
    })
  })

  describe('given comparison with compact format', () => {
    it('shows full numbers instead of compact notation', () => {
      // Compact: "1K", Full: "1,000"
      expect(formatNumberFull(1000)).toBe('1,000')
      expect(formatNumberCompact(1000)).toBe('1K')

      // Compact: "1.5M", Full: "1,500,000"
      expect(formatNumberFull(1500000)).toBe('1,500,000')
      expect(formatNumberCompact(1500000)).toBe('1.5M')

      // Compact: "1.23B", Full: "1,234,567,890"
      expect(formatNumberFull(1234567890)).toBe('1,234,567,890')
      expect(formatNumberCompact(1234567890)).toBe('1.23B')
    })

    it('maintains same decimal precision behavior', () => {
      expect(formatNumberFull(123.456)).toBe('123.46')
      expect(formatNumberCompact(123.456)).toBe('123.46')
    })
  })
})
