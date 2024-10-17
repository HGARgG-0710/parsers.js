import type { EffectiveInputStream } from "../../../../../dist/src/Stream/InputStream/interfaces.js"

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

const isInputStream = and(isSuperable, isInputted) as (
	x: any
) => x is EffectiveInputStream

const inputStreamPrototypeProps = ["super"]
const inputStreamOwnProps = ["input"]

const InputStreamConstructorTest = ClassConstructorTest<EffectiveInputStream>(
	isInputStream,
	inputStreamPrototypeProps,
	inputStreamOwnProps
)

const InitInputStreamConstructorTest = InitClassConstructorTest(
	isInputStream,
	inputStreamPrototypeProps,
	inputStreamOwnProps
)

const InputStreamGeneratedSuite = GeneratedStreamClassSuite(true, true)
export function InputStreamTest(
	className: string,
	streamConstructor: new () => EffectiveInputStream,
	testSignatures: StreamClassTestSignature[]
) {
	InputStreamGeneratedSuite(`${className}`, streamConstructor, testSignatures)
	classTest(`(InputStream) ${className}`, () =>
		signatures(testSignatures, ({ input, initTests }) => () => {
			// constructor
			InputStreamConstructorTest(streamConstructor, ...input)

			// .init on bare construction
			for (const initTest of initTests)
				InitInputStreamConstructorTest(streamConstructor, ...initTest)
		})
	)
}
