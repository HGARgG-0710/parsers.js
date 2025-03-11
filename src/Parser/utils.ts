import type { StreamPredicate, StreamTransform } from "./TableMap/interfaces.js"
import type { ReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "../Stream/interfaces.js"
import type { DirectionalPosition, Position } from "../Position/interfaces.js"
import type { Collection } from "../Collection/interfaces.js"

import { positionNegate } from "../Position/utils.js"
import { getStopPoint } from "../Position/refactor.js"
import { uniNavigate } from "../Stream/StreamClass/utils.js"
import { ArrayCollection } from "../Collection/classes.js"

/**
 * A polymorphic method for skipping the number of steps inside `input`
 * specified by the `steps` (default - `1`)
 */
export function skip(input: ReversibleStream, steps: Position = 1) {
	return uniNavigate(input, positionNegate(steps))
}

/**
 * Collects contigiously the items of `stream` into `init`, starting from `stream.curr`,
 * consuming the items added in the process
 */
export function consume<
	Type = any,
	CollectionType extends Collection<Type> = ArrayCollection<Type>
>(stream: BasicStream<Type>, init: CollectionType = new ArrayCollection<Type>() as any) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

/**
 * Navigates up to the desired position on the given `Stream`,
 * returns whether the bound corresponding to the direction of iteration
 * has been reached
 */
export function has(pos: DirectionalPosition) {
	const stopPoint = getStopPoint(pos)
	return function <Type = any>(input: ReversibleStream<Type>) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}

/**
 * Counts the number of items (starting from `stream.curr`),
 * obeying `pred`
 */
export function count(pred: StreamPredicate) {
	return function <Type = any>(input: BasicStream<Type>) {
		let count = 0
		while (!input.isEnd && pred(input, count)) {
			++count
			input.next()
		}
		return count
	}
}

/**
 * Returns a function that collects the items of `input`
 * into `init`, delimiting them by `delimPred`
 */
export function delimited(delimPred: Position) {
	return function <
		Type = any,
		CollectionType extends Collection<Type> = ArrayCollection<Type>
	>(
		input: ReversibleStream<Type>,
		init: CollectionType = new ArrayCollection<Type>() as any
	) {
		while (!input.isEnd) {
			skip(input, delimPred)
			init.push(input.next())
		}
		return init
	}
}

/**
 * Returns a function that collects the results of `map(input, i++)`
 * with running index `i = 0`, starting from `input.curr`, until
 * the moment that `input.isEnd`
 */
export function transform<UnderType = any, UpperType = any>(
	map: StreamTransform<UnderType, UpperType>
) {
	return function <
		CollectionType extends Collection<UpperType> = ArrayCollection<UpperType>
	>(
		input: BasicStream<UnderType>,
		init: CollectionType = new ArrayCollection<UpperType>() as any
	) {
		let i = 0
		while (!input.isEnd) init.push(map(input, i++))
		return init
	}
}

export * as Composition from "./Composition/utils.js"
