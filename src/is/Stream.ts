import { boolean, object, type } from "@hgargg-0710/one"
import type {
	IFinishable,
	IIndexCarrying,
	ILineIndex,
	INavigable,
	IStateHaving,
	IStateSettable
} from "../interfaces.js"

const { structCheck } = object
const { isFunction, isNumber } = type
const { T } = boolean

/**
 * Returns whether the given `x` is a non-`null` object that has a `.finish` property,
 * which is a function.
 */
export const isFinishable = structCheck<IFinishable>({
	finish: isFunction
}) as <T = any>(x: any) => x is IFinishable<T>

/**
 * Returns whether the given `x` is a non-`null` object that has a `.navigate` property,
 * which is a function.
 */
export const isNavigable = structCheck<INavigable>({
	navigate: isFunction
}) as <T = any>(x: any) => x is INavigable<T>

/**
 * Returns whether the given input has `.state` and `.setState`
 * properties, the latter of which is a function
 */
export const isStateful = structCheck<IStateHaving & IStateSettable>({
	state: T,
	setState: isFunction
})

/**
 * This is a predicate verifying (at runtime) bare conformance to the
 * `ILineIndex` interface for the given `x?: any`
 */
export const isLineIndex = structCheck<ILineIndex>({
	char: isNumber,
	line: isNumber,
	nextChar: isFunction,
	nextLine: isFunction
})

/**
 * This is a predicate for verifying that the given `x?: any`
 * is an `IIndexCarrying`.
 */
export const isIndexCarrying = structCheck<IIndexCarrying>({
	lineIndex: isLineIndex
})
