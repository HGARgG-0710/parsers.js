import type { ReversedStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	signatures
} from "lib/lib.js"

import {
	GeneratedStreamClassSuite,
	isInputted,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"

import { function as _f } from "@hgargg-0710/one"
const { and } = _f

export function GeneratedReversedStreamTest(hasPosition: boolean = false) {
	const ReversedStreamGeneratedSuite = GeneratedStreamClassSuite(true, hasPosition)

	const reversedStreamPrototypeProps = ["super"]
	const reversedStreamOwnProps = ["input"]

	const isReversedStream = and(isSuperable, isInputted) as (
		x: any
	) => x is ReversedStream

	const ReversedStreamConstructorTest = ClassConstructorTest<ReversedStream>(
		isReversedStream,
		reversedStreamPrototypeProps,
		reversedStreamOwnProps
	)

	const InitReversedStreamConstructorTest = InitClassConstructorTest<ReversedStream>(
		isReversedStream,
		reversedStreamPrototypeProps,
		reversedStreamOwnProps
	)

	function ReversedStreamTest(
		className: string,
		streamConstructor: new (...x: any[]) => ReversedStream,
		testSignatures: StreamClassTestSignature[]
	) {
		ReversedStreamGeneratedSuite(className, streamConstructor, testSignatures)
		classTest(`(ReversedStream) ${className}`, () =>
			signatures(testSignatures, ({ input, initTests }) => () => {
				// constructor
				ReversedStreamConstructorTest(streamConstructor, ...input)

				// .init on bare construction
				for (const initTest of initTests)
					InitReversedStreamConstructorTest(streamConstructor, initTest)
			})
		)
	}

	return ReversedStreamTest
}
