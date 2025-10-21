import { describe, expect, it } from 'vitest'
import { formatPercentage } from './percentages-formatter'

describe('formatPercentage', () => {
  describe('Basic percentage formatting', () => {
    it('should format whole number percentages', () => {
      expect(formatPercentage(0)).toBe('0%')
      expect(formatPercentage(0.5)).toBe('50%')
      expect(formatPercentage(1)).toBe('100%')
      expect(formatPercentage(1.5)).toBe('150%')
    })

    it('should format decimal percentages', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%')
      expect(formatPercentage(0.5678)).toBe('56.78%')
      expect(formatPercentage(0.025)).toBe('2.5%')
    })

    it('should format small percentages', () => {
      expect(formatPercentage(0.01)).toBe('1%')
      expect(formatPercentage(0.001)).toBe('0.1%')
      expect(formatPercentage(0.0001)).toBe('0.01%')
    })

    it('should format large percentages', () => {
      expect(formatPercentage(5)).toBe('500%')
      expect(formatPercentage(10)).toBe('1,000%')
      expect(formatPercentage(100)).toBe('10,000%')
    })
  })

  describe('Decimal precision control', () => {
    it('should respect minimumFractionDigits parameter', () => {
      expect(
        formatPercentage(0.5, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('50.00%')

      expect(
        formatPercentage(0.123, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('12.300%')
    })

    it('should respect maximumFractionDigits parameter', () => {
      expect(
        formatPercentage(0.123456, {
          maximumFractionDigits: 0,
        })
      ).toBe('12%')

      expect(
        formatPercentage(0.123456, {
          maximumFractionDigits: 1,
        })
      ).toBe('12.3%')

      expect(
        formatPercentage(0.123456, {
          maximumFractionDigits: 4,
        })
      ).toBe('12.3456%')
    })

    it('should use default precision (0 min, 2 max) when not specified', () => {
      expect(formatPercentage(0.5)).toBe('50%')
      expect(formatPercentage(0.5678)).toBe('56.78%')
      expect(formatPercentage(0.56789)).toBe('56.79%')
    })
  })

  describe('Very small percentages (< 0.01%)', () => {
    it('should show "<0.01%" for positive values less than 0.01%', () => {
      expect(formatPercentage(0.00009)).toBe('<0.01%')
      expect(formatPercentage(0.000099)).toBe('<0.01%')
      expect(formatPercentage(0.0000001)).toBe('<0.01%')
    })

    it('should show "<0.01%" for negative values less than 0.01% in absolute terms', () => {
      expect(formatPercentage(-0.00009)).toBe('<0.01%')
      expect(formatPercentage(-0.000099)).toBe('<0.01%')
      expect(formatPercentage(-0.0000001)).toBe('<0.01%')
    })

    it('should not show <0.01% for values equal to or greater than 0.01%', () => {
      expect(formatPercentage(0.0001)).toBe('0.01%')
      expect(formatPercentage(0.00011)).toBe('0.01%')
      expect(formatPercentage(0.001)).toBe('0.1%')
    })

    it('should not show <0.01% for exactly zero', () => {
      expect(formatPercentage(0)).toBe('0%')
    })
  })

  describe('Negative percentages', () => {
    it('should format negative percentages correctly', () => {
      expect(formatPercentage(-0.5)).toBe('-50%')
      expect(formatPercentage(-0.1234)).toBe('-12.34%')
      expect(formatPercentage(-1)).toBe('-100%')
      expect(formatPercentage(-1.5)).toBe('-150%')
    })

    it('should format small negative percentages', () => {
      expect(formatPercentage(-0.01)).toBe('-1%')
      expect(formatPercentage(-0.001)).toBe('-0.1%')
      expect(formatPercentage(-0.0001)).toBe('-0.01%')
    })
  })

  describe('Invalid input handling', () => {
    it('should return empty string for null', () => {
      expect(formatPercentage(null as unknown as number)).toBe('-')
    })

    it('should return empty string for undefined', () => {
      expect(formatPercentage(undefined as unknown as number)).toBe('-')
    })

    it('should return empty string for NaN', () => {
      expect(formatPercentage(NaN)).toBe('-')
      expect(formatPercentage(Number('abc'))).toBe('-')
    })
  })

  describe('Edge cases', () => {
    it('should handle Infinity', () => {
      expect(formatPercentage(Infinity)).toBe('∞%')
      expect(formatPercentage(-Infinity)).toBe('-∞%')
    })

    it('should handle very large percentages', () => {
      expect(formatPercentage(1000)).toBe('100,000%')
      expect(formatPercentage(10000)).toBe('1,000,000%')
    })

    it('should handle rounding at precision boundaries', () => {
      expect(formatPercentage(0.12345)).toBe('12.35%')
      expect(formatPercentage(0.12344)).toBe('12.34%')
      expect(formatPercentage(0.999)).toBe('99.9%')
      // With default maximumFractionDigits=2, 0.9999 rounds to 99.99%
      expect(formatPercentage(0.9999)).toBe('99.99%')
      // With maximumFractionDigits=0, it rounds to 100%
      expect(formatPercentage(0.9999, { maximumFractionDigits: 0 })).toBe(
        '100%'
      )
    })
  })

  describe('Real-world usage scenarios', () => {
    it('should format typical APY/interest rates', () => {
      // Common DeFi rates
      expect(formatPercentage(0.0524)).toBe('5.24%')
      expect(formatPercentage(0.128)).toBe('12.8%')
      expect(formatPercentage(0.0075)).toBe('0.75%')
    })

    it('should format growth rates', () => {
      // Year-over-year growth
      expect(formatPercentage(0.15)).toBe('15%')
      expect(formatPercentage(-0.05)).toBe('-5%')
      expect(formatPercentage(2.5)).toBe('250%')
    })

    it('should format utilization rates', () => {
      expect(formatPercentage(0.8543)).toBe('85.43%')
      expect(formatPercentage(0.99)).toBe('99%')
      expect(formatPercentage(0.0012)).toBe('0.12%')
    })

    it('should format success/conversion rates', () => {
      expect(formatPercentage(0.0234)).toBe('2.34%')
      expect(formatPercentage(0.00056)).toBe('0.06%')
    })

    it('should format fee percentages', () => {
      expect(formatPercentage(0.003)).toBe('0.3%')
      expect(formatPercentage(0.0025)).toBe('0.25%')
      expect(formatPercentage(0.005)).toBe('0.5%')
    })

    it('should handle protocol slippage tolerances', () => {
      expect(formatPercentage(0.005)).toBe('0.5%')
      expect(formatPercentage(0.01)).toBe('1%')
      expect(formatPercentage(0.03)).toBe('3%')
    })
  })

  describe('Comparison with different precision settings', () => {
    it('should show difference between 0 and 2 decimal places', () => {
      const value = 0.12345

      expect(
        formatPercentage(value, {
          maximumFractionDigits: 0,
        })
      ).toBe('12%')

      expect(
        formatPercentage(value, {
          maximumFractionDigits: 2,
        })
      ).toBe('12.35%')
    })

    it('should show difference between 2 and 4 decimal places', () => {
      const value = 0.123456

      expect(
        formatPercentage(value, {
          maximumFractionDigits: 2,
        })
      ).toBe('12.35%')

      expect(
        formatPercentage(value, {
          maximumFractionDigits: 4,
        })
      ).toBe('12.3456%')
    })
  })
})
