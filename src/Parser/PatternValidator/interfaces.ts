import type { validation } from "../../constants.js"

export type ValidationSuccess = typeof validation.ValidationSuccess

export type PatternValidatorOutput = FullCoverage | NoFullCoverage | ValidationError
export type FullCoverage = typeof validation.PatternValidator.FullCoverage
export type NoFullCoverage = typeof validation.PatternValidator.NoFullCoverage
export type ValidationError = [false, number]
