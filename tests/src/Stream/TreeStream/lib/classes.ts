import type { ITreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"
import { isTreeWalker } from "Tree/TreeWalker/lib/classes.js"

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

import { functional, object, type } from "@hgargg-0710/one"
const { and } = functional
const { structCheck } = object
const { isNumber, isString } = type

const treeStreamPrototypeProps = ["super", "copy"]
const treeStreamOwnProps = [
	"lastLevelWithSiblings",
	"walker",
	"response",
	"input"
]

const isTreeStream = and(
	structCheck({
		lastLevelWithSibilngs: isNumber,
		walker: isTreeWalker,
		response: isString
	}),
	isSuperable
) as (x: any) => x is ITreeStream

const TreeStreamGeneratedSuite = GeneratedStreamClassSuite(true, false)

const TreeStreamConstructorTest = ClassConstructorTest<ITreeStream>(
	isTreeStream,
	treeStreamPrototypeProps,
	treeStreamOwnProps
)

const InitTreeStreamConstructorTest = InitClassConstructorTest<ITreeStream>(
	isTreeStream,
	treeStreamPrototypeProps,
	treeStreamOwnProps
)

export function TreeStreamTest(
	className: string,
	streamConstructor: new (...x: any[]) => ITreeStream,
	testSignatures: StreamClassTestSignature[]
) {
	TreeStreamGeneratedSuite(className, streamConstructor, testSignatures)
	classTest(`(TreeStream) ${className}`, () =>
		signatures(testSignatures, ({ input, initTests }) => () => {
			// constructor
			TreeStreamConstructorTest(streamConstructor, ...input)

			// .init on bare construction
			for (const initTest of initTests)
				InitTreeStreamConstructorTest(streamConstructor, initTest)
		})
	)
}
