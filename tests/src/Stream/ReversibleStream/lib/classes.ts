import type { IReversedStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	signatures
} from "lib/lib.js"

import {
	GeneratedStreamClassSuite,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"

export function GeneratedReversedStreamTest(hasPosition: boolean = false) {
	const ReversedStreamGeneratedSuite = GeneratedStreamClassSuite(true, hasPosition)

	const reversedStreamPrototypeProps = ["super"]
	const reversedStreamOwnProps = ["input"]

	const isReversedStream = isSuperable as (
		x: any
	) => x is IReversedStream

	const ReversedStreamConstructorTest = ClassConstructorTest<IReversedStream>(
		isReversedStream,
		reversedStreamPrototypeProps,
		reversedStreamOwnProps
	)

	const InitReversedStreamConstructorTest = InitClassConstructorTest<IReversedStream>(
		isReversedStream,
		reversedStreamPrototypeProps,
		reversedStreamOwnProps
	)

	function ReversedStreamTest(
		className: string,
		streamConstructor: new (...x: any[]) => IReversedStream,
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
