import type {
	BufferizedStreamClassInstance,
	PositionalBufferizedStreamClassInstance,
	PositionalReversedStreamClassInstance,
	PositionalStreamClassInstance,
	ReversedStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"

import { positionDecrement, positionIncrement } from "src/Position/refactor.js"
import { bufferFreeze, bufferPush } from "src/Collection/Buffer/refactor.js"
import {
	currSet,
	deEnd,
	getNext,
	getPrev,
	readBuffer,
	start,
	updateNext,
	updatePrev,
	deStart,
	end
} from "../refactor.js"

import { getSetDescriptor, alterProp } from "../../../refactor.js"

import { functional } from "@hgargg-0710/one"
const { nil } = functional

// * predoc note: this redefinition [in particular] forbids replacing the '.curr' of the given 'Stream'
function posBufferIsFrozenGet<Type = any>(
	this: PositionalBufferizedStreamClassInstance<Type>
) {
	return readBuffer(this)
}

function redefineCurr<Type = any>(x: PositionalBufferizedStreamClassInstance<Type>) {
	alterProp(x, "curr", getSetDescriptor(posBufferIsFrozenGet, currSet as () => any))
}

// * function for generation of possible '.next' methods
function generateIterationMethods(
	nextGetter: (x: StreamClassInstance) => any,
	prevGetter: (x: ReversedStreamClassInstance) => any
) {
	type QuartetConfig = [
		(x: StreamClassInstance, last: any) => any,
		(x: StreamClassInstance) => any,
		[(x: StreamClassInstance) => any, (x: ReversedStreamClassInstance) => any],
		[(x: StreamClassInstance) => boolean, (x: StreamClassInstance) => any]?,
		((x: ReversedStreamClassInstance) => boolean)?
	]

	function generateQuartet([
		nextPreAction,
		endAction,
		[nextAction, prevAction],
		alt,
		optionalPrevCondition
	]: QuartetConfig) {
		const [fastNext, fastPrev] = (() => {
			function altNext<Type = any>(this: StreamClassInstance<Type>) {
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
					function <Type = any>(this: StreamClassInstance<Type>) {
						const last = this.curr
						if (altCondition(this)) altAction(this)
						else altNext.call(this)
						return last
					},
					function <Type = any>(this: ReversedStreamClassInstance<Type>) {
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
				function altPrev<Type = any>(this: ReversedStreamClassInstance<Type>) {
					const last = this.curr
					if (this.isCurrStart()) {
						start(this)
						this.next = next
					} else prevAction(this)
					return last
				}
			]
		})()

		function next<Type = any>(this: StreamClassInstance<Type>) {
			const last = this.curr
			deStart(this)
			;(this.next = fastNext as () => Type)()
			return last
		}

		function prev<Type = any>(this: ReversedStreamClassInstance<Type>) {
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

	const posNextAction = (x: PositionalStreamClassInstance) => {
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
					(x: PositionalReversedStreamClassInstance) => {
						positionDecrement(x)
						prevGetter(x)
					}
				]
			],
			[
				bufferPush as (x: BufferizedStreamClassInstance) => any,
				bufferFreeze as (x: BufferizedStreamClassInstance) => any,
				[nextGetter, prevGetter]
			],
			[
				bufferPush as (x: BufferizedStreamClassInstance) => any,
				(x: PositionalBufferizedStreamClassInstance) => {
					bufferFreeze(x)
					redefineCurr(x)
				},
				[
					posNextAction,
					(x: PositionalBufferizedStreamClassInstance) => {
						positionDecrement(x)
						readBuffer(x)
					}
				],
				[
					(x: BufferizedStreamClassInstance) => x.buffer.isFrozen,
					(x: PositionalBufferizedStreamClassInstance) => {
						if (x.pos !== x.buffer.size - 1) {
							positionIncrement(x)
							readBuffer(x)
						}
					}
				],
				(x: PositionalStreamClassInstance) => x.pos === 0
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

const methodList = [
	[next, fastPrev],
	[nextCurrGetter, fastPrevCurrGetter],
	[posNext, fastPosPrev],
	[posNextCurrGetter, fastPosPrevCurrGetter],
	[bufferNext, fastBufferPrev],
	[bufferNextCurrGetter, fastBufferPrevCurrGetter],
	[posBufferNext, fastPosBufferPrev],
	[posBufferNextCurrGetter, fastPosBufferPrevCurrGetter]
] as [() => any, () => any][]

const nextPrevDescriptors = ([next, prev]) => ({
	next: { value: next },
	prev: { value: prev }
})

export function chooseMethod<Type = any>(
	currGetter?: () => Type,
	pos: boolean = false,
	buffer: boolean = false
) {
	return nextPrevDescriptors(methodList[+!!currGetter | (+pos << 1) | (+buffer << 2)])
}
