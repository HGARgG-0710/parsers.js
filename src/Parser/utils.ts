import type { IStreamPredicate, IStreamTransform } from "./TableMap/interfaces.js"
import type { IReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { IBasicStream } from "../Stream/interfaces.js"
import type { IDirectionalPosition, IPosition } from "../Position/interfaces.js"
import type { ICollection } from "../Collection/interfaces.js"

import { positionNegate } from "../Position/utils.js"
import { getStopPoint } from "../Position/refactor.js"
import { uniNavigate } from "../Stream/StreamClass/utils.js"
import { ArrayCollection } from "../Collection/classes.js"

/**
 * A polymorphic method for skipping the number of steps inside `input`
 * specified by the `steps` (default - `1`)
 */
export function skip(input: IReversibleStream, steps: IPosition = 1) {
	return uniNavigate(input, positionNegate(steps))
}

/**
 * Collects contigiously the items of `stream` into `init`, starting from `stream.curr`,
 * consuming the items added in the process
 */
export function consume<
	Type = any,
	CollectionType extends ICollection<Type> = ArrayCollection<Type>
>(stream: IBasicStream<Type>, init: CollectionType = new ArrayCollection<Type>() as any) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

/**
 * Navigates up to the desired position on the given `Stream`,
 * returns whether the bound corresponding to the direction of iteration
 * has been reached
 */
export function has(pos: IDirectionalPosition) {
	const stopPoint = getStopPoint(pos)
	return function <Type = any>(input: IReversibleStream<Type>) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}

/**
 * Counts the number of items (starting from `stream.curr`),
 * obeying `pred`
 */
export function count(pred: IStreamPredicate) {
	return function <Type = any>(input: IBasicStream<Type>) {
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
export function delimited(delimPred: IPosition) {
	return function <
		Type = any,
		CollectionType extends ICollection<Type> = ArrayCollection<Type>
	>(
		input: IReversibleStream<Type>,
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
	map: IStreamTransform<UnderType, UpperType>
) {
	return function <
		CollectionType extends ICollection<UpperType> = ArrayCollection<UpperType>
	>(
		input: IBasicStream<UnderType>,
		init: CollectionType = new ArrayCollection<UpperType>() as any
	) {
		let i = 0
		while (!input.isEnd) init.push(map(input, i++))
		return init
	}
}

export * as Composition from "./Composition/utils.js"
