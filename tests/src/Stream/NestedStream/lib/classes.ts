import assert from "assert"

import type { INestedStream } from "../../../../../dist/src/Stream/NestedStream/interfaces.js"
import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	property,
	signatures
} from "lib/lib.js"

import {
	GeneratedStreamClassSuite,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"
import { isLookupTable } from "IndexMap/LookupTable/lib/classes.js"

import { functional, object, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isBoolean } = type

type NestedStreamCurrNestedTreeList = (false | NestedStreamCurrNestedTreeList)[]

type NestedStreamTestSignature = StreamClassTestSignature & {
	currNestedTest: NestedStreamCurrNestedTreeList
}

export function GeneratedNestedStreamTest(hasPosition: boolean = false) {
	const NestedStreamGeneratedSuite = GeneratedStreamClassSuite(
		false,
		hasPosition
	)

	function NestedStreamCurrNestedPreTest(
		stream: INestedStream,
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
		stream: INestedStream,
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
			typesTable: isLookupTable,
			currNested: isBoolean
		}),
		isSuperable
	) as (x: any) => x is INestedStream

	const NestedStreamConstructorTest = ClassConstructorTest<INestedStream>(
		isNestedStream,
		nestedStreamPrototypeProps,
		nestedStreamOwnProps
	)

	const InitNestedStreamConstructorTest =
		InitClassConstructorTest<INestedStream>(
			isNestedStream,
			nestedStreamPrototypeProps,
			nestedStreamOwnProps
		)

	function NestedStreamTest(
		className: string,
		streamConstructor: new (...x: any[]) => INestedStream,
		testSignatures: NestedStreamTestSignature[]
	) {
		NestedStreamGeneratedSuite(className, streamConstructor, testSignatures)
		classTest(`(NestedStream) ${className}`, () =>
			signatures(
				testSignatures,
				({ input, currNestedTest, initTests }) =>
					() => {
						const instance = NestedStreamConstructorTest(
							streamConstructor,
							...input
						)

						// .currNested
						NestedStreamCurrNestedTest(instance, currNestedTest)

						// .init on base constructed
						InitNestedStreamConstructorTest(
							streamConstructor,
							...initTests
						)
					}
			)
		)
	}

	return NestedStreamTest
}
