import { boolean, number, type } from "@hgargg-0710/one"
import { OutputBuffer } from "src/internal/Collection/Sequence/OutputBuffer.js"
import type { IPosition } from "../interfaces.js"
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

	next() {
		const curr = super.next()
		if (!this.buffer.isFrozen && this.pos > this.lastPos())
			this.buffer.push(curr)
		return curr
	}

	prev() {
		const lastCurr = this.curr
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

	isCurrEnd() {
		const isLast = super.isCurrEnd()
		if (isLast) this.buffer.freeze()
		return isLast
	}

	navigate(relativePos: IPosition<Type>) {
		if (isNumber(relativePos)) {
			const { buffer, pos } = this
			const posGap = buffer.size - pos

			if (buffer.isFrozen || posGap > relativePos) {
				this.pos = max(pos + relativePos, 0)
				return this.update()
			}

			this.forward(max(0, posGap))
			while (relativePos--) this.next()
		} else {
			if (direction(relativePos)) uniNavigate(this, relativePos)
			else while (!relativePos(this) && this.posValid()) this.prev()
		}

		return this.curr
	}

	finish() {
		if (this.buffer.isFrozen) {
			this.pos = this.lastPos()
			this.update()
		} else this.navigate(T)

		return this.curr
	}

	rewind() {
		this.isStart = true
		this.pos = 0
		this.update()
		return this.curr
	}
}
