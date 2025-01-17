import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	optionalMethod,
	signatures
} from "lib/lib.js"

import type {
	BasicStreamClassInstance,
	Finishable,
	PositionalReversedStreamClassInstance,
	PositionalStreamClassInstance,
	ReversedStreamClassInstance,
	Rewindable,
	StreamClassInstance
} from "../../../../../dist/src/Stream/StreamClass/interfaces.js"

import {
	generalFinishTest,
	generalIsEndTest,
	generalIsStartTest,
	generalIterationTest,
	generalNavigateTest,
	generalPosTest,
	generalReversePosTest,
	generalRewindTest
} from "Stream/lib/classes.js"

import type { Superable } from "../../../../../dist/src/Stream/StreamClass/interfaces.js"
import type { Inputted } from "../../../../../dist/src/Stream/StreamClass/interfaces.js"
import type { Posed, Position } from "../../../../../dist/src/Position/interfaces.js"
import type {
	Lookahead,
	Proddable
} from "../../../../../dist/src/Stream/PredicateStream/interfaces.js"

import { isPosition } from "../../../../../dist/src/Position/utils.js"

import { StreamClass } from "../../../../../dist/src/constants.js"

import { object, functional, type, boolean } from "@hgargg-0710/one"
import type { ReversibleStream } from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import { uniFinish } from "../../../../../dist/src/Stream/StreamClass/utils.js"
const { structCheck } = object
const { and, or } = functional
const { isBoolean, isFunction, isObject, isNumber } = type
const { T } = boolean

export const isSuperable = structCheck<Superable>({ super: isObject })
export const isInputted = structCheck<Inputted>({ input: isObject })
export const isPosed = (pred: (x: any) => boolean = isPosition) =>
	structCheck<Posed>({ pos: pred })

export const isProddable = structCheck<Proddable>({
	prod: isFunction
})

export const isLookahead = structCheck<Lookahead>(["lookAhead"])

const isBasicStreamClassInstance = structCheck<BasicStreamClassInstance>({
	// * BasicStream properties
	isEnd: isBoolean,
	next: isFunction,
	curr: T,
	// * BasicStreamClassInstance properties
	initGetter: optionalMethod,
	currGetter: optionalMethod,
	init: isFunction,
	isStart: or(isBoolean, (x: any) => x === StreamClass.PreCurrInit),
	isCurrEnd: isFunction,
	baseNextIter: isFunction,
	realCurr: T,
	navigate: isFunction,
	finish: isFunction,
	[Symbol.iterator]: isFunction
})

export const isStreamClassInstance = (hasPosition: boolean = false) =>
	and(
		isBasicStreamClassInstance,
		structCheck({
			rewind: optionalMethod,
			prev: optionalMethod,
			basePrevIter: optionalMethod,
			isCurrStart: optionalMethod,
			...(hasPosition ? { pos: isNumber } : {})
		})
	) as (x: any) => x is StreamClassInstance

