import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BaseParsingState } from "./interfaces.js"

import {
	iterationChoice,
	predicateChoice,
	pickDirection,
	positionStopPoint,
	positionNegate
} from "../Stream/PositionalStream/Position/utils.js"
import type { StreamHandler } from "src/Parser/ParserMap/interfaces.js"
import { positionConvert } from "src/Stream/PositionalStream/Position/utils.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type {
	Position,
	StaticPosition
} from "src/Stream/PositionalStream/Position/interfaces.js"
import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"

export const firstFinished = function <T extends BaseParsingState = ParsingState>(
	this: T
) {
	return (this.streams as BasicStream[])[0].isEnd
}

export function skip(input: ReversibleStream, steps: Position = 1) {
	const [change, endPred] = iterationChoice(positionConvert(steps, input))
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

export function array(stream: BasicStream, init: Collection = ArrayCollection([])) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

export function has(pred: Position) {
	pred = predicateChoice(positionConvert(pred))
	const stopPoint = positionStopPoint(pred)
	const skipPred = positionNegate(pred)
	return function (input: ReversibleStream) {
		skip(input, skipPred)
		return !input[stopPoint]
	}
}

export function find(position: StaticPosition) {
	position = positionConvert(position) as number
	const change = pickDirection(position)
	const stopPoint = positionStopPoint(position)
	position = Math.abs(position)
	return function (input: ReversibleStream) {
		while (!input[stopPoint] && (position as number)--) change(input)
		return input.curr
	}
}
