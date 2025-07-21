import {
	DyssyncOwningStream,
	FilterStream,
	IndexStream
} from "../classes/Stream.js"
import type { IOwnedStream, IStream } from "../interfaces.js"
import { isSpace } from "./alphabet.js"

class LastItem<T = any> {
	private lastItem: T
	private stream?: IStream<T>

	sync() {
		this.lastItem = this.stream!.curr
	}

	get() {
		return this.lastItem
	}

	init(stream: IStream<T>) {
		this.stream = stream
	}
}

class Lookahead<T = any> {
	private lookaround: T
	private stream?: IStream<T>

	private getLookahead() {
		this.stream!.next()
		return this.stream!.curr
	}

	advance() {
		this.lookaround = this.getLookahead()
	}

	get() {
		return this.lookaround
	}

	init(stream: IStream<T>) {
		this.stream = stream
	}
}

/**
 * This is a stream that accepts an `IOwnedStream<string>` as its `.resource`,
 * and which produces a stream of `string`s such that all `\r\n` are replaced
 * by `\n`.
 */
export class LFStream extends DyssyncOwningStream.generic!<string>() {
	private readonly lastItem = new LastItem()
	private readonly lookahead = new Lookahead()

	private defineCurr() {
		if (this.isCRLF()) {
			this.curr = "\n"
			this.lastItem.sync()
			this.lookahead.advance()
		} else this.curr = this.lastItem.get()
	}

	private isCRLF() {
		return this.lastItem.get() === "\r" && this.lookahead.get() === "\n"
	}

	private updateItems() {
		this.lastItem.sync()
		this.lookahead.advance()
		this.defineCurr()
	}

	setResource(newResource: IOwnedStream): void {
		super.setResource(newResource)
		this.lastItem.init(this.resource!)
		this.lookahead.init(this.resource!)
		this.updateItems()
	}

	next() {
		super.next()
		this.updateItems()
	}
}

/**
 * A Stream that ignores all the space characters
 * (i.e. removes all `"\t"`, `"\n"`, and `" "`)
 * from its predecessor.
 */
export const SpacelessStream = FilterStream(
	(input: IOwnedStream<string>) => !isSpace(input.curr)
)

/**
 * Returns an OS-sensetive newline character value.
 */
export function getNewline() {
	return process.platform === "win32" ? "\r\n" : "\n"
}

/**
 * This is an `IIndexStream<string>`, which treats all the
 * LF-newlines as newline characters in respect to its
 * `LineIndex`-couting operation.
 * */
export const NewlineStream = IndexStream(
	(input: IOwnedStream<string>) => input.curr === "\n"
)
