import type {
	StreamPredicate,
	StreamTransform
} from "./TableMap/interfaces.js"
import type { ReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "../Stream/interfaces.js"
import type { DirectionalPosition, Position } from "../Position/interfaces.js"
import type { Collection } from "../Collection/interfaces.js"

import { positionNegate } from "../Position/utils.js"
import { getStopPoint } from "src/Position/refactor.js"
import { uniNavigate } from "../Stream/StreamClass/utils.js"
import { ArrayCollection } from "../Collection/classes.js"

export function skip(input: ReversibleStream, steps: Position = 1) {
	return uniNavigate(input, positionNegate(steps))
}

export function array<
	Type = any,
	CollectionType extends Collection<Type> = ArrayCollection<Type>
>(stream: BasicStream<Type>, init: CollectionType = new ArrayCollection<Type>() as any) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

/**
 * @returns navigates up to the desired position on the given `Stream`, returns whether the bound has been reached
 */
export function has(pos: DirectionalPosition) {
	const stopPoint = getStopPoint(pos)
	return function <Type = any>(input: ReversibleStream<Type>) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}

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

// * pre-doc note: Stream-class analogue to this -- 'PredicateStream(negate(inSet(new Set(...)))) - CREATE a new *DelimStream* export for the PredicateStream.classes [ONCE the *one.js* v0.5 has been used for a NEW library refactoring];'
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
