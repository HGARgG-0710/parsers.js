import type {
	IReversedStreamClassInstance,
	IStreamClassInstance
} from "../interfaces.js"

import type { IPosed } from "../../Position/interfaces.js"
import type { IBufferized } from "../../../Collection/Buffer/interfaces.js"
import type { IStream } from "../../interfaces.js"

import {
	positionDecrement,
	positionIncrement
} from "../../Position/refactor.js"

import {
	bufferFreeze,
	bufferPush
} from "../../../Collection/Buffer/refactor.js"
import { deEnd, readBuffer, start, deStart, end } from "../refactor.js"
import { currSet } from "./curr.js"

import { functional, object } from "@hgargg-0710/one"
import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"
const { nil } = functional
const { propDefine } = object
const { GetSetDescriptor, ConstDescriptor } = object.descriptor

// * predoc note: this redefinition [in particular] forbids replacing the '.curr' of the given 'Stream'
function posBufferIsFrozenGet<Type = any>(
	this: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type>
) {
	return readBuffer(this)
}

function redefineCurr<Type = any>(
	x: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type>
) {
	propDefine(
		x,
		"curr",
		GetSetDescriptor(posBufferIsFrozenGet, currSet as () => any)
	)
}

function getNext<Type = any>(stream: IStreamClassInstance<Type>) {
	return (stream.curr = stream.baseNextIter())
}

function getPrev<Type = any>(stream: IReversedStreamClassInstance<Type>) {
	return (stream.curr = stream.basePrevIter())
}

function updateNext<Type = any>(stream: IStreamClassInstance<Type>) {
	stream.baseNextIter()
	return stream.update!()
}

function updatePrev<Type = any>(stream: IReversedStreamClassInstance<Type>) {
	stream.basePrevIter()
	return (stream.curr = stream.currGetter!())
}

