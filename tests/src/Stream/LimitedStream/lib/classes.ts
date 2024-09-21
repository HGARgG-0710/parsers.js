import { it } from "node:test"
import type { LimitedStream } from "../../../../../dist/src/Stream/LimitedStream/interfaces.js"
import { positionEqual } from "../../../../../dist/src/Stream/PositionalStream/Position/utils.js"
import { assert } from "node:console"

export function LimitedStreamBaseTest(
	stream: LimitedStream,
	expected: any[],
	compare: (x: any, y: any) => boolean
) {
	it("class: [base] LimitedStream", () => {
		positionEqual(stream.input, stream.from)
		let i = 0
		while (!stream.isEnd) assert(compare(stream.next(), expected[i++]))
		positionEqual(stream.input, stream.to)
	})
}
