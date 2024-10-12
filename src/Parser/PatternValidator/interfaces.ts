import type { PatternValidator } from "../../constants.js"

export type FullCoverage = typeof PatternValidator.FullCoverage
export type NoFullCoverage = typeof PatternValidator.NoFullCoverage
export type ValidationError = [false, number]
export type PatternValidatorOutput = FullCoverage | NoFullCoverage | ValidationError
