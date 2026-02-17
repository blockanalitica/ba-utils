# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ba-utils — a zero-dependency TypeScript utility library for formatting numbers, currencies, and percentages. ES module, published via pnpm.

## Commands

```bash
pnpm test              # vitest watch mode
pnpm test:run          # single run
npx vitest run formatters/currency-formatter  # single test file
pnpm build             # tsc → dist/
pnpm dev               # tsc --watch
pnpm lint              # eslint
pnpm lint:fix          # eslint --fix
pnpm format            # prettier --write
pnpm format:check      # prettier --check
pnpm typecheck         # tsc --noEmit
pnpm verify            # typecheck + lint + format:check + test:run
```

## Architecture

All formatters live under `formatters/` with co-located tests (`*.test.ts`). Each formatter module has its own directory. `index.ts` re-exports everything.

```
formatters/
├── types.ts                    # FractionOptions (shared across all formatters)
├── number-formatter/           # formatNumberCompact, formatNumberFull
├── currency-formatter/         # formatCurrencyCompact, formatCurrencyFull
└── percentages-formatter/      # formatPercentage
```

All formatters use `Intl.NumberFormat` with `en-US` locale. Currency formatter supports USD ($ prefix) and crypto tokens USDC/DAI/SKY (symbol suffix).

### Conventions

- Invalid inputs (null, undefined, NaN, non-numeric strings) return `"-"`
- Very small values show a threshold string: `<0.01%`, `<$0.01`, `<0.01 USDC`
- `FractionOptions` controls `minimumFractionDigits` and `maximumFractionDigits`
- Default fraction digits: 0/2 for numbers and percentages, 2/2 for currency
- Internal helper functions (`formatNumber`, `formatCurrency`) are not exported — public API is the compact/full variants

### Code style

- No semicolons, single quotes, 2-space indent, trailing commas (es5)
- `@typescript-eslint/no-explicit-any` is an error
- Strict TypeScript (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- Type-checked ESLint rules relaxed in test files (no-unsafe-* rules disabled)
