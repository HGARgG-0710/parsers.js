import { it } from "node:test"

import { uniNavigate } from "../../../../../dist/src/Stream/NavigableStream/utils.js"
import type { PositionalStream } from "../../../../../dist/src/Stream/PositionalStream/interfaces.js"
import type { ReversibleStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { Position } from "../../../../../dist/src/Stream/PositionalStream/Position/interfaces.js"
import { assert } from "node:console"
import { equals } from "lib/lib.js"

export function PositionalStreamPosTest(
	stream: PositionalStream & ReversibleStream,
	goPos: Position,
	expectedPos: Position,
	posCompare: (x: any, y: any) => boolean = equals
) {
	it("property: .pos", () => {
		uniNavigate(stream, goPos)
		assert(posCompare(stream.pos, expectedPos))
	})
}
