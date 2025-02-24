import type { ReversedStreamClassInstance, StreamClassInstance } from "../interfaces.js"

import type { Posed } from "../../../Position/interfaces.js"
import type { Bufferized } from "../../../Collection/Buffer/interfaces.js"

import { positionDecrement, positionIncrement } from "src/Position/refactor.js"
import { bufferFreeze, bufferPush } from "src/Collection/Buffer/refactor.js"
import { deEnd, readBuffer, start, deStart, end } from "../refactor.js"
import { currSet } from "./curr.js"

import { functional, object } from "@hgargg-0710/one"
import type { BasicStream } from "../../interfaces.js"
const { nil } = functional
const { propDefine } = object
const { GetSetDescriptor, ConstDescriptor } = object.descriptor

// * predoc note: this redefinition [in particular] forbids replacing the '.curr' of the given 'Stream'
function posBufferIsFrozenGet<Type = any>(
	this: StreamClassInstance<Type> & Posed<number> & Bufferized<Type>
) {
	return readBuffer(this)
}

function redefineCurr<Type = any>(
	x: StreamClassInstance<Type> & Posed<number> & Bufferized<Type>
) {
	propDefine(x, "curr", GetSetDescriptor(posBufferIsFrozenGet, currSet as () => any))
}

function getNext<Type = any>(stream: StreamClassInstance<Type>) {
	return (stream.curr = stream.baseNextIter())
}

function getPrev<Type = any>(stream: ReversedStreamClassInstance<Type>) {
	return (stream.curr = stream.basePrevIter())
}

function updateNext<Type = any>(stream: StreamClassInstance<Type>) {
	stream.baseNextIter()
	return stream.update!()
}

function updatePrev<Type = any>(stream: ReversedStreamClassInstance<Type>) {
	stream.basePrevIter()
	return (stream.curr = stream.currGetter!())
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

	const posNextAction = (x: StreamClassInstance & Posed<number>) => {
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
					(x: ReversedStreamClassInstance & Posed<number>) => {
						positionDecrement(x)
						prevGetter(x)
					}
				]
			],
			[
				bufferPush as (x: StreamClassInstance & Bufferized) => any,
				bufferFreeze as (x: StreamClassInstance & Bufferized) => any,
				[nextGetter, prevGetter]
			],
			[
				bufferPush as (x: StreamClassInstance & Bufferized) => any,
				(x: StreamClassInstance & Bufferized & Posed<number>) => {
					bufferFreeze(x)
					redefineCurr(x)
				},
				[
					posNextAction,
					(x: StreamClassInstance & Bufferized & Posed<number>) => {
						positionDecrement(x)
						readBuffer(x)
					}
				],
				[
					(x: StreamClassInstance & Bufferized) => x.buffer.isFrozen,
					(x: StreamClassInstance & Bufferized & Posed<number>) => {
						if (x.pos !== x.buffer.size - 1) {
							positionIncrement(x)
							readBuffer(x)
						}
					}
				],
				(x: StreamClassInstance & Posed<number>) => x.pos === 0
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
	next: ConstDescriptor(next),
	prev: ConstDescriptor(prev)
})

export function chooseMethod<Type = any>(
	currGetter?: () => Type,
	pos: boolean = false,
	buffer: boolean = false
) {
	return nextPrevDescriptors(methodList[+!!currGetter | (+pos << 1) | (+buffer << 2)])
}

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) {
		yield this.curr
		this.next()
	}
}
