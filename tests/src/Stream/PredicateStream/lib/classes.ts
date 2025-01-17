import type { EffectivePredicateStream } from "../../../../../dist/src/Stream/PredicateStream/interfaces.js"
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

import { object, functional, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isFunction } = type

export function GeneratedPredicateStreamTest(hasPosition: boolean = false) {
	const PredicateStreamGeneratedSuite = GeneratedStreamClassSuite(false, hasPosition)

	const predicateStreamPrototypeProps = ["super", "prod"]
	const predicateStreamOwnProps = ["predicate", "lookAhead", "input"]

	const isPredicateStream = and(
		structCheck({
			predicate: isFunction
		}),
		isLookahead,
		isSuperable,
		isInputted,
		isProddable
	) as (x: any) => x is EffectivePredicateStream

	const PredicateStreamConstructorTest = ClassConstructorTest<EffectivePredicateStream>(
		isPredicateStream,
		predicateStreamPrototypeProps,
		predicateStreamOwnProps
	)

	const InitPredicateStreamConstructorTest =
		InitClassConstructorTest<EffectivePredicateStream>(
			isPredicateStream,
			predicateStreamPrototypeProps,
			predicateStreamOwnProps
		)

	function PredicateStreamTest(
		className: string,
		streamConstructor: new () => EffectivePredicateStream,
		testSignatures: StreamClassTestSignature[]
	) {
		PredicateStreamGeneratedSuite(className, streamConstructor, testSignatures)
		classTest(`(PredicateStream) ${className}`, () =>
			signatures(testSignatures, ({ input, initTests }) => () => {
				// constructor
				PredicateStreamConstructorTest(streamConstructor, ...input)

				// .init on bare construction
				for (const initTest of initTests)
					InitPredicateStreamConstructorTest(streamConstructor, ...initTest)
			})
		)
	}

	return PredicateStreamTest
}
