import assert from "assert"

import type { ILimitedStream } from "../../../../../dist/src/Stream/LimitedStream/interfaces.js"

import {
	isPosition,
	positionEqual
} from "../../../../../dist/src/Position/utils.js"
import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	signatures
} from "lib/lib.js"

import {
	GeneratedStreamClassSuite,
	isLookahead,
	isProddable,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"

import { object, functional, type } from "@hgargg-0710/one"
const { structCheck } = object
const { and } = functional
const { isBoolean } = type

type LimitedStreamTestSignature = StreamClassTestSignature & {
	baseTests: [any[], (x: any, y: any) => boolean][]
}

export function GeneratedLimitedStreamTest(hasPosition: boolean = false) {
	const LimitedStreamGeneratedSuite = GeneratedStreamClassSuite(
		true,
		hasPosition
	)

	const isLimitedStream = and(
		structCheck({
			from: isPosition,
			to: isPosition,
			hasLookAhead: isBoolean,
			direction: isBoolean
		}),
		isLookahead,
		isSuperable,
		isProddable
	) as (x: any) => x is ILimitedStream

	const limitedStreamPrototypeProps = ["super", "prod"]
	const limitedStreamOwnProps = [
		"from",
		"to",
		"hasLookAhead",
		"direction",
		"lookAhead",
		"input"
	]

	const LimitedStreamConstructorTest =
		ClassConstructorTest<ILimitedStream>(
			isLimitedStream,
			limitedStreamPrototypeProps,
			limitedStreamOwnProps
		)

	const InitLimitedStreamConstructorTest =
		InitClassConstructorTest<ILimitedStream>(
			isLimitedStream,
			limitedStreamPrototypeProps,
			limitedStreamOwnProps
		)

	function LimitedStreamBaseTest(
		stream: ILimitedStream,
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
		streamConstructor: new (...x: any[]) => ILimitedStream,
		testSignatures: LimitedStreamTestSignature[]
	) {
		LimitedStreamGeneratedSuite(
			className,
			streamConstructor,
			testSignatures
		)
		classTest(`(LimitedStream) ${className}`, () =>
			signatures(
				testSignatures,
				({ input, initTests, baseTests }) =>
					() => {
						const createInstance = () =>
							new streamConstructor(...input)

						// constructor
						LimitedStreamConstructorTest(
							streamConstructor,
							...input
						)

						// .init on bare construction
						for (const initTest of initTests)
							InitLimitedStreamConstructorTest(
								streamConstructor,
								...initTest
							)

						// base test
						for (const [expected, compare] of baseTests)
							LimitedStreamBaseTest(
								createInstance(),
								expected,
								compare
							)
					}
			)
		)
	}

	return LimitedStreamTest
}
