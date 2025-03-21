import {
	ClassConstructorTest,
	classTest,
	InitClassConstructorTest,
	optionalMethod,
	signatures
} from "lib/lib.js"

import type {
	IStreamClassInstance,
	IFinishable,
	IReversedStreamClassInstance,
	IRewindable
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

import type {
	IReversibleStream,
	ISupered
} from "../../../../../dist/src/interfaces.js"

import type {
	IPosed,
	IPosition
} from "../../../../../dist/src/Position/interfaces.js"

import { isPosition } from "../../../../../dist/src/Position/utils.js"

import { object, functional, type, boolean } from "@hgargg-0710/one"
import { uniFinish } from "../../../../../dist/src/Stream/StreamClass/utils.js"
const { structCheck } = object
const { and } = functional
const { isBoolean, isFunction, isObject, isNumber } = type
const { T } = boolean

export const isSuperable = structCheck<ISupered>({ super: isObject })
export const isPosed = (pred: (x: any) => boolean = isPosition) =>
	structCheck<IPosed>({ pos: pred })

export const isProddable = structCheck({
	prod: isFunction
})

export const isLookahead = structCheck(["lookAhead"])

const isBasicStreamClassInstance = structCheck<IStreamClassInstance>({
	// * BasicStream properties
	isEnd: isBoolean,
	next: isFunction,
	curr: T,
	// * BasicStreamClassInstance properties
	initGetter: optionalMethod,
	currGetter: optionalMethod,
	init: isFunction,
	isStart: isBoolean,
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
	) as (x: any) => x is IStreamClassInstance

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
	) as (x: any) => x is IReversedStreamClassInstance

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

export const ReversedStreamClassConstructorTest = (
	hasPosition: boolean = false
) =>
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

export const InitReversedStreamClassConstructorTest = (
	hasPosition: boolean = false
) =>
	InitClassConstructorTest(
		isReversedStreamClassInstance(hasPosition),
		streamClassPrototypeProps,
		streamClassOwnProps(hasPosition)
	)

export type StreamClassTestSignature = {
	input: any
	isEndTest: [any[], (x: any, y: any) => boolean, number?]
	navigateTests: [IPosition, any][]
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
		streamConstructor: new (...x: any[]) => IStreamClassInstance,
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
						const createInstance = () =>
							new streamConstructor(input)

						// constructor
						if (reversed)
							ReversedStreamClassConstructorTest(hasPosition)(
								streamConstructor as new () => IReversedStreamClassInstance,
								...input
							)
						else
							StreamClassConstructorTest(hasPosition)(
								streamConstructor,
								...input
							)

						// .isEnd
						const [expectedBuffer, isEndCompare, isEndReCheck] =
							isEndTest
						generalIsEndTest(
							createInstance() as IReversibleStream,
							expectedBuffer,
							isEndCompare,
							isEndReCheck
						)

						// .navigate
						const navigateInstance = createInstance()
						for (const [position, expected] of navigateTests)
							generalNavigateTest(
								navigateInstance,
								position,
								expected
							)

						// .finish
						for (const [
							timesSkip,
							expectedBuffer,
							compare
						] of finishTests) {
							const finishInstance = createInstance()
							for (let i = 0; i < timesSkip; ++i)
								finishInstance.next()
							generalFinishTest(
								finishInstance as IReversibleStream &
									IRewindable &
									IFinishable,
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
								InitReversedStreamClassConstructorTest(
									hasPosition
								)(
									streamConstructor as new (
										...x: any[]
									) => IReversedStreamClassInstance,
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
								for (let i = 0; i < itemsSkip; ++i)
									rewindInstance.prev!()
								generalRewindTest(
									rewindInstance as IReversibleStream &
										IFinishable &
										IRewindable,
									rewindBuffer,
									rewindCompare
								)
							}

							// .isStart
							const [
								isStartExpected,
								isStartCompare,
								isStartReCheck
							] = isStartTest
							generalIsStartTest(
								createInstance() as IReversibleStream,
								isStartExpected,
								isStartCompare,
								isStartReCheck
							)
						}

						if (hasPosition) {
							// .pos
							for (const [initPos, posReCheck] of posTests) {
								const posInstance = createInstance()
								for (let i = 0; i < initPos; ++i)
									posInstance.next()
								generalPosTest(
									posInstance as IPosed<number> &
										IStreamClassInstance,
									initPos,
									posReCheck
								)
							}

							// .pos (reversed)
							if (reversed) {
								for (const [
									itemsSkip,
									posReCheck
								] of reversedPosTests) {
									const posReversedInstance = createInstance()
									uniFinish(posReversedInstance)
									const initPos =
										(
											posReversedInstance as IReversedStreamClassInstance &
												IPosed<number>
										).pos - itemsSkip

									for (let i = 0; i < itemsSkip; ++i)
										posReversedInstance.prev!()

									generalReversePosTest(
										posReversedInstance as IPosed<number> &
											IReversedStreamClassInstance,
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
