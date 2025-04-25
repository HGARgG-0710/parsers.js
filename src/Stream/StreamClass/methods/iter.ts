import { functional, object } from "@hgargg-0710/one"
import type { IBufferized } from "../../../Collection/Sequence/interfaces.js"
import {
	bufferFreeze,
	bufferPush
} from "../../../Collection/Sequence/refactor.js"
import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"
import type { IStream } from "../../interfaces.js"
import type { IPosed } from "../../Position/interfaces.js"
import {
	positionDecrement,
	positionIncrement
} from "../../Position/refactor.js"
import {
	deEnd,
	deStart,
	end,
	readBuffer,
	start,
	type IReversedStreamClassInstanceImpl,
	type IStreamClassInstanceImpl
} from "../refactor.js"
import { currSet } from "./curr.js"

const { nil } = functional
const { propDefine } = object
const { GetSetDescriptor, ConstDescriptor } = object.descriptor

// * predoc note: this redefinition [in particular] forbids replacing the '.curr' of the given 'Stream'
function posBufferIsFrozenGet<Type = any>(
	this: IStreamClassInstanceImpl<Type> & IPosed<number> & IBufferized<Type>
) {
	return readBuffer(this)
}

function redefineCurr<Type = any>(
	x: IStreamClassInstanceImpl<Type> & IPosed<number> & IBufferized<Type>
) {
	propDefine(
		x,
		"curr",
		GetSetDescriptor(posBufferIsFrozenGet, currSet as () => any)
	)
}

function getNext<Type = any>(stream: IStreamClassInstanceImpl<Type>) {
	return (stream.curr = stream.baseNextIter())
}

function getPrev<Type = any>(stream: IReversedStreamClassInstanceImpl<Type>) {
	return (stream.curr = stream.basePrevIter())
}

function updateNext<Type = any>(stream: IStreamClassInstanceImpl<Type>) {
	stream.baseNextIter()
	return stream.update!()
}

function updatePrev<Type = any>(
	stream: IReversedStreamClassInstanceImpl<Type>
) {
	stream.basePrevIter()
	return (stream.curr = stream.currGetter!())
}

// * function for generation of possible '.next' methods
function generateIterationMethods(
	nextGetter: (x: IStreamClassInstanceImpl) => any,
	prevGetter: (x: IReversedStreamClassInstanceImpl) => any
) {
	type QuartetConfig = [
		(x: IStreamClassInstanceImpl, last: any) => any,
		(x: IStreamClassInstanceImpl) => any,
		[
			(x: IStreamClassInstanceImpl) => any,
			(x: IReversedStreamClassInstanceImpl) => any
		],
		[
			(x: IStreamClassInstanceImpl) => boolean,
			(x: IStreamClassInstanceImpl) => any
		]?,
		((x: IReversedStreamClassInstanceImpl) => boolean)?
	]

	function generateQuartet([
		nextPreAction,
		endAction,
		[nextAction, prevAction],
		alt,
		optionalPrevCondition
	]: QuartetConfig) {
		const [fastNext, fastPrev] = (() => {
			function altNext<Type = any>(this: IStreamClassInstanceImpl<Type>) {
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
					function <Type = any>(
						this: IStreamClassInstanceImpl<Type>
					) {
						const last = this.curr
						if (altCondition(this)) altAction(this)
						else altNext.call(this)
						return last
					},
					function <Type = any>(
						this: IReversedStreamClassInstanceImpl<Type>
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
					this: IReversedStreamClassInstanceImpl<Type>
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

		function next<Type = any>(this: IStreamClassInstanceImpl<Type>) {
			const last = this.curr
			deStart(this)
			;(this.next = fastNext as () => Type)()
			return last
		}

		function prev<Type = any>(
			this: IReversedStreamClassInstanceImpl<Type>
		) {
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

	const posNextAction = (x: IStreamClassInstanceImpl & IPosed<number>) => {
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
					(x: IReversedStreamClassInstanceImpl & IPosed<number>) => {
						positionDecrement(x)
						prevGetter(x)
					}
				]
			],
			[
				bufferPush as (
					x: IStreamClassInstanceImpl & IBufferized
				) => any,
				bufferFreeze as (
					x: IStreamClassInstanceImpl & IBufferized
				) => any,
				[nextGetter, prevGetter]
			],
			[
				bufferPush as (
					x: IStreamClassInstanceImpl & IBufferized
				) => any,
				(
					x: IStreamClassInstanceImpl & IBufferized & IPosed<number>
				) => {
					bufferFreeze(x)
					redefineCurr(x)
				},
				[
					posNextAction,
					(
						x: IStreamClassInstanceImpl &
							IBufferized &
							IPosed<number>
					) => {
						positionDecrement(x)
						readBuffer(x)
					}
				],
				[
					(x: IStreamClassInstanceImpl & IBufferized) =>
						x.buffer.isFrozen,
					(
						x: IStreamClassInstanceImpl &
							IBufferized &
							IPosed<number>
					) => {
						if (x.pos !== x.buffer.size - 1) {
							positionIncrement(x)
							readBuffer(x)
						}
					}
				],
				(x: IStreamClassInstanceImpl & IPosed<number>) => x.pos === 0
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
