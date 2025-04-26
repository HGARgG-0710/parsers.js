import { boolean, number, type } from "@hgargg-0710/one"
import { OutputBuffer } from "src/internal/Collection/Sequence/OutputBuffer.js"
import type { IPosition, IPredicatePosition } from "../interfaces.js"
import { direction } from "../Position/utils.js"
import { uniNavigate } from "../utils.js"
import { PosStream } from "./PosStream.js"

const { max } = number
const { isNumber } = type
const { T } = boolean

export class FreezableStream<Type = any> extends PosStream<Type> {
	readonly buffer = new OutputBuffer()

	private update() {
		return (this.curr = this.buffer.read(this.pos))
	}

	private posValid() {
		return this.pos > 0
	}

	private lastPos() {
		return this.buffer.size - 1
	}

	private isAlivePos() {
		return !this.isFrozen() || this.pos > this.lastPos()
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
		else while (!relativePos(this) && this.posValid()) this.prev()
	}

	isFrozen() {
		return this.buffer.isFrozen
	}

	next() {
		const curr = this.curr
		this.isStart = false
		if (this.isCurrEnd()) this.freeze()
		else {
			if (this.isAlivePos()) this.buffer.push(curr)
			this.forward()
			this.update()
		}
		return curr
	}

	prev() {
		const lastCurr = this.curr
		this.isEnd = false
		if (this.posValid()) {
			this.backward()
			this.update()
		}
		return lastCurr
	}

	freeze() {
		this.isEnd = true
		this.buffer.freeze()
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
		this.isStart = true
		this.pos = 0
		this.update()
		return this.curr
	}
}
