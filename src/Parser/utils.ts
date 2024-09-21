import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BaseParsingState } from "./interfaces.js"

import {
	iterationChoice,
	predicateChoice,
	pickDirection,
	positionStopPoint,
	positionNegate,
	isPosition
} from "../Stream/PositionalStream/Position/utils.js"
import type { StreamHandler, StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import { positionConvert } from "src/Stream/PositionalStream/Position/utils.js"
import type {
	ChangeType,
	ReversibleStream
} from "src/Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"
import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"

export const firstFinished = function <T extends BaseParsingState = ParsingState>(
	this: T
) {
	return (this.streams as BasicStream[])[0].isEnd
}

export function skip(
	input: ReversibleStream,
	steps: Position | [ChangeType, StreamPredicate] = 1
) {
	const [change, endPred] = isPosition(steps) ? iterationChoice(steps) : steps
	let i = 0
	while (endPred(input, i)) {
		change(input)
		++i
	}
	return i
}

export function nested(
	inflation: StreamHandler<boolean | number>,
	deflation: StreamHandler<boolean | number>
) {
	return function (input: ReversibleStream, dest: Collection = ArrayCollection([])) {
		let depth = 1
		const depthInflate = (x: boolean | number) => x && (depth += x as number)
		const depthDeflate = (x: boolean | number) => !x || (depth -= x as number)

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

export function array(stream: BasicStream, init: Collection = ArrayCollection<any>([])) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

/**
 * @returns `skip`-s until the point of `positionNegate(positionConvert(pos))`
 */
export function has(pos: Position) {
	pos = predicateChoice(positionConvert(pos))
	const stopPoint = positionStopPoint(pos)
	const negPred = positionNegate(pos)
	const [change, endPred] = iterationChoice(negPred)
	return function (input: ReversibleStream) {
		skip(input, [change, endPred])
		return !input[stopPoint]
	}
}
