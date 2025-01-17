import type { StreamHandler } from "./TableMap/interfaces.js"
import type { ReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "../Stream/interfaces.js"
import type { DirectionalPosition, Position } from "../Position/interfaces.js"
import type { Collection } from "../Collection/interfaces.js"

import { positionStopPoint, positionNegate } from "../Position/utils.js"

import { uniNavigate } from "../Stream/StreamClass/utils.js"
import { ArrayCollection } from "../Collection/classes.js"

export function skip(input: ReversibleStream, steps: Position = 1) {
	return uniNavigate(input, positionNegate(steps))
}

// * important pre-doc note: stops IMMIDIATELY, if the 'input.curr' is NOT '!!inflate(x)';
// This increases util flexibility, permits usage in contexts, where such a possibility is immanent [for a cost of 1 more check in "common" scenarios];
export function nested(
	inflation: StreamHandler<boolean | number>,
	deflation: StreamHandler<boolean | number>
) {
	return function (
		input: ReversibleStream,
		dest: Collection = new ArrayCollection([])
	) {
		const depthInflate = (x: boolean | number) => x && (depth += x as number)
		const depthDeflate = (x: boolean | number) => !x || (depth -= x as number)

		let depth = 0

		for (
			let i = 0;
			!input.isEnd &&
			!!(depthInflate(inflation(input, i)) || depthDeflate(deflation(input, i)));
			++i
		)
			dest.push(input.next())

		return dest
	}
}

export function array<Type = any>(
	stream: BasicStream<Type>,
	init: Collection<Type> = new ArrayCollection<Type>()
) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

/**
 * @returns navigates up to the desired position on the given `Stream`, returns whether the bound has been reached
 */
export function has(pos: DirectionalPosition) {
	const stopPoint = positionStopPoint(pos)
	return function (input: ReversibleStream) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}
