import { it } from "node:test"
import assert from "assert"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

import { isLimitedStream } from "../../../../../dist/src/Stream/LimitedStream/utils.js"

import type {
	EffectiveLimitedStream,
	LimitedStream
} from "../../../../../dist/src/Stream/LimitedStream/interfaces.js"
import { positionEqual } from "../../../../../dist/src/Stream/PositionalStream/Position/utils.js"
import { ClassConstructorTest } from "lib/lib.js"
import { isReversedStreamClassInstance } from "../../../../../dist/src/Stream/StreamClass/utils.js"
import { isLookaheadHaving } from "Stream/lib/classes.js"

const isLimitedStreamInternal = and(
	isLimitedStream,
	isReversedStreamClassInstance,
	isLookaheadHaving
) as (x: any) => x is EffectiveLimitedStream

const LimitedStreamConstructorTest = ClassConstructorTest<EffectiveLimitedStream>(
	isLimitedStreamInternal
)

function LimitedStreamBaseTest(
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
