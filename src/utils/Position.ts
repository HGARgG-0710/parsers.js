import { functional, type } from "@hgargg-0710/one"
import type { IPosition, IPredicatePosition } from "../interfaces.js"

const { isFunction, isNumber } = type
const { or } = functional

/**
 * Returns whether given `x` is a `PredicatePosition`
 */
export const isPredicatePosition = isFunction as <Type = any>(
	x: any
) => x is IPredicatePosition<Type>

/**
 * Returns whether given `x` is a `Position`
 */
export const isPosition = or(isNumber, isPredicatePosition) as <Type = any>(
	x: any
) => x is IPosition<Type>
