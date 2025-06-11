import { boolean, object, type } from "@hgargg-0710/one"
import type {
	IFinishable,
	INavigable,
	IPrevable,
	IRewindable,
	IStateful,
	IStateSettable
} from "../interfaces.js"

const { structCheck } = object
const { isFunction } = type
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
 * Returns whether the given `x` is a non-`null` object that has a `.rewind` property,
 * which is a function.
 */
export const isRewindable = structCheck<IRewindable>({
	rewind: isFunction
}) as <T = any>(x: any) => x is IRewindable<T>

/**
 * Returns whether the given input has a `.prev` property,
 * which is a function
 */
export const isPrevable = structCheck<IPrevable>({
	prev: isFunction
})

/**
 * Returns whether the given input has `.state` and `.setState`
 * properties, the latter of which is a function
 */
export const isStateful = structCheck<IStateful & IStateSettable>({
	state: T,
	setState: isFunction
})
