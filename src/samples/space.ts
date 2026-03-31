import { BadId } from "../constants.js"
import type { ICommonStream, IOwnedStream, IStream } from "../interfaces.js"
import { DyssyncOwningStream } from "../modules/Stream/objects/templates.js"
import { FilterStream, IndexStream } from "../objects/Stream.js"
import { isSpace } from "./alphabet.js"
import { isWindows } from "./platform.js"
import { isCurr } from "./Stream.js"

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
export class LFStream
	extends DyssyncOwningStream<string>
	implements ICommonStream<string>
{
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

	override baseInit(): void {
		this.lastItem.init(this.resource!)
		this.lookahead.init(this.resource!)
		this.updateItems()
	}

	free() {}

	// ! pre-doc: explanation: LFStream is ONLY intended to be used AT THE BEGINNING of the parser - AT THE VERY TOP.
	// * 	Meaning to say - this is a NON-RECURSIVE, one-time deal. It's just simpler this way.
	// 		It NEVER gets reused (since it only ever dies when the input dies as well...)
	get poolId() {
		return BadId
	}

	override next() {
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
 * Returns a crossplatform newline character value.
 */
export function getNewline() {
	return toNewline(!isWindows())
}

/**
 * This is an `IIndexStream<string>`, which treats all the
 * LF-newlines as newline characters in respect to its
 * `LineIndex`-couting operation.
 * */
export const NewlineStream = IndexStream(isCurr("\n"))

export function toNewline(isLF: boolean) {
	return isLF ? LF() : CRLF()
}

/**
 * This function splits a given string `s` by newlines in 
 * a cross-platform fashion, and returns the result
*/
export function splitNewlines(s: string) {
	return s.split(CRLF()).join(LF()).split(LF())
}

export function CRLF() {
	return "\r\n"
}

export function LF() {
	return "\n"
}
