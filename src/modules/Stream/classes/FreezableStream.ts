import { boolean, number, type } from "@hgargg-0710/one"
import { OutputBuffer } from "src/internal/OutputBuffer.js"
import type { IBufferized } from "../../../interfaces.js"
import type {
	IOwnedStream,
	IPosition,
	IPredicatePosition
} from "../../../interfaces/Stream.js"
import { uniNavigate } from "../../../utils/Stream.js"
import { direction } from "../utils/Position.js"
import { PosStream } from "./PosStream.js"

const { max } = number
const { isNumber } = type
const { T } = boolean

export class FreezableStream<Type = any>
	extends PosStream<Type>
	implements IBufferized<Type>
{
	resource?: IOwnedStream<Type> | undefined

	readonly buffer = new OutputBuffer()

	private _isEnd: boolean
	private _isStart: boolean
	private _curr: Type

	get isStart() {
		return this._isStart
	}

	get isEnd() {
		return this._isEnd
	}

	get curr() {
		return this._curr
	}

	private set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	private set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	private set curr(newCurr: Type) {
		this._curr = newCurr
	}

	private update() {
		return (this.curr = this.buffer.read(this.pos))
	}

	private lastPos() {
		return this.buffer.size - 1
	}

	private posGap() {
		return this.lastPos() - this.pos
	}

	private navigateNumber(relativePos: number) {
		const posGap = this.posGap()
		if (this.isFrozen() || posGap >= relativePos) {
			this.pos = max(this.pos + relativePos, 0)
			return this.update()
		}
		this.forward(max(0, posGap))
		uniNavigate(this, relativePos - posGap)
	}

	private navigatePredicate(relativePos: IPredicatePosition) {
		if (direction(relativePos)) uniNavigate(this, relativePos)
		else while (!relativePos(this) && this.isCurrStart()) this.prev()
	}

	private isFrozen() {
		return this.buffer.isFrozen
	}

	private baseNextIter() {
		this.forward()
		this.update()
	}

	private basePrevIter() {
		this.backward()
		this.update()
	}

	private willBeBeyoundBuffer() {
		return this.pos === this.lastPos()
	}

	private bufferize(newElem: Type) {
		this.buffer.push(newElem)
	}

	private endStream() {
		this.isEnd = true
	}

	private startStream() {
		this.isStart = true
	}

	private freeze() {
		this.buffer.freeze()
		this.endStream()
	}

	private handleUnbufferizedNext() {
		this.bufferize(this.curr)
		this.resource!.next()
		this.baseNextIter()
		if (this.resource!.isEnd) this.freeze()
	}

	isCurrEnd(): boolean {
		return this.isFrozen()
			? this.willBeBeyoundBuffer()
			: this.resource!.isCurrEnd()
	}

	next() {
		const curr = this.curr
		this.isStart = false
		if (!this.willBeBeyoundBuffer()) this.baseNextIter()
		else if (this.isFrozen()) this.endStream()
		else this.handleUnbufferizedNext()
		return curr
	}

	prev() {
		const lastCurr = this.curr
		this.isEnd = false
		if (this.isCurrStart()) this.startStream()
		else this.basePrevIter()
		return lastCurr
	}

	navigate(relativePos: IPosition<Type>) {
		if (isNumber(relativePos)) this.navigateNumber(relativePos)
		else this.navigatePredicate(relativePos)
		return this.curr
	}

	finish() {
		if (!this.isFrozen()) return this.navigate(T)
		this.pos = this.lastPos()
		this.update()
		return this.curr
	}

	rewind() {
		this.startStream()
		this.pos = 0
		this.update()
		return this.curr
	}
}
