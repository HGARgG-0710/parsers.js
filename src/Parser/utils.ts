import type { ParsingState } from "./GeneralParser/interfaces.js"
import type { BaseParsingState } from "./interfaces.js"

import {
	positionStopPoint,
	positionNegate
} from "../Stream/PositionalStream/Position/utils.js"
import type { StreamHandler } from "src/Parser/ParserMap/interfaces.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type {
	DirectionalPosition,
	Position
} from "src/Stream/PositionalStream/Position/interfaces.js"
import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import { uniNavigate } from "src/Stream/StreamClass/Navigable/utils.js"

export const firstFinished = function <T extends BaseParsingState = ParsingState>(
	this: T
) {
	return (this.streams as BasicStream[])[0].isEnd
}

export function skip(input: ReversibleStream, steps: Position = 1) {
	return uniNavigate(input, positionNegate(steps))
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
 * @returns navigates up to the desired position on the given `Stream`, returns whether the bound has been reached
 */
export function has(pos: DirectionalPosition) {
	const stopPoint = positionStopPoint(pos)
	return function (input: ReversibleStream) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}
