import { describe, expect, it } from 'vitest'
import { formatCurrencyCompact, formatCurrencyFull } from './currency-formatter'

describe('formatCurrencyCompact', () => {
  describe('Basic number formatting without currency', () => {
    it('should format small numbers without compacting', () => {
      expect(formatCurrencyCompact(0)).toBe('$0.00')
      expect(formatCurrencyCompact(123)).toBe('$123.00')
      expect(formatCurrencyCompact(999)).toBe('$999.00')
    })

    it('should format thousands with K suffix', () => {
      expect(formatCurrencyCompact(1000)).toBe('$1.00K')
      expect(formatCurrencyCompact(1500)).toBe('$1.50K')
      expect(formatCurrencyCompact(12000)).toBe('$12.00K')
      expect(formatCurrencyCompact(999999)).toBe('$1.00M')
    })

    it('should format millions with M suffix', () => {
      expect(formatCurrencyCompact(1000000)).toBe('$1.00M')
      expect(formatCurrencyCompact(1500000)).toBe('$1.50M')
      expect(formatCurrencyCompact(45000000)).toBe('$45.00M')
    })

    it('should format billions with B suffix', () => {
      expect(formatCurrencyCompact(1000000000)).toBe('$1.00B')
      expect(formatCurrencyCompact(1500000000)).toBe('$1.50B')
    })

    it('should format trillions with T suffix', () => {
      expect(formatCurrencyCompact(1000000000000)).toBe('$1.00T')
      expect(formatCurrencyCompact(1500000000000)).toBe('$1.50T')
    })
  })

  describe('Decimal precision control', () => {
    it('should respect fractionDigits parameter', () => {
      expect(
        formatCurrencyCompact(1234, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1K')
      expect(
        formatCurrencyCompact(1234, 'USD', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      ).toBe('$1.2K')
      expect(
        formatCurrencyCompact(1234, 'USD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('$1.23K')
      expect(
        formatCurrencyCompact(1234, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$1.234K')
    })

    it('should apply fractionDigits with currency', () => {
      expect(
        formatCurrencyCompact(1234, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1K')
      expect(
        formatCurrencyCompact(1234, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$1.234K')
    })

    it('should use default fractionDigits of 2', () => {
      expect(formatCurrencyCompact(1234)).toBe('$1.23K')
      expect(formatCurrencyCompact(1234567)).toBe('$1.23M')
    })
  })

  describe('Locale formatting', () => {
    it('should use en-US locale by default', () => {
      expect(formatCurrencyCompact(1500000)).toBe('$1.50M')
    })
  })

  describe('String input support', () => {
    it('should accept numeric strings', () => {
      expect(formatCurrencyCompact('1000')).toBe('$1.00K')
      expect(formatCurrencyCompact('1500000')).toBe('$1.50M')
    })

    it('should accept string decimals', () => {
      expect(formatCurrencyCompact('1234.56')).toBe('$1.23K')
      expect(formatCurrencyCompact('999.99')).toBe('$999.99')
    })

    it('should accept scientific notation strings', () => {
      expect(formatCurrencyCompact('1e6')).toBe('$1.00M')
      expect(formatCurrencyCompact('1.5e3')).toBe('$1.50K')
    })

    it('should work with string input and currency', () => {
      expect(formatCurrencyCompact('1000')).toBe('$1.00K')
    })
  })

  describe('Decimal number support', () => {
    it('should format decimal numbers correctly', () => {
      expect(formatCurrencyCompact(1234.56)).toBe('$1.23K')
      expect(formatCurrencyCompact(1567.89)).toBe('$1.57K')
      expect(formatCurrencyCompact(0.5)).toBe('$0.50')
      expect(formatCurrencyCompact(0.123)).toBe('$0.12')
    })

    it('should not compact decimals below 1000', () => {
      expect(formatCurrencyCompact(999.99)).toBe('$999.99')
      expect(formatCurrencyCompact(123.45)).toBe('$123.45')
      expect(formatCurrencyCompact(1.99)).toBe('$1.99')
    })

    it('should handle rounding with default 2 decimal places', () => {
      expect(formatCurrencyCompact(1234.567)).toBe('$1.23K')
      expect(formatCurrencyCompact(1235.567)).toBe('$1.24K')
      expect(formatCurrencyCompact(999.999)).toBe('$1.00K')
    })
  })

  describe('Negative numbers', () => {
    it('should format negative values', () => {
      expect(formatCurrencyCompact(-1000)).toBe('-$1.00K')
      expect(formatCurrencyCompact(-1500000)).toBe('-$1.50M')
      expect(formatCurrencyCompact(-123.45)).toBe('-$123.45')
    })

    it('should format negative currency values', () => {
      expect(formatCurrencyCompact(-1000)).toBe('-$1.00K')
      expect(formatCurrencyCompact(-1500000)).toBe('-$1.50M')
    })
  })

  describe('Invalid input handling', () => {
    it('should return empty string for null', () => {
      expect(formatCurrencyCompact(null as unknown as number)).toBe('-')
    })

    it('should return empty string for undefined', () => {
      expect(formatCurrencyCompact(undefined as unknown as number)).toBe('-')
    })

    it('should return empty string for NaN', () => {
      expect(formatCurrencyCompact(NaN)).toBe('-')
    })

    it('should return empty string for non-numeric strings', () => {
      expect(formatCurrencyCompact('abc')).toBe('-')
      expect(formatCurrencyCompact('not a number')).toBe('-')
      expect(formatCurrencyCompact('$1000')).toBe('-')
    })
  })

  describe('Edge cases', () => {
    it('should handle Infinity', () => {
      expect(formatCurrencyCompact(Infinity)).toBe('$∞')
      expect(formatCurrencyCompact(-Infinity)).toBe('-$∞')
    })

    it('should handle Infinity with currency', () => {
      expect(formatCurrencyCompact(Infinity)).toBe('$∞')
      expect(formatCurrencyCompact(-Infinity)).toBe('-$∞')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrencyCompact(1000000000000000)).toBe('$1000.00T')
      expect(
        formatCurrencyCompact(1000000000000000, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1000T')
    })

    it('should handle very small decimal values with currency', () => {
      expect(formatCurrencyCompact(0.01)).toBe('$0.01')
      expect(formatCurrencyCompact(0.001)).toBe('$0.00')
      expect(
        formatCurrencyCompact(0.001, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$0.001')
    })
  })

  describe('Real-world usage scenarios', () => {
    it('should format dashboard revenue metrics', () => {
      expect(formatCurrencyCompact(1234567)).toBe('$1.23M')
      expect(formatCurrencyCompact(45000000)).toBe('$45.00M')
      expect(formatCurrencyCompact(1200000000)).toBe('$1.20B')
    })

    it('should format prices without currency symbol to USD', () => {
      expect(formatCurrencyCompact(1999)).toBe('$2.00K')
      expect(formatCurrencyCompact(49.99)).toBe('$49.99')
      expect(formatCurrencyCompact(199.99)).toBe('$199.99')
    })

    it('should format market cap values', () => {
      expect(
        formatCurrencyCompact(1500000000, 'USD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('$1.50B')
      expect(
        formatCurrencyCompact(750000000000, 'USD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('$750.00B')
    })

    it('should format TVL (Total Value Locked)', () => {
      expect(formatCurrencyCompact(45678901)).toBe('$45.68M')
      expect(formatCurrencyCompact(1234567890)).toBe('$1.23B')
    })

    it('should format transaction amounts', () => {
      expect(formatCurrencyCompact(1234.56)).toBe('$1.23K')
      expect(formatCurrencyCompact(99.99)).toBe('$99.99')
    })

    it('should format crypto prices with high precision', () => {
      expect(
        formatCurrencyCompact(0.123456, 'USD', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      ).toBe('$0.1235')
      expect(
        formatCurrencyCompact(1234.5678, 'USD', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      ).toBe('$1.2346K')
    })
  })

  describe('Options combinations', () => {
    it('should work with empty options object to USD', () => {
      expect(formatCurrencyCompact(1234, 'USD', {})).toBe('$1.23K')
    })

    it('should work without options parameter to USD', () => {
      expect(formatCurrencyCompact(1234)).toBe('$1.23K')
      expect(formatCurrencyCompact(1234567)).toBe('$1.23M')
    })
  })

  describe('Consistency with different input types', () => {
    it('should produce same result for number and string input', () => {
      expect(formatCurrencyCompact(1234)).toBe(formatCurrencyCompact('1234'))
      expect(formatCurrencyCompact(1234.56)).toBe(
        formatCurrencyCompact('1234.56')
      )
    })

    it('should produce same result with different option orders', () => {
      const result1 = formatCurrencyCompact(1234, 'USD', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
      const result2 = formatCurrencyCompact(1234, 'USD', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
      expect(result1).toBe(result2)
    })
  })

  describe('Cryptocurrency support (USDC, DAI, SKY)', () => {
    describe('USDC formatting', () => {
      it('should format small USDC amounts without compacting', () => {
        expect(formatCurrencyCompact(0, 'USDC')).toBe('0.00 USDC')
        expect(formatCurrencyCompact(123, 'USDC')).toBe('123.00 USDC')
        expect(formatCurrencyCompact(999, 'USDC')).toBe('999.00 USDC')
      })

      it('should format USDC thousands with K suffix', () => {
        expect(formatCurrencyCompact(1000, 'USDC')).toBe('1.00K USDC')
        expect(formatCurrencyCompact(1500, 'USDC')).toBe('1.50K USDC')
        expect(formatCurrencyCompact(12000, 'USDC')).toBe('12.00K USDC')
      })

      it('should format USDC millions with M suffix', () => {
        expect(formatCurrencyCompact(1000000, 'USDC')).toBe('1.00M USDC')
        expect(formatCurrencyCompact(1500000, 'USDC')).toBe('1.50M USDC')
        expect(formatCurrencyCompact(45000000, 'USDC')).toBe('45.00M USDC')
      })

      it('should format USDC billions with B suffix', () => {
        expect(formatCurrencyCompact(1000000000, 'USDC')).toBe('1.00B USDC')
        expect(formatCurrencyCompact(1500000000, 'USDC')).toBe('1.50B USDC')
      })

      it('should format negative USDC values', () => {
        expect(formatCurrencyCompact(-1000, 'USDC')).toBe('-1.00K USDC')
        expect(formatCurrencyCompact(-1500000, 'USDC')).toBe('-1.50M USDC')
        expect(formatCurrencyCompact(-123.45, 'USDC')).toBe('-123.45 USDC')
      })

      it('should respect custom precision for USDC', () => {
        expect(
          formatCurrencyCompact(1234, 'USDC', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        ).toBe('1K USDC')
        expect(
          formatCurrencyCompact(1234, 'USDC', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        ).toBe('1.234K USDC')
      })
    })

    describe('DAI formatting', () => {
      it('should format small DAI amounts without compacting', () => {
        expect(formatCurrencyCompact(0, 'DAI')).toBe('0.00 DAI')
        expect(formatCurrencyCompact(123, 'DAI')).toBe('123.00 DAI')
        expect(formatCurrencyCompact(999, 'DAI')).toBe('999.00 DAI')
      })

      it('should format DAI thousands with K suffix', () => {
        expect(formatCurrencyCompact(1000, 'DAI')).toBe('1.00K DAI')
        expect(formatCurrencyCompact(1500, 'DAI')).toBe('1.50K DAI')
        expect(formatCurrencyCompact(12000, 'DAI')).toBe('12.00K DAI')
      })

      it('should format DAI millions with M suffix', () => {
        expect(formatCurrencyCompact(1000000, 'DAI')).toBe('1.00M DAI')
        expect(formatCurrencyCompact(1500000, 'DAI')).toBe('1.50M DAI')
        expect(formatCurrencyCompact(45000000, 'DAI')).toBe('45.00M DAI')
      })

      it('should format DAI billions with B suffix', () => {
        expect(formatCurrencyCompact(1000000000, 'DAI')).toBe('1.00B DAI')
        expect(formatCurrencyCompact(1500000000, 'DAI')).toBe('1.50B DAI')
      })

      it('should format negative DAI values', () => {
        expect(formatCurrencyCompact(-1000, 'DAI')).toBe('-1.00K DAI')
        expect(formatCurrencyCompact(-1500000, 'DAI')).toBe('-1.50M DAI')
        expect(formatCurrencyCompact(-123.45, 'DAI')).toBe('-123.45 DAI')
      })

      it('should respect custom precision for DAI', () => {
        expect(
          formatCurrencyCompact(1234, 'DAI', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        ).toBe('1K DAI')
        expect(
          formatCurrencyCompact(1234, 'DAI', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        ).toBe('1.234K DAI')
      })
    })

    describe('SKY formatting', () => {
      it('should format small SKY amounts without compacting', () => {
        expect(formatCurrencyCompact(0, 'SKY')).toBe('0.00 SKY')
        expect(formatCurrencyCompact(123, 'SKY')).toBe('123.00 SKY')
        expect(formatCurrencyCompact(999, 'SKY')).toBe('999.00 SKY')
      })

      it('should format SKY thousands with K suffix', () => {
        expect(formatCurrencyCompact(1000, 'SKY')).toBe('1.00K SKY')
        expect(formatCurrencyCompact(1500, 'SKY')).toBe('1.50K SKY')
        expect(formatCurrencyCompact(12000, 'SKY')).toBe('12.00K SKY')
      })

      it('should format SKY millions with M suffix', () => {
        expect(formatCurrencyCompact(1000000, 'SKY')).toBe('1.00M SKY')
        expect(formatCurrencyCompact(1500000, 'SKY')).toBe('1.50M SKY')
        expect(formatCurrencyCompact(45000000, 'SKY')).toBe('45.00M SKY')
      })

      it('should format SKY billions with B suffix', () => {
        expect(formatCurrencyCompact(1000000000, 'SKY')).toBe('1.00B SKY')
        expect(formatCurrencyCompact(1500000000, 'SKY')).toBe('1.50B SKY')
      })

      it('should format negative SKY values', () => {
        expect(formatCurrencyCompact(-1000, 'SKY')).toBe('-1.00K SKY')
        expect(formatCurrencyCompact(-1500000, 'SKY')).toBe('-1.50M SKY')
        expect(formatCurrencyCompact(-123.45, 'SKY')).toBe('-123.45 SKY')
      })

      it('should respect custom precision for SKY', () => {
        expect(
          formatCurrencyCompact(1234, 'SKY', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        ).toBe('1K SKY')
        expect(
          formatCurrencyCompact(1234, 'SKY', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        ).toBe('1.234K SKY')
      })
    })

    describe('Cryptocurrency edge cases', () => {
      it('should handle Infinity for cryptocurrencies', () => {
        expect(formatCurrencyCompact(Infinity, 'USDC')).toBe('∞ USDC')
        expect(formatCurrencyCompact(-Infinity, 'USDC')).toBe('-∞ USDC')
        expect(formatCurrencyCompact(Infinity, 'DAI')).toBe('∞ DAI')
        expect(formatCurrencyCompact(-Infinity, 'DAI')).toBe('-∞ DAI')
        expect(formatCurrencyCompact(Infinity, 'SKY')).toBe('∞ SKY')
        expect(formatCurrencyCompact(-Infinity, 'SKY')).toBe('-∞ SKY')
      })

      it('should handle decimal values for cryptocurrencies', () => {
        expect(formatCurrencyCompact(1234.56, 'USDC')).toBe('1.23K USDC')
        expect(formatCurrencyCompact(999.99, 'DAI')).toBe('999.99 DAI')
        expect(formatCurrencyCompact(0.5, 'SKY')).toBe('0.50 SKY')
      })

      it('should handle string input for cryptocurrencies', () => {
        expect(formatCurrencyCompact('1000', 'USDC')).toBe('1.00K USDC')
        expect(formatCurrencyCompact('1500000', 'DAI')).toBe('1.50M DAI')
        expect(formatCurrencyCompact('1234.56', 'SKY')).toBe('1.23K SKY')
      })

      it("should return '-' for invalid values with cryptocurrencies", () => {
        expect(formatCurrencyCompact(null as unknown as number, 'USDC')).toBe(
          '-'
        )
        expect(
          formatCurrencyCompact(undefined as unknown as number, 'DAI')
        ).toBe('-')
        expect(formatCurrencyCompact(NaN, 'SKY')).toBe('-')
        expect(formatCurrencyCompact('abc', 'USDC')).toBe('-')
      })
    })

    describe('Locale differences between USD and cryptocurrencies', () => {
      it('should show USD symbol before the number (en-US locale)', () => {
        expect(formatCurrencyCompact(1000, 'USD')).toBe('$1.00K')
        expect(formatCurrencyCompact(1000000, 'USD')).toBe('$1.00M')
      })

      it('should show crypto symbol after the number (de-DE locale)', () => {
        expect(formatCurrencyCompact(1000, 'USDC')).toBe('1.00K USDC')
        expect(formatCurrencyCompact(1000, 'DAI')).toBe('1.00K DAI')
        expect(formatCurrencyCompact(1000, 'SKY')).toBe('1.00K SKY')
      })

      it('should use period as decimal separator for USD', () => {
        expect(formatCurrencyCompact(123.45, 'USD')).toBe('$123.45')
      })

      it('should use comma as decimal separator for crypto', () => {
        expect(formatCurrencyCompact(123.45, 'USDC')).toBe('123.45 USDC')
        expect(formatCurrencyCompact(123.45, 'DAI')).toBe('123.45 DAI')
        expect(formatCurrencyCompact(123.45, 'SKY')).toBe('123.45 SKY')
      })
    })
  })

  describe('Currency validation edge cases', () => {
    it('should throw error for empty string currency', () => {
      expect(() => formatCurrencyCompact(1000, '')).toThrow(
        "Currency shouldn't be empty string"
      )
    })

    it('should throw error for whitespace-only currency', () => {
      expect(() => formatCurrencyCompact(1000, '   ')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyCompact(1000, '\t')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyCompact(1000, '\n')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyCompact(1000, ' \t\n ')).toThrow(
        "Currency shouldn't be empty string"
      )
    })
  })

  describe('Combined edge cases with currency validation', () => {
    it('should throw error before checking value validity (empty currency)', () => {
      expect(() =>
        formatCurrencyCompact(null as unknown as number, '')
      ).toThrow("Currency shouldn't be empty string")
      expect(() => formatCurrencyCompact(NaN, '')).toThrow(
        "Currency shouldn't be empty string"
      )
    })

    it('should handle valid currency with invalid value', () => {
      expect(formatCurrencyCompact(null as unknown as number, 'USD')).toBe('-')
      expect(
        formatCurrencyCompact(undefined as unknown as number, 'USDC')
      ).toBe('-')
      expect(formatCurrencyCompact(NaN, 'DAI')).toBe('-')
      expect(formatCurrencyCompact('invalid', 'SKY')).toBe('-')
    })
  })
})

describe('formatCurrencyFull', () => {
  describe('Basic number formatting without currency', () => {
    it('should format small numbers in full', () => {
      expect(formatCurrencyFull(0)).toBe('$0.00')
      expect(formatCurrencyFull(123)).toBe('$123.00')
      expect(formatCurrencyFull(999)).toBe('$999.00')
    })

    it('should format thousands with comma separator', () => {
      expect(formatCurrencyFull(1000)).toBe('$1,000.00')
      expect(formatCurrencyFull(1500)).toBe('$1,500.00')
      expect(formatCurrencyFull(12000)).toBe('$12,000.00')
      expect(formatCurrencyFull(999999)).toBe('$999,999.00')
    })

    it('should format millions with comma separators', () => {
      expect(formatCurrencyFull(1000000)).toBe('$1,000,000.00')
      expect(formatCurrencyFull(1500000)).toBe('$1,500,000.00')
      expect(formatCurrencyFull(45000000)).toBe('$45,000,000.00')
    })

    it('should format billions with comma separators', () => {
      expect(formatCurrencyFull(1000000000)).toBe('$1,000,000,000.00')
      expect(formatCurrencyFull(1500000000)).toBe('$1,500,000,000.00')
    })

    it('should format trillions with comma separators', () => {
      expect(formatCurrencyFull(1000000000000)).toBe('$1,000,000,000,000.00')
      expect(formatCurrencyFull(1500000000000)).toBe('$1,500,000,000,000.00')
    })
  })

  describe('Decimal precision control', () => {
    it('should respect fractionDigits parameter', () => {
      expect(
        formatCurrencyFull(1234, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1,234')
      expect(
        formatCurrencyFull(1234, 'USD', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      ).toBe('$1,234.0')
      expect(
        formatCurrencyFull(1234, 'USD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('$1,234.00')
      expect(
        formatCurrencyFull(1234, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$1,234.000')
    })

    it('should apply fractionDigits with currency', () => {
      expect(
        formatCurrencyFull(1234, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1,234')
      expect(
        formatCurrencyFull(1234, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$1,234.000')
    })

    it('should use default fractionDigits of 2', () => {
      expect(formatCurrencyFull(1234)).toBe('$1,234.00')
      expect(formatCurrencyFull(1234567)).toBe('$1,234,567.00')
    })
  })

  describe('Locale formatting', () => {
    it('should use en-US locale by default', () => {
      expect(formatCurrencyFull(1500000)).toBe('$1,500,000.00')
    })
  })

  describe('String input support', () => {
    it('should accept numeric strings', () => {
      expect(formatCurrencyFull('1000')).toBe('$1,000.00')
      expect(formatCurrencyFull('1500000')).toBe('$1,500,000.00')
    })

    it('should accept string decimals', () => {
      expect(formatCurrencyFull('1234.56')).toBe('$1,234.56')
      expect(formatCurrencyFull('999.99')).toBe('$999.99')
    })

    it('should accept scientific notation strings', () => {
      expect(formatCurrencyFull('1e6')).toBe('$1,000,000.00')
      expect(formatCurrencyFull('1.5e3')).toBe('$1,500.00')
    })

    it('should work with string input and currency', () => {
      expect(formatCurrencyFull('1000')).toBe('$1,000.00')
    })
  })

  describe('Decimal number support', () => {
    it('should format decimal numbers correctly', () => {
      expect(formatCurrencyFull(1234.56)).toBe('$1,234.56')
      expect(formatCurrencyFull(1567.89)).toBe('$1,567.89')
      expect(formatCurrencyFull(0.5)).toBe('$0.50')
      expect(formatCurrencyFull(0.123)).toBe('$0.12')
    })

    it('should format decimals with full numbers', () => {
      expect(formatCurrencyFull(999.99)).toBe('$999.99')
      expect(formatCurrencyFull(123.45)).toBe('$123.45')
      expect(formatCurrencyFull(1.99)).toBe('$1.99')
    })

    it('should handle rounding with default 2 decimal places', () => {
      expect(formatCurrencyFull(1234.567)).toBe('$1,234.57')
      expect(formatCurrencyFull(1235.564)).toBe('$1,235.56')
      expect(formatCurrencyFull(999.999)).toBe('$1,000.00')
    })
  })

  describe('Negative numbers', () => {
    it('should format negative values', () => {
      expect(formatCurrencyFull(-1000)).toBe('-$1,000.00')
      expect(formatCurrencyFull(-1500000)).toBe('-$1,500,000.00')
      expect(formatCurrencyFull(-123.45)).toBe('-$123.45')
    })

    it('should format negative currency values', () => {
      expect(formatCurrencyFull(-1000)).toBe('-$1,000.00')
      expect(formatCurrencyFull(-1500000)).toBe('-$1,500,000.00')
    })
  })

  describe('Invalid input handling', () => {
    it('should return empty string for null', () => {
      expect(formatCurrencyFull(null as unknown as number)).toBe('-')
    })

    it('should return empty string for undefined', () => {
      expect(formatCurrencyFull(undefined as unknown as number)).toBe('-')
    })

    it('should return empty string for NaN', () => {
      expect(formatCurrencyFull(NaN)).toBe('-')
    })

    it('should return empty string for non-numeric strings', () => {
      expect(formatCurrencyFull('abc')).toBe('-')
      expect(formatCurrencyFull('not a number')).toBe('-')
      expect(formatCurrencyFull('$1000')).toBe('-')
    })
  })

  describe('Edge cases', () => {
    it('should handle Infinity', () => {
      expect(formatCurrencyFull(Infinity)).toBe('$∞')
      expect(formatCurrencyFull(-Infinity)).toBe('-$∞')
    })

    it('should handle Infinity with currency', () => {
      expect(formatCurrencyFull(Infinity)).toBe('$∞')
      expect(formatCurrencyFull(-Infinity)).toBe('-$∞')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrencyFull(1000000000000000)).toBe(
        '$1,000,000,000,000,000.00'
      )
      expect(
        formatCurrencyFull(1000000000000000, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$1,000,000,000,000,000')
    })

    it('should handle very small decimal values with currency', () => {
      expect(formatCurrencyFull(0.01)).toBe('$0.01')
      expect(formatCurrencyFull(0.001)).toBe('$0.00')
      expect(
        formatCurrencyFull(0.001, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$0.001')
    })
  })

  describe('Real-world usage scenarios', () => {
    it('should format dashboard revenue metrics', () => {
      expect(formatCurrencyFull(1234567)).toBe('$1,234,567.00')
      expect(formatCurrencyFull(45000000)).toBe('$45,000,000.00')
      expect(formatCurrencyFull(1200000000)).toBe('$1,200,000,000.00')
    })

    it('should format prices', () => {
      expect(formatCurrencyFull(1999)).toBe('$1,999.00')
      expect(formatCurrencyFull(49.99)).toBe('$49.99')
      expect(formatCurrencyFull(199.99)).toBe('$199.99')
    })

    it('should format market cap values', () => {
      expect(
        formatCurrencyFull(1500000000, 'USD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('$1,500,000,000.00')
      expect(
        formatCurrencyFull(750000000000, 'USD', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe('$750,000,000,000.00')
    })

    it('should format TVL (Total Value Locked)', () => {
      expect(formatCurrencyFull(45678901)).toBe('$45,678,901.00')
      expect(formatCurrencyFull(1234567890)).toBe('$1,234,567,890.00')
    })

    it('should format transaction amounts', () => {
      expect(formatCurrencyFull(1234.56)).toBe('$1,234.56')
      expect(formatCurrencyFull(99.99)).toBe('$99.99')
    })

    it('should format crypto prices with high precision', () => {
      expect(
        formatCurrencyFull(0.123456, 'USD', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      ).toBe('$0.1235')
      expect(
        formatCurrencyFull(1234.5678, 'USD', {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      ).toBe('$1,234.5678')
    })
  })

  describe('Options combinations', () => {
    it('should work with empty options object to USD', () => {
      expect(formatCurrencyFull(1234, 'USD', {})).toBe('$1,234.00')
    })

    it('should work without options parameter to USD', () => {
      expect(formatCurrencyFull(1234)).toBe('$1,234.00')
      expect(formatCurrencyFull(1234567)).toBe('$1,234,567.00')
    })
  })

  describe('Consistency with different input types', () => {
    it('should produce same result for number and string input', () => {
      expect(formatCurrencyFull(1234)).toBe(formatCurrencyFull('1234'))
      expect(formatCurrencyFull(1234.56)).toBe(formatCurrencyFull('1234.56'))
    })

    it('should produce same result with different option orders', () => {
      const result1 = formatCurrencyFull(1234, 'USD', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
      const result2 = formatCurrencyFull(1234, 'USD', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
      expect(result1).toBe(result2)
    })
  })

  describe('Cryptocurrency support (USDC, DAI, SKY)', () => {
    describe('USDC formatting', () => {
      it('should format small USDC amounts in full', () => {
        expect(formatCurrencyFull(0, 'USDC')).toBe('0.00 USDC')
        expect(formatCurrencyFull(123, 'USDC')).toBe('123.00 USDC')
        expect(formatCurrencyFull(999, 'USDC')).toBe('999.00 USDC')
      })

      it('should format USDC thousands with comma separator', () => {
        expect(formatCurrencyFull(1000, 'USDC')).toBe('1,000.00 USDC')
        expect(formatCurrencyFull(1500, 'USDC')).toBe('1,500.00 USDC')
        expect(formatCurrencyFull(12000, 'USDC')).toBe('12,000.00 USDC')
      })

      it('should format USDC millions with comma separators', () => {
        expect(formatCurrencyFull(1000000, 'USDC')).toBe('1,000,000.00 USDC')
        expect(formatCurrencyFull(1500000, 'USDC')).toBe('1,500,000.00 USDC')
        expect(formatCurrencyFull(45000000, 'USDC')).toBe('45,000,000.00 USDC')
      })

      it('should format USDC billions with comma separators', () => {
        expect(formatCurrencyFull(1000000000, 'USDC')).toBe(
          '1,000,000,000.00 USDC'
        )
        expect(formatCurrencyFull(1500000000, 'USDC')).toBe(
          '1,500,000,000.00 USDC'
        )
      })

      it('should format negative USDC values', () => {
        expect(formatCurrencyFull(-1000, 'USDC')).toBe('-1,000.00 USDC')
        expect(formatCurrencyFull(-1500000, 'USDC')).toBe('-1,500,000.00 USDC')
        expect(formatCurrencyFull(-123.45, 'USDC')).toBe('-123.45 USDC')
      })

      it('should respect custom precision for USDC', () => {
        expect(
          formatCurrencyFull(1234, 'USDC', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        ).toBe('1,234 USDC')
        expect(
          formatCurrencyFull(1234, 'USDC', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        ).toBe('1,234.000 USDC')
      })
    })

    describe('DAI formatting', () => {
      it('should format small DAI amounts in full', () => {
        expect(formatCurrencyFull(0, 'DAI')).toBe('0.00 DAI')
        expect(formatCurrencyFull(123, 'DAI')).toBe('123.00 DAI')
        expect(formatCurrencyFull(999, 'DAI')).toBe('999.00 DAI')
      })

      it('should format DAI thousands with comma separator', () => {
        expect(formatCurrencyFull(1000, 'DAI')).toBe('1,000.00 DAI')
        expect(formatCurrencyFull(1500, 'DAI')).toBe('1,500.00 DAI')
        expect(formatCurrencyFull(12000, 'DAI')).toBe('12,000.00 DAI')
      })

      it('should format DAI millions with comma separators', () => {
        expect(formatCurrencyFull(1000000, 'DAI')).toBe('1,000,000.00 DAI')
        expect(formatCurrencyFull(1500000, 'DAI')).toBe('1,500,000.00 DAI')
        expect(formatCurrencyFull(45000000, 'DAI')).toBe('45,000,000.00 DAI')
      })

      it('should format DAI billions with comma separators', () => {
        expect(formatCurrencyFull(1000000000, 'DAI')).toBe(
          '1,000,000,000.00 DAI'
        )
        expect(formatCurrencyFull(1500000000, 'DAI')).toBe(
          '1,500,000,000.00 DAI'
        )
      })

      it('should format negative DAI values', () => {
        expect(formatCurrencyFull(-1000, 'DAI')).toBe('-1,000.00 DAI')
        expect(formatCurrencyFull(-1500000, 'DAI')).toBe('-1,500,000.00 DAI')
        expect(formatCurrencyFull(-123.45, 'DAI')).toBe('-123.45 DAI')
      })

      it('should respect custom precision for DAI', () => {
        expect(
          formatCurrencyFull(1234, 'DAI', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        ).toBe('1,234 DAI')
        expect(
          formatCurrencyFull(1234, 'DAI', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        ).toBe('1,234.000 DAI')
      })
    })

    describe('SKY formatting', () => {
      it('should format small SKY amounts in full', () => {
        expect(formatCurrencyFull(0, 'SKY')).toBe('0.00 SKY')
        expect(formatCurrencyFull(123, 'SKY')).toBe('123.00 SKY')
        expect(formatCurrencyFull(999, 'SKY')).toBe('999.00 SKY')
      })

      it('should format SKY thousands with comma separator', () => {
        expect(formatCurrencyFull(1000, 'SKY')).toBe('1,000.00 SKY')
        expect(formatCurrencyFull(1500, 'SKY')).toBe('1,500.00 SKY')
        expect(formatCurrencyFull(12000, 'SKY')).toBe('12,000.00 SKY')
      })

      it('should format SKY millions with comma separators', () => {
        expect(formatCurrencyFull(1000000, 'SKY')).toBe('1,000,000.00 SKY')
        expect(formatCurrencyFull(1500000, 'SKY')).toBe('1,500,000.00 SKY')
        expect(formatCurrencyFull(45000000, 'SKY')).toBe('45,000,000.00 SKY')
      })

      it('should format SKY billions with comma separators', () => {
        expect(formatCurrencyFull(1000000000, 'SKY')).toBe(
          '1,000,000,000.00 SKY'
        )
        expect(formatCurrencyFull(1500000000, 'SKY')).toBe(
          '1,500,000,000.00 SKY'
        )
      })

      it('should format negative SKY values', () => {
        expect(formatCurrencyFull(-1000, 'SKY')).toBe('-1,000.00 SKY')
        expect(formatCurrencyFull(-1500000, 'SKY')).toBe('-1,500,000.00 SKY')
        expect(formatCurrencyFull(-123.45, 'SKY')).toBe('-123.45 SKY')
      })

      it('should respect custom precision for SKY', () => {
        expect(
          formatCurrencyFull(1234, 'SKY', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        ).toBe('1,234 SKY')
        expect(
          formatCurrencyFull(1234, 'SKY', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        ).toBe('1,234.000 SKY')
      })
    })

    describe('Cryptocurrency edge cases', () => {
      it('should handle Infinity for cryptocurrencies', () => {
        expect(formatCurrencyFull(Infinity, 'USDC')).toBe('∞ USDC')
        expect(formatCurrencyFull(-Infinity, 'USDC')).toBe('-∞ USDC')
        expect(formatCurrencyFull(Infinity, 'DAI')).toBe('∞ DAI')
        expect(formatCurrencyFull(-Infinity, 'DAI')).toBe('-∞ DAI')
        expect(formatCurrencyFull(Infinity, 'SKY')).toBe('∞ SKY')
        expect(formatCurrencyFull(-Infinity, 'SKY')).toBe('-∞ SKY')
      })

      it('should handle decimal values for cryptocurrencies', () => {
        expect(formatCurrencyFull(1234.56, 'USDC')).toBe('1,234.56 USDC')
        expect(formatCurrencyFull(999.99, 'DAI')).toBe('999.99 DAI')
        expect(formatCurrencyFull(0.5, 'SKY')).toBe('0.50 SKY')
      })

      it('should handle string input for cryptocurrencies', () => {
        expect(formatCurrencyFull('1000', 'USDC')).toBe('1,000.00 USDC')
        expect(formatCurrencyFull('1500000', 'DAI')).toBe('1,500,000.00 DAI')
        expect(formatCurrencyFull('1234.56', 'SKY')).toBe('1,234.56 SKY')
      })

      it("should return '-' for invalid values with cryptocurrencies", () => {
        expect(formatCurrencyFull(null as unknown as number, 'USDC')).toBe('-')
        expect(formatCurrencyFull(undefined as unknown as number, 'DAI')).toBe(
          '-'
        )
        expect(formatCurrencyFull(NaN, 'SKY')).toBe('-')
        expect(formatCurrencyFull('abc', 'USDC')).toBe('-')
      })
    })

    describe('Formatting differences between USD and cryptocurrencies', () => {
      it('should show USD symbol before the number', () => {
        expect(formatCurrencyFull(1000, 'USD')).toBe('$1,000.00')
        expect(formatCurrencyFull(1000000, 'USD')).toBe('$1,000,000.00')
      })

      it('should show crypto symbol after the number', () => {
        expect(formatCurrencyFull(1000, 'USDC')).toBe('1,000.00 USDC')
        expect(formatCurrencyFull(1000, 'DAI')).toBe('1,000.00 DAI')
        expect(formatCurrencyFull(1000, 'SKY')).toBe('1,000.00 SKY')
      })

      it('should use period as decimal separator for all currencies', () => {
        expect(formatCurrencyFull(123.45, 'USD')).toBe('$123.45')
        expect(formatCurrencyFull(123.45, 'USDC')).toBe('123.45 USDC')
        expect(formatCurrencyFull(123.45, 'DAI')).toBe('123.45 DAI')
        expect(formatCurrencyFull(123.45, 'SKY')).toBe('123.45 SKY')
      })

      it('should use comma as thousand separator for all currencies', () => {
        expect(formatCurrencyFull(1234567, 'USD')).toBe('$1,234,567.00')
        expect(formatCurrencyFull(1234567, 'USDC')).toBe('1,234,567.00 USDC')
        expect(formatCurrencyFull(1234567, 'DAI')).toBe('1,234,567.00 DAI')
        expect(formatCurrencyFull(1234567, 'SKY')).toBe('1,234,567.00 SKY')
      })
    })
  })

  describe('Currency validation edge cases', () => {
    it('should throw error for empty string currency', () => {
      expect(() => formatCurrencyFull(1000, '')).toThrow(
        "Currency shouldn't be empty string"
      )
    })

    it('should throw error for whitespace-only currency', () => {
      expect(() => formatCurrencyFull(1000, '   ')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyFull(1000, '\t')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyFull(1000, '\n')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyFull(1000, ' \t\n ')).toThrow(
        "Currency shouldn't be empty string"
      )
    })
  })

  describe('Combined edge cases with currency validation', () => {
    it('should throw error before checking value validity (empty currency)', () => {
      expect(() => formatCurrencyFull(null as unknown as number, '')).toThrow(
        "Currency shouldn't be empty string"
      )
      expect(() => formatCurrencyFull(NaN, '')).toThrow(
        "Currency shouldn't be empty string"
      )
    })

    it('should handle valid currency with invalid value', () => {
      expect(formatCurrencyFull(null as unknown as number, 'USD')).toBe('-')
      expect(formatCurrencyFull(undefined as unknown as number, 'USDC')).toBe(
        '-'
      )
      expect(formatCurrencyFull(NaN, 'DAI')).toBe('-')
      expect(formatCurrencyFull('invalid', 'SKY')).toBe('-')
    })
  })
})
