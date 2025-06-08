import type { IStream } from "../../../interfaces.js"
import { ArrayStream } from "./ArrayStream.js"

export class InterleaveStream extends ArrayStream.generic!<any, IStream>() {
	private index: number = 0

	private get currStream() {
		return this.items[this.index]
	}

	private nextStream() {
		this.index = (this.index + 1) % this.items.length
	}

	protected baseNextIter() {
		this.nextStream()
		this.currStream.next()
		return this.currStream.curr
	}

	isCurrEnd(): boolean {
		return this.items.some((x) => x.isCurrEnd())
	}
}
