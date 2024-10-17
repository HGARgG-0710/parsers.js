import type { EffectiveTreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"
import { isTreeWalker } from "Tree/TreeWalker/lib/classes.js"

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

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isNumber, isString } = type

const treeStreamPrototypeProps = ["super", "copy"]
const treeStreamOwnProps = ["lastLevelWithSiblings", "walker", "response", "input"]

const isTreeStream = and(
	structCheck({
		lastLevelWithSibilngs: isNumber,
		walker: isTreeWalker,
		response: isString
	}),
	isSuperable,
	isInputted
) as (x: any) => x is EffectiveTreeStream

const TreeStreamGeneratedSuite = GeneratedStreamClassSuite(true, false)

const TreeStreamConstructorTest = ClassConstructorTest<EffectiveTreeStream>(
	isTreeStream,
	treeStreamPrototypeProps,
	treeStreamOwnProps
)

const InitTreeStreamConstructorTest = InitClassConstructorTest<EffectiveTreeStream>(
	isTreeStream,
	treeStreamPrototypeProps,
	treeStreamOwnProps
)

export function TreeStreamTest(
	className: string,
	streamConstructor: new (...x: any[]) => EffectiveTreeStream,
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
