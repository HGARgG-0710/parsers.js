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

import type { StreamTokenizer } from "../../../../../dist/src/Parser/StreamTokenizer/interfaces.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isFunction } = type

export function GeneratedStreamTokenizerTest(hasPosition: boolean = false) {
	const StreamTokenizerGeneratedSuite = GeneratedStreamClassSuite(false, hasPosition)

	const streamTokenizerPrototypeProps = ["super", "handler"]
	const streamTokenizerOwnProps = ["input"]

	const isStreamTokenizer = and(
		structCheck({ handler: isFunction }),
		isSuperable,
		isInputted
	) as (x: any) => x is StreamTokenizer

	const StreamTokenizerConstructorTest = ClassConstructorTest<StreamTokenizer>(
		isStreamTokenizer,
		streamTokenizerPrototypeProps,
		streamTokenizerOwnProps
	)

	const InitStreamTokenizerConstructorTest = InitClassConstructorTest<StreamTokenizer>(
		isStreamTokenizer,
		streamTokenizerPrototypeProps,
		streamTokenizerOwnProps
	)

	function StreamTokenizerTest(
		className: string,
		tokenizerConstructor: new (...input: any[]) => StreamTokenizer,
		testSignatures: StreamClassTestSignature[]
	) {
		StreamTokenizerGeneratedSuite(className, tokenizerConstructor, testSignatures)
		classTest(`(StreamTokenizer) ${className}`, () =>
			signatures(testSignatures, ({ input, initTests }) => () => {
				// constructor
				StreamTokenizerConstructorTest(tokenizerConstructor, ...input)

				// .init on base construction
				for (const initTest of initTests)
					InitStreamTokenizerConstructorTest(tokenizerConstructor, ...initTest)
			})
		)
	}

	return StreamTokenizerTest
}
