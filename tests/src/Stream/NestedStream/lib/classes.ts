import assert from "assert"

import type { EffectiveNestedStream } from "../../../../../dist/src/Stream/NestedStream/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	property,
	signatures
} from "lib/lib.js"

import {
	GeneratedStreamClassSuite,
	isInputted,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"
import { isFastLookupTable } from "IndexMap/FastLookupTable/lib/classes.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isBoolean } = type

type NestedStreamCurrNestedTreeList = (false | NestedStreamCurrNestedTreeList)[]

type NestedStreamTestSignature = StreamClassTestSignature & {
	currNestedTest: NestedStreamCurrNestedTreeList
}

export function GeneratedNestedStreamTest(hasPosition: boolean = false) {
	const NestedStreamGeneratedSuite = GeneratedStreamClassSuite(false, hasPosition)

	function NestedStreamCurrNestedPreTest(
		stream: EffectiveNestedStream,
		currNestedList: NestedStreamCurrNestedTreeList
	) {
		let i = 0
		while (!stream.isEnd) {
			assert(currNestedList.length > i)
			const expectedCurrNested = currNestedList[i]
			assert.strictEqual(stream.currNested, !!expectedCurrNested)
			if (expectedCurrNested)
				NestedStreamCurrNestedPreTest(stream.curr, expectedCurrNested)
			stream.next()
			++i
		}
	}

	function NestedStreamCurrNestedTest(
		stream: EffectiveNestedStream,
		currNestedList: NestedStreamCurrNestedTreeList
	) {
		property("currNested", () =>
			NestedStreamCurrNestedPreTest(stream, currNestedList)
		)
	}

	const nestedStreamPrototypeProps = ["super", "typesTable"]
	const nestedStreamOwnProps = ["currNested", "input"]

	const isNestedStream = and(
		structCheck({
			typesTable: isFastLookupTable,
			currNested: isBoolean
		}),
		isInputted,
		isSuperable
	) as (x: any) => x is EffectiveNestedStream

	const NestedStreamConstructorTest = ClassConstructorTest<EffectiveNestedStream>(
		isNestedStream,
		nestedStreamPrototypeProps,
		nestedStreamOwnProps
	)

	const InitNestedStreamConstructorTest =
		InitClassConstructorTest<EffectiveNestedStream>(
			isNestedStream,
			nestedStreamPrototypeProps,
			nestedStreamOwnProps
		)

	function NestedStreamTest(
		className: string,
		streamConstructor: new (...x: any[]) => EffectiveNestedStream,
		testSignatures: NestedStreamTestSignature[]
	) {
		NestedStreamGeneratedSuite(className, streamConstructor, testSignatures)
		classTest(`(NestedStream) ${className}`, () =>
			signatures(testSignatures, ({ input, currNestedTest, initTests }) => () => {
				const instance = NestedStreamConstructorTest(streamConstructor, ...input)

				// .currNested
				NestedStreamCurrNestedTest(instance, currNestedTest)

				// .init on base constructed
				InitNestedStreamConstructorTest(streamConstructor, ...initTests)
			})
		)
	}

	return NestedStreamTest
}
