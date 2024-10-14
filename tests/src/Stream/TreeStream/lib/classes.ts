import type { EffectiveTreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"

import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import {
	InitReversedStreamClassConstructorTest,
	isInputted,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
import { isTreeWalker } from "Tree/TreeWalker/lib/classes.js"
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

const TreeStreamConstructorTest = blockExtension(
	ReversedStreamClassConstructorTest,
	ClassConstructorTest<EffectiveTreeStream>(
		isTreeStream,
		treeStreamPrototypeProps,
		treeStreamOwnProps
	)
)

const InitTreeStreamConstructorTest = blockExtension(
	InitReversedStreamClassConstructorTest,
	InitClassConstructorTest<EffectiveTreeStream>(
		isTreeStream,
		treeStreamPrototypeProps,
		treeStreamOwnProps
	)
)
