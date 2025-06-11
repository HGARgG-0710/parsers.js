import type { IStream } from "../../../interfaces.js"
import { ArrayStream } from "./ArrayStream.js"

import { array } from "@hgargg-0710/one"
const { lastIndex } = array

/**
 * This is a class that extends `ArrayStream<any, IStream>`. 
 * It contains elements of unknown type, which are obtained from 
 * the `.items: IStream[]`. More specifically, the stream sequentially 
 * concatenates outputs from each one of the given `IStream`s,
 * taking their precise combined time to finish. 
*/
export class ConcatStream extends ArrayStream.generic!<any, IStream>() {
	private index: number = 0

	private get currStream() {
		return this.items[this.index]
	}

	private noMoreStreamsLeft() {
		return lastIndex(this.items) === this.index
	}

	private currStreamDone() {
		return this.currStream.isCurrEnd()
	}

	private nextStream() {
		++this.index
	}

	private nextItem() {
		this.currStream.next()
	}

	private moveOneItemForward() {
		if (this.currStreamDone()) this.nextStream()
		else this.nextItem()
	}

	private currItem() {
		return this.currStream.curr
	}

	protected baseNextIter() {
		this.moveOneItemForward()
		return this.currItem
	}

	isCurrEnd(): boolean {
		return this.currStreamDone() && this.noMoreStreamsLeft()
	}

	copy() {
		return new this.constructor(...this.items.map((x) => x.copy()))
	}
}