// * function for generation of possible '.next' methods
function generateIterationMethods(
	nextGetter: (x: IStreamClassInstance) => any,
	prevGetter: (x: IReversedStreamClassInstance) => any
) {
	type QuartetConfig = [
		(x: IStreamClassInstance, last: any) => any,
		(x: IStreamClassInstance) => any,
		[
			(x: IStreamClassInstance) => any,
			(x: IReversedStreamClassInstance) => any
		],
		[
			(x: IStreamClassInstance) => boolean,
			(x: IStreamClassInstance) => any
		]?,
		((x: IReversedStreamClassInstance) => boolean)?
	]

	function generateQuartet([
		nextPreAction,
		endAction,
		[nextAction, prevAction],
		alt,
		optionalPrevCondition
	]: QuartetConfig) {
		const [fastNext, fastPrev] = (() => {
			function altNext<Type = any>(this: IStreamClassInstance<Type>) {
				const last = this.curr
				nextPreAction(this, last)
				if (this.isCurrEnd()) {
					endAction(this)
					end(this)
					this.prev = prev
				} else nextAction(this)
				return last
			}

			if (alt) {
				const [altCondition, altAction] = alt
				return [
					function <Type = any>(this: IStreamClassInstance<Type>) {
						const last = this.curr
						if (altCondition(this)) altAction(this)
						else altNext.call(this)
						return last
					},
					function <Type = any>(
						this: IReversedStreamClassInstance<Type>
					) {
						const last = this.curr
						if (optionalPrevCondition!(this)) {
							start(this)
							this.next = next
						} else prevAction(this)
						return last
					}
				]
			}

			return [
				altNext,
				function altPrev<Type = any>(
					this: IReversedStreamClassInstance<Type>
				) {
					const last = this.curr
					if (this.isCurrStart()) {
						start(this)
						this.next = next
					} else prevAction(this)
					return last
				}
			]
		})()

		function next<Type = any>(this: IStreamClassInstance<Type>) {
			const last = this.curr
			deStart(this)
			;(this.next = fastNext as () => Type)()
			return last
		}

		function prev<Type = any>(this: IReversedStreamClassInstance<Type>) {
			const last = this.curr
			deEnd(this)
			;(this.prev = fastPrev as () => Type)()
			return last
		}

		return [
			[next, fastNext],
			[prev, fastPrev]
		]
	}

	const posNextAction = (x: IStreamClassInstance & IPosed<number>) => {
		positionIncrement(x)
		nextGetter(x)
	}

	const [
		[[next, fastNext], [prev, fastPrev]],
		[[posNext, fastPosNext], [posPrev, fastPosPrev]],
		[[bufferNext, fastBufferNext], [bufferPrev, fastBufferPrev]],
		[[posBufferNext, fastPosBufferNext], [posBufferPrev, fastPosBufferPrev]]
	] = (
		[
			[nil, nil, [nextGetter, prevGetter]],
			[
				nil,
				nil,
				[
					posNextAction,
					(x: IReversedStreamClassInstance & IPosed<number>) => {
						positionDecrement(x)
						prevGetter(x)
					}
				]
			],
			[
				bufferPush as (x: IStreamClassInstance & IBufferized) => any,
				bufferFreeze as (x: IStreamClassInstance & IBufferized) => any,
				[nextGetter, prevGetter]
			],
			[
				bufferPush as (x: IStreamClassInstance & IBufferized) => any,
				(x: IStreamClassInstance & IBufferized & IPosed<number>) => {
					bufferFreeze(x)
					redefineCurr(x)
				},
				[
					posNextAction,
					(
						x: IStreamClassInstance & IBufferized & IPosed<number>
					) => {
						positionDecrement(x)
						readBuffer(x)
					}
				],
				[
					(x: IStreamClassInstance & IBufferized) =>
						x.buffer.isFrozen,
					(
						x: IStreamClassInstance & IBufferized & IPosed<number>
					) => {
						if (x.pos !== x.buffer.size - 1) {
							positionIncrement(x)
							readBuffer(x)
						}
					}
				],
				(x: IStreamClassInstance & IPosed<number>) => x.pos === 0
			]
		] as QuartetConfig[]
	).map(generateQuartet)

	return [
		[next, fastNext],
		[prev, fastPrev],
		[posNext, fastPosNext],
		[posPrev, fastPosPrev],
		[bufferNext, fastBufferNext],
		[bufferPrev, fastBufferPrev],
		[posBufferNext, fastPosBufferNext],
		[posBufferPrev, fastPosBufferPrev]
	]
}

const [
	[
		[next],
		[, fastPrev],
		[posNext],
		[, fastPosPrev],
		[bufferNext],
		[, fastBufferPrev],
		[posBufferNext],
		[, fastPosBufferPrev]
	],
	[
		[nextCurrGetter],
		[, fastPrevCurrGetter],
		[posNextCurrGetter],
		[, fastPosPrevCurrGetter],
		[bufferNextCurrGetter],
		[, fastBufferPrevCurrGetter],
		[posBufferNextCurrGetter],
		[, fastPosBufferPrevCurrGetter]
	]
] = [
	[getNext, getPrev],
	[updateNext, updatePrev]
].map(([next, prev]) => generateIterationMethods(next, prev))

const MethodHash = new BitHash(
	new ArrayInternal([
		[next, fastPrev],
		[nextCurrGetter, fastPrevCurrGetter],
		[posNext, fastPosPrev],
		[posNextCurrGetter, fastPosPrevCurrGetter],
		[bufferNext, fastBufferPrev],
		[bufferNextCurrGetter, fastBufferPrevCurrGetter],
		[posBufferNext, fastPosBufferPrev],
		[posBufferNextCurrGetter, fastPosBufferPrevCurrGetter]
	] as [() => any, () => any][])
)

const nextPrevDescriptors = ([next, prev]) => ({
	next: ConstDescriptor(next),
	prev: ConstDescriptor(prev)
})

export function chooseMethod<Type = any>(
	currGetter?: () => Type,
	hasPosition = false,
	hasBuffer = false
) {
	return nextPrevDescriptors(
		MethodHash.index([!!currGetter, hasPosition, hasBuffer])
	)
}

export function* streamIterator<Type = any>(this: IStream<Type>) {
	while (!this.isEnd) {
		yield this.curr
		this.next()
	}
}
