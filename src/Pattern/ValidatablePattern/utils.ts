import { isFlushable, isPattern, isResulting } from "../utils.js"

import { object, typeof as type, function as f } from "@hgargg-0710/one"
import type { Validatable, ValidatablePattern } from "./interfaces.js"
const { structCheck } = object
const { isFunction } = type
const { and } = f

export const isValidatable = structCheck<Validatable>({ validate: isFunction })
export const isValidatablePattern = and(
	isPattern,
	isFlushable,
	isResulting,
	isValidatable
) as (x: any) => x is ValidatablePattern