export const isReversedStreamClassInstance = (hasPosition: boolean = false) =>
	and(
		isBasicStreamClassInstance,
		structCheck({
			rewind: isFunction,
			prev: isFunction,
			basePrevIter: isFunction,
			isCurrStart: isFunction,
			...(hasPosition ? { pos: isNumber } : {})
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

const streamClassOwnProps = (hasPosition: boolean = false) =>
	["isEnd", "isStart", "realCurr"].concat(hasPosition ? ["pos"] : [])

export const StreamClassConstructorTest = (hasPosition: boolean = false) =>
	ClassConstructorTest(
		isStreamClassInstance(hasPosition),
		streamClassPrototypeProps,
		streamClassOwnProps(hasPosition)
	)

export const ReversedStreamClassConstructorTest = (hasPosition: boolean = false) =>
	ClassConstructorTest(
		isReversedStreamClassInstance(hasPosition),
		streamClassPrototypeProps,
		streamClassOwnProps(hasPosition)
	)

export const InitStreamClassConstructorTest = (hasPosition: boolean = false) =>
	InitClassConstructorTest(
		isStreamClassInstance(hasPosition),
		streamClassPrototypeProps,
		streamClassOwnProps(hasPosition)
	)

export const InitReversedStreamClassConstructorTest = (hasPosition: boolean = false) =>
	InitClassConstructorTest(
		isReversedStreamClassInstance(hasPosition),
		streamClassPrototypeProps,
		streamClassOwnProps(hasPosition)
	)

export type StreamClassTestSignature = {
	input: any
	isEndTest: [any[], (x: any, y: any) => boolean, number?]
	navigateTests: [Position, any][]
	finishTests: [number, any[], (x: any, y: any) => boolean][]
	iteratedTest: [any[], (x: any, y: any) => boolean]
	rewindTests: [number, any[], (x: any, y: any) => boolean][]
	isStartTest: [any[], (x: any, y: any) => boolean, number?]
	posTests: [number, number?][]
	reversedPosTests: [number, number?][]
	initTests: any[][]
}

export function GeneratedStreamClassSuite(
	reversed: boolean = false,
	hasPosition: boolean = false
) {
	return function (
		className: string,
		streamConstructor: new (...x: any[]) => StreamClassInstance,
		testSignatures: StreamClassTestSignature[]
	) {
		classTest(`(StreamClass) ${className}`, () =>
			signatures(
				testSignatures,
				({
						input,
						isEndTest,
						navigateTests,
						finishTests,
						iteratedTest,
						rewindTests,
						isStartTest,
						posTests,
						reversedPosTests,
						initTests
					}) =>
					() => {
						const createInstance = () => new streamConstructor(input)

						// constructor
						if (reversed)
							ReversedStreamClassConstructorTest(hasPosition)(
								streamConstructor as new () => ReversedStreamClassInstance,
								...input
							)
						else
							StreamClassConstructorTest(hasPosition)(
								streamConstructor,
								...input
							)

						// .isEnd
						const [expectedBuffer, isEndCompare, isEndReCheck] = isEndTest
						generalIsEndTest(
							createInstance() as ReversibleStream,
							expectedBuffer,
							isEndCompare,
							isEndReCheck
						)

						// .navigate
						const navigateInstance = createInstance()
						for (const [position, expected] of navigateTests)
							generalNavigateTest(navigateInstance, position, expected)

						// .finish
						for (const [timesSkip, expectedBuffer, compare] of finishTests) {
							const finishInstance = createInstance()
							for (let i = 0; i < timesSkip; ++i) finishInstance.next()
							generalFinishTest(
								finishInstance as ReversibleStream &
									Rewindable &
									Finishable,
								expectedBuffer,
								compare
							)
						}

						// [Symbol.iterator]
						const [iteratedOver, iterationCompare] = iteratedTest
						generalIterationTest(
							createInstance(),
							iteratedOver,
							iterationCompare
						)

						// .init on bare construction
						for (const initTest of initTests)
							if (reversed)
								InitReversedStreamClassConstructorTest(hasPosition)(
									streamConstructor as new (
										...x: any[]
									) => ReversedStreamClassInstance,
									...initTest
								)
							else
								InitStreamClassConstructorTest(hasPosition)(
									streamConstructor,
									...initTest
								)

						if (reversed) {
							// .rewind
							for (const [
								itemsSkip,
								rewindBuffer,
								rewindCompare
							] of rewindTests) {
								const rewindInstance = createInstance()
								uniFinish(rewindInstance)
								for (let i = 0; i < itemsSkip; ++i) rewindInstance.prev()
								generalRewindTest(
									rewindInstance as ReversibleStream &
										Finishable &
										Rewindable,
									rewindBuffer,
									rewindCompare
								)
							}

							// .isStart
							const [isStartExpected, isStartCompare, isStartReCheck] =
								isStartTest
							generalIsStartTest(
								createInstance() as ReversibleStream,
								isStartExpected,
								isStartCompare,
								isStartReCheck
							)
						}

						if (hasPosition) {
							// .pos
							for (const [initPos, posReCheck] of posTests) {
								const posInstance = createInstance()
								for (let i = 0; i < initPos; ++i) posInstance.next()
								generalPosTest(
									posInstance as PositionalStreamClassInstance,
									initPos,
									posReCheck
								)
							}

							// .pos (reversed)
							if (reversed) {
								for (const [itemsSkip, posReCheck] of reversedPosTests) {
									const posReversedInstance = createInstance()
									uniFinish(posReversedInstance)
									const initPos = posReversedInstance.pos - itemsSkip
									for (let i = 0; i < itemsSkip; ++i)
										posReversedInstance.prev()
									generalReversePosTest(
										posReversedInstance as PositionalReversedStreamClassInstance,
										initPos,
										posReCheck
									)
								}
							}
						}
					}
			)
		)
	}
}
