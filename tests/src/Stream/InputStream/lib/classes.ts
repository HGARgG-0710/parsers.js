import type { IInputStream } from "../../../../../dist/src/Stream/InputStream/interfaces.js"

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

export const isInputStream = isSuperable as (x: any) => x is IInputStream

const inputStreamPrototypeProps = ["super"]
const inputStreamOwnProps = ["input"]

const InputStreamConstructorTest = ClassConstructorTest<IInputStream>(
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
	streamConstructor: new () => IInputStream,
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
