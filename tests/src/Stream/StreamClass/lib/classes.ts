import {
	ClassConstructorTest,
	InitClassConstructorTest,
	optionalMethod
} from "lib/lib.js"

import type {
	BasicStreamClassInstance,
	ReversedStreamClassInstance,
	StreamClassInstance
} from "../../../../../dist/src/Stream/StreamClass/interfaces.js"

import type { Superable } from "../../../../../dist/src/Stream/StreamClass/Superable/interfaces.js"
import type { Copiable } from "../../../../../dist/src/Stream/StreamClass/Copiable/interfaces.js"
import type { Inputted } from "../../../../../dist/src/Stream/UnderStream/interfaces.js"
import type { Posed } from "../../../../../dist/src/Stream/PositionalStream/interfaces.js"
import type {
	Lookahead,
	Proddable
} from "../../../../../dist/src/Stream/PredicateStream/interfaces.js"

import { isPosition } from "../../../../../dist/src/Stream/PositionalStream/Position/utils.js"
import { PRE_CURR_INIT } from "../../../../../dist/src/Stream/StreamClass/methods.js"

import { object, function as _f, typeof as type, boolean } from "@hgargg-0710/one"
const { structCheck } = object
const { and, or } = _f
const { isBoolean, isFunction, isObject } = type
const { T } = boolean

const isBasicStreamClassInstance = structCheck<BasicStreamClassInstance>({
	// * BasicStream properties
	isEnd: isBoolean,
	next: isFunction,
	curr: T,
	// * BasicStreamClassInstance properties
	initGetter: optionalMethod,
	currGetter: optionalMethod,
	init: isFunction,
	isStart: or(isBoolean, (x: any) => x === PRE_CURR_INIT),
	isCurrEnd: isFunction,
	baseNextIter: isFunction,
	realCurr: T,
	navigate: isFunction,
	finish: isFunction,
	[Symbol.iterator]: isFunction
})

export const isStreamClassInstance = and(
	isBasicStreamClassInstance,
	structCheck({
		rewind: optionalMethod,
		prev: optionalMethod,
		basePrevIter: optionalMethod,
		isCurrStart: optionalMethod
	})
) as (x: any) => x is StreamClassInstance

export const isReversedStreamClassInstance = and(
	isBasicStreamClassInstance,
	structCheck({
		rewind: isFunction,
		prev: isFunction,
		basePrevIter: isFunction,
		isCurrStart: isFunction
	})
) as (x: any) => x is ReversedStreamClassInstance

const streamClassPrototypeProps = [
	"next",
	"curr",
	"initGetter",
	"currGetter",
	"init",
	"isCurrEnd",
	"baseNextIter",
	"navigate",
	"finish",
	Symbol.iterator,
	// * optional
	"rewind",
	"prev",
	"basePrevIter",
	"isCurrStart"
]

const streamClassOwnProps = ["isEnd", "isStart", "realCurr"]

export const StreamClassConstructorTest = ClassConstructorTest(
	isStreamClassInstance,
	streamClassPrototypeProps,
	streamClassOwnProps
)

export const ReversedStreamClassConstructorTest = ClassConstructorTest(
	isReversedStreamClassInstance,
	streamClassPrototypeProps,
	streamClassOwnProps
)

export const InitStreamClassConstructorTest = InitClassConstructorTest(
	isStreamClassInstance,
	streamClassPrototypeProps,
	streamClassOwnProps
)

export const InitReversedStreamClassConstructorTest = InitClassConstructorTest(
	isReversedStreamClassInstance,
	streamClassPrototypeProps,
	streamClassOwnProps
)

export const isSuperable = structCheck<Superable>({ super: isObject })
export const isCopiable = structCheck<Copiable>({ copy: isFunction })
export const isInputted = structCheck<Inputted>({ input: isObject })
export const isPosed = structCheck<Posed>({ pos: isPosition })
export const isProddable = structCheck<Proddable>({
	prod: isFunction
})
export const isLookahead = structCheck<Lookahead>(["lookAhead"])
