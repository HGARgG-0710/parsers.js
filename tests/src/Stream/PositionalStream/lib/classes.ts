import { it } from "node:test"
import assert from "assert"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

import type {
	PositionalInputtedStream,
	PositionalStream
} from "../../../../../dist/src/Stream/PositionalStream/interfaces.js"
import type { BasicReversibleStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { Position } from "../../../../../dist/src/Stream/PositionalStream/Position/interfaces.js"

import { uniNavigate } from "../../../../../dist/src/Stream/NavigableStream/utils.js"
import { ClassConstructorTest, equals } from "lib/lib.js"
import { isStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import { isPositionalStream } from "../../../../../dist/src/Stream/PositionalStream/utils.js"

function PositionalStreamPosTest(
	stream: PositionalStream & BasicReversibleStream,
	goPos: Position,
	expectedPos: Position,
	posCompare: (x: any, y: any) => boolean = equals
) {
	it("property: .pos", () => {
		uniNavigate(stream, goPos)
		assert(posCompare(stream.pos, expectedPos))
	})
}

const isPositionalStreamInternal = and(isPositionalStream, isStreamClassInstance) as (
	x: any
) => x is PositionalInputtedStream

const PositionalStreamConstructorTest = ClassConstructorTest<PositionalInputtedStream>(
	isPositionalStreamInternal
)
