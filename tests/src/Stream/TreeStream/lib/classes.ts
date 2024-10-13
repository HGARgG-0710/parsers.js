import type { EffectiveTreeStream } from "../../../../../dist/src/Stream/TreeStream/interfaces.js"

import {
	blockExtension,
	ClassConstructorTest,
	InitClassConstructorTest
} from "lib/lib.js"

import {
	InitReversedStreamClassConstructorTest,
	isCopiable,
	isInputted,
	isPosed,
	isSuperable,
	ReversedStreamClassConstructorTest
} from "Stream/StreamClass/lib/classes.js"
import {
	isNavigable,
	isRewindable
} from "../../../../../dist/src/Stream/StreamClass/utils.js"

import { isMultiIndex } from "Position/MultiIndex/lib/classes.js"

import { function as _f, object, typeof as type } from "@hgargg-0710/one"
const { and } = _f
const { structCheck } = object
const { isNumber, isObject, isString } = type

const treeStreamPrototypeProps = ["super", "copy"]
const treeStreamOwnProps = ["lastLevelWithSiblings", "walker", "response", "input", "pos"]

const isTreeStream = and(
	structCheck({
		lastLevelWithSibilngs: isNumber,
		walker: isObject,
		response: isString
	}),
	isSuperable,
	isRewindable,
	isCopiable,
	isNavigable,
	isInputted,
	isPosed(isMultiIndex)
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
