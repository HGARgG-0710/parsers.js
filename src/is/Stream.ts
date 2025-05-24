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
}) as <Type = any>(x: any) => x is IFinishable<Type>
/**
 * Returns whether the given `x` is a Navigable
 */

export const isNavigable = structCheck<INavigable>({
	navigate: isFunction
}) as <Type = any>(x: any) => x is INavigable<Type>
/**
 * Returns whether the given `x` is a Rewindable
 */

export const isRewindable = structCheck<IRewindable>({
	rewind: isFunction
}) as <Type = any>(x: any) => x is IRewindable<Type>

export const isPrevable = structCheck<IPrevable>({
	prev: isFunction
}) as <Type = any>(x: any) => x is IPrevable<Type>

export const isStateful = structCheck<IStateful & IStateSettable>({
	state: T,
	setState: isFunction
})
