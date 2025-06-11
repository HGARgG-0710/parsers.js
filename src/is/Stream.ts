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
 * Returns whether the given `x` is a `Finishable`
 */
export const isFinishable = structCheck<IFinishable>({
	finish: isFunction
}) as <T = any>(x: any) => x is IFinishable<T>

/**
 * Returns whether the given `x` is a Navigable
 */
export const isNavigable = structCheck<INavigable>({
	navigate: isFunction
}) as <T = any>(x: any) => x is INavigable<T>

/**
 * Returns whether the given `x` is a Rewindable
 */
export const isRewindable = structCheck<IRewindable>({
	rewind: isFunction
}) as <T = any>(x: any) => x is IRewindable<T>

export const isPrevable = structCheck<IPrevable>({
	prev: isFunction
})

export const isStateful = structCheck<IStateful & IStateSettable>({
	state: T,
	setState: isFunction
})
