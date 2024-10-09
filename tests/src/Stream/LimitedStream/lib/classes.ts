import { it } from "node:test"
import assert from "assert"

import type {
	EffectiveLimitedStream,
	LimitedStream
} from "../../../../../dist/src/Stream/LimitedStream/interfaces.js"
import {
	isPosition,
	positionEqual
} from "../../../../../dist/src/Stream/PositionalStream/Position/utils.js"
import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"
import {
	InitReversedStreamClassConstructorTest,
	isInputted,
	isLookahead,
	isPosed,
	isProddable,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { and } = _f
const { isBoolean } = type

const isLimitedStream = and(
	structCheck({
		from: isPosition,
		to: isPosition,
		hasLookAhead: isBoolean,
		direction: isBoolean
	}),
	isLookahead,
	isSuperable,
	isPosed,
	isProddable,
	isInputted
) as (x: any) => x is EffectiveLimitedStream

const limitedStreamPrototypeProps = ["super", "prod"]
const limitedStreamOwnProps = [
	"from",
	"to",
	"hasLookAhead",
	"direction",
	"lookAhead",
	"input",
	"pos"
]

const LimitedStreamConstructorTest = blockExtension(
	ReversedStreamClassConstructorTest,
	ClassConstructorTest<EffectiveLimitedStream>(
		isLimitedStream,
		limitedStreamPrototypeProps,
		limitedStreamOwnProps
	)
)

const InitLimitedStreamConstructorTest = blockExtension(
	InitReversedStreamClassConstructorTest,
	InitClassConstructorTest<EffectiveLimitedStream>(
		isLimitedStream,
		limitedStreamPrototypeProps,
		limitedStreamOwnProps
	)
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
