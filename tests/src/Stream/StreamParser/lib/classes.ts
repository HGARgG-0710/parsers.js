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

import type { IStreamParser } from "../../../../../dist/src/Stream/StreamParser/interfaces.js"

import { functional, object, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isFunction } = type

export function GeneratedStreamTokenizerTest(hasPosition= false) {
	const StreamTokenizerGeneratedSuite = GeneratedStreamClassSuite(
		false,
		hasPosition
	)

	const streamTokenizerPrototypeProps = ["super", "handler"]
	const streamTokenizerOwnProps = ["input"]

	const isStreamTokenizer = and(
		structCheck({ handler: isFunction }),
		isSuperable
	) as (x: any) => x is IStreamParser

	const StreamTokenizerConstructorTest = ClassConstructorTest<IStreamParser>(
		isStreamTokenizer,
		streamTokenizerPrototypeProps,
		streamTokenizerOwnProps
	)

	const InitStreamTokenizerConstructorTest =
		InitClassConstructorTest<IStreamParser>(
			isStreamTokenizer,
			streamTokenizerPrototypeProps,
			streamTokenizerOwnProps
		)

	function StreamTokenizerTest(
		className: string,
		tokenizerConstructor: new (...input: any[]) => IStreamParser,
		testSignatures: StreamClassTestSignature[]
	) {
		StreamTokenizerGeneratedSuite(
			className,
			tokenizerConstructor,
			testSignatures
		)
		classTest(`(StreamTokenizer) ${className}`, () =>
			signatures(testSignatures, ({ input, initTests }) => () => {
				// constructor
				StreamTokenizerConstructorTest(tokenizerConstructor, ...input)

				// .init on base construction
				for (const initTest of initTests)
					InitStreamTokenizerConstructorTest(
						tokenizerConstructor,
						...initTest
					)
			})
		)
	}

	return StreamTokenizerTest
}
