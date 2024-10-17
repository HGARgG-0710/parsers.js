import assert from "assert"

import type {
	EffectiveLimitedStream,
	LimitedStream
} from "../../../../../dist/src/Stream/LimitedStream/interfaces.js"

import { isPosition, positionEqual } from "../../../../../dist/src/Position/utils.js"
import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	signatures
} from "lib/lib.js"
import {
	GeneratedStreamClassSuite,
	isInputted,
	isLookahead,
	isProddable,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"

import { object, function as _f, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { and } = _f
const { isBoolean } = type

type LimitedStreamTestSignature = StreamClassTestSignature & {
	baseTests: [any[], (x: any, y: any) => boolean][]
}

export function GeneratedLimitedStreamTest(hasPosition: boolean = false) {
	const LimitedStreamGeneratedSuite = GeneratedStreamClassSuite(true, hasPosition)

	const isLimitedStream = and(
		structCheck({
			from: isPosition,
			to: isPosition,
			hasLookAhead: isBoolean,
			direction: isBoolean
		}),
		isLookahead,
		isSuperable,
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
		"input"
	]

	const LimitedStreamConstructorTest = ClassConstructorTest<EffectiveLimitedStream>(
		isLimitedStream,
		limitedStreamPrototypeProps,
		limitedStreamOwnProps
	)

	const InitLimitedStreamConstructorTest =
		InitClassConstructorTest<EffectiveLimitedStream>(
			isLimitedStream,
			limitedStreamPrototypeProps,
			limitedStreamOwnProps
		)

	function LimitedStreamBaseTest(
		stream: LimitedStream,
		expected: any[],
		compare: (x: any, y: any) => boolean
	) {
		classTest("[base] LimitedStream", () => {
			assert(positionEqual(stream.input, stream.from))
			let i = 0
			while (!stream.isEnd) assert(compare(stream.next(), expected[i++]))
			assert(positionEqual(stream.input, stream.to))
		})
	}

	function LimitedStreamTest(
		className: string,
		streamConstructor: new (...x: any[]) => EffectiveLimitedStream,
		testSignatures: LimitedStreamTestSignature[]
	) {
		LimitedStreamGeneratedSuite(className, streamConstructor, testSignatures)
		classTest(`(LimitedStream) ${className}`, () =>
			signatures(testSignatures, ({ input, initTests, baseTests }) => () => {
				const createInstance = () => new streamConstructor(...input)

				// constructor
				LimitedStreamConstructorTest(streamConstructor, ...input)

				// .init on bare construction
				for (const initTest of initTests)
					InitLimitedStreamConstructorTest(streamConstructor, ...initTest)

				// base test
				for (const [expected, compare] of baseTests)
					LimitedStreamBaseTest(createInstance(), expected, compare)
			})
		)
	}

	return LimitedStreamTest
}
