import type { validation } from "../../constants.js"

export type ValidationResult = ValidationSuccess | ValidationError
export type ValidationSuccess = typeof validation.ValidationSuccess
export type ValidationError = [false, number]

export type PatternValidatorOutput = FullCoverage | NoFullCoverage | ValidationError
export type FullCoverage = typeof validation.PatternValidator.FullCoverage
export type NoFullCoverage = typeof validation.PatternValidator.NoFullCoverage
