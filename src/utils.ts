import type { Summat } from "@hgargg-0710/summat.ts"
import type { HasType, Sizeable } from "./IndexMap/interfaces.js"
import type { PredicatePosition } from "./Position/interfaces.js"
import type { Bufferized } from "./Collection/Buffer/interfaces.js"
import type { BasicStream, Indexed } from "./Stream/interfaces.js"
import type { Stateful } from "./Stream/StreamClass/interfaces.js"
import type {
	BasicReversibleStream,
	ReversibleStream
} from "./Stream/ReversibleStream/interfaces.js"

import { Stream } from "./constants.js"
const { SkippedItem } = Stream.StreamParser

/**
 * Given a string, returns whether it's a Hex number
 */
export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

/**
 * Given a `BasicStream`, calls `.next()` on it and returns the result
 */
export const next = <Type = any>(input: BasicStream<Type>) => input.next()

/**
 * Given a `ReversibleStream`, calls its `.prev()` and returns the result
 */
export const previous = <Type = any>(input: BasicReversibleStream<Type>) => input.prev()

/**
 * Given a `BasicStream` returns its `.curr` property value
 */
export const current = <Type = any>(input: BasicStream<Type>) => input.curr

/**
 * Given a `handler` function returns a function of `input: BasicStream` that skips a single stream-element before and after calling the handler.
 * It then proceeds to returns the result of the handler
 */
export function wrapped(handler: (input: BasicStream) => any) {
	return function (input: BasicStream) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

/**
 * Returns the `.is` property of a given object
 */
export const is = (x: Summat) => x.is

/**
 * Returns the `.isEnd` property of a given `BasicStream`
 */
export const isEnd = (input: BasicStream) => input.isEnd

/**
 * Returns the `.isStart` property of a given `ReversibleStream`
 */
export const isStart = (input: ReversibleStream) => input.isStart

/**
 * Skips a single element of the given `BasicStream` and returns an empty array
 */
export const destroy = (input: BasicStream) => {
	input.next()
	return SkippedItem
}

/**
 * For a `input: BasicStream`, If `input.isEnd`, returns an empty array, otherwise `[input.next()]`
 */
export const preserve = (input: BasicStream) => (input.isEnd ? SkippedItem : input.next())

/**
 * Returns whether `x === y`
 */
export const eq = (x: any) => (y: any) => x === y

/**
 * Returns whether `set.has(x)`
 */
export const inSet = (set: HasType) => (x: any) => set.has(x)

/**
 * Adds a `.direction = false` property on a given `PredicatePosition`
 */
export const backtrack = (predicate: PredicatePosition) => {
	predicate.direction = false
	return predicate
}

export const length = (x: Indexed) => x.length

export const size = (x: Sizeable) => x.size

export const calledDelegate =
	(delegatePropName: string) =>
	(delegateMethodName: string) =>
	(called: any, ...delegateArgs: any[]) =>
		called[delegatePropName][delegateMethodName].call(called, ...delegateArgs)

export const delegate = (delegatePropName: string) => (delegateMethodName: string) =>
	function (...delegateArgs: any[]) {
		return this[delegatePropName][delegateMethodName](...delegateArgs)
	}

export const thisReturningDelegate =
	(delegatePropName: string) => (delegateMethodName: string) =>
		function (...delegateArgs: any[]) {
			this[delegatePropName][delegateMethodName](...delegateArgs)
			return this
		}

export const delegateProperty = (delegatePropName: string) => (propName: string) =>
	function () {
		return this[delegatePropName][propName]
	}

export const classWrapper =
	(X: new (...args: any[]) => any) =>
	(...args: any[]) =>
		new X(...args)

export const AssignmentClass =
	<Type = any, OutType extends Summat = Summat>(propName: string) =>
	(x: Summat, propVal: Type): OutType => {
		x[propName] = propVal
		return x as OutType
	}

export const SelfAssignmentClass =
	<Type = any, OutType = any>(propName: string, _default?: Type) =>
	(x: Type = _default!) => {
		x[propName] = x
		return x as unknown as OutType
	}

export const getSetDescriptor = ([set, get]) => ({ set, get })

export const state = (x: Stateful) => x.state

export const buffer = (x: Bufferized) => x.buffer

export * as Collection from "./Collection/utils.js"
export * as IndexMap from "./IndexMap/utils.js"
export * as Parser from "./Parser/utils.js"
export * as Pattern from "./Pattern/utils.js"
export * as Position from "./Position/utils.js"
export * as Stream from "./Stream/utils.js"
export * as Token from "./Token/utils.js"
export * as Tokenizable from "./Tokenizable/utils.js"
export * as Tree from "./Tree/utils.js"
export * as Validatable from "./Validatable/utils.js"
