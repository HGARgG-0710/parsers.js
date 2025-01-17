import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	signatures
} from "lib/lib.js"
import type { EffectiveProlongedStream } from "../../../../../dist/src/Stream/ProlongedStream/interfaces.js"

import {
	GeneratedStreamClassSuite,
	isInputted,
	isSuperable,
	type StreamClassTestSignature
} from "Stream/StreamClass/lib/classes.js"

import { object, functional, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isNumber } = type

export function GeneratedProlongedStreamTest(hasPosition: boolean = false) {
	const ProlongedStreamGeneratedSuite = GeneratedStreamClassSuite(false, hasPosition)

	const prolongedStreamPrototypeProps = ["super"]
	const prolongedStreamOwnProps = ["streamIndex", "input"]

	const isProlongedStream = and(
		structCheck({
			streamIndex: isNumber
		}),
		isSuperable,
		isInputted
	) as (x: any) => x is EffectiveProlongedStream

	const ProlongedStreamConstructorTest = ClassConstructorTest<EffectiveProlongedStream>(
		isProlongedStream,
		prolongedStreamPrototypeProps,
		prolongedStreamOwnProps
	)

	const InitProlongedStreamConstructorTest =
		InitClassConstructorTest<EffectiveProlongedStream>(
			isProlongedStream,
			prolongedStreamPrototypeProps,
			prolongedStreamOwnProps
		)

	function ProlongedStreamTest(
		className: string,
		streamConstructor: new (...x: any[]) => EffectiveProlongedStream,
		testSignatures: StreamClassTestSignature[]
	) {
		ProlongedStreamGeneratedSuite(className, streamConstructor, testSignatures)
		classTest(`(ProlongedStream) ${className}`, () =>
			signatures(testSignatures, ({ input, initTests }) => () => {
				// constructor
				ProlongedStreamConstructorTest(streamConstructor, ...input)

				// .init on bare construction
				for (const initTest of initTests)
					InitProlongedStreamConstructorTest(streamConstructor, initTest)
			})
		)
	}

	return ProlongedStreamTest
}
