import type { PatternValidator } from "src/constants.js"

export type FullCoverage = typeof PatternValidator.FullCoverage
export type NoFullCoverage = typeof PatternValidator.NoFullCoverage
export type ValidationError = [false, number]
export type PatternValidatorOutput = FullCoverage | NoFullCoverage | ValidationError
