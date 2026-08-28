import { BadId } from "../global/constants.js"
import type {
	ICommonStream,
	IOwnedStream,
	IStream
} from "../interfaces.js"
import { DyssyncOwningStream } from "../modules/Stream/objects/templates.js"
import { FilterStream, IndexStream } from "../objects/Stream.js"
import { isSpace } from "./alphabet.js"
import { isWindows } from "./platform.js"
import { isCurr } from "./Stream.js"

class LastItem<T = any> {
	private lastItem: T | null = null

	sync(latest: T) {
		this.lastItem = latest
	}

	isUnset() {
		return this.lastItem === null
	}

	unset() {
		this.lastItem = null
	}

	get(): T {
		return this.lastItem!
	}
}

class Lookahead<T = any> {
	private lookahead: T | null = null
	private stream?: IStream<T>

	private getNewLookahead() {
		this.stream!.next()
		return this.stream!.isEnd ? null : this.stream!.curr
	}

	sync(lastItem: T) {
		this.lookahead = lastItem
	}

	update() {
		this.lookahead = this.getNewLookahead()
	}

	get(): T {
		return this.lookahead!
	}

	isUnset() {
		return this.lookahead === null
	}

	unset() {
		this.lookahead = null
	}

	init(stream: IStream<T>) {
		this.stream = stream
		this.lookahead = this.stream!.curr
	}
}

export abstract class SymbolicContractionStream
	extends DyssyncOwningStream<string>
	implements ICommonStream<string>
{
	protected readonly lastItem = new LastItem<string>()
	protected readonly lookahead = new Lookahead<string>()

	protected abstract updateItems(): void

	free() {}

	// ! pre-doc: explanation: children of this stream are ONLY intended to be used AT THE BEGINNING of the parser - AT THE VERY TOP.
	// * 	Meaning to say - this is a NON-RECURSIVE, one-time deal. It's just simpler this way.
	// 		It NEVER gets reused (since it only ever dies when the input dies as well...)
	get poolId() {
		return BadId
	}

	get isUsed() {
		return true
	}

	markFree(): void {}
	markUsed(): void {}

	override isCurrEnd(): boolean {
		return this.lastItem.isUnset()
	}

	override next() {
		if (!this.isCurrEnd()) this.updateItems()
		else this.endStream()
	}
}

/**
 * Reduces an arbitrarily long sequence of spaces in the underlying
 * `IOwnedStream<string>` to a single one (the last one).
 *
 * Note: it *does not* handle \r\n, only single-sequence spaces.
 */
export class SingleSpaceStream
	extends SymbolicContractionStream
	implements ICommonStream<string>
{
	private advance() {
		this.lastItem.sync(this.lookahead.get())
		this.lookahead.update()
	}

	protected updateItems() {
		if (this.lookahead.isUnset()) {
			this.curr = this.lastItem.get()
			this.lastItem.unset()
		} else {
			this.advance()
			this.defineCurr()
		}
	}

	private defineCurr() {
		this.curr = this.isCurrUnacceptable()
			? this.getModifiedCurr()
			: this.lastItem.get()
	}

	override baseInit(): void {
		this.lookahead.init(this.resource!)
		this.updateItems()
	}

	private hasSecondSpace() {
		return isSpace(this.lookahead.get())
	}

	private isCurrUnacceptable(): boolean {
		return isSpace(this.lastItem.get()) && this.hasSecondSpace()
	}

	private getModifiedCurr() {
		while (this.hasSecondSpace()) {
			this.advance()
			if (this.resource!.isEnd) break
		}
		return this.lastItem.get()
	}
}

/**
 * This is a stream that accepts an `IOwnedStream<string>` as its `.resource`,
 * and which produces a stream of `string`s such that all `\r\n` are replaced
 * by `\n`.
 */
export class LFStream
	extends SymbolicContractionStream
	implements ICommonStream<string>
{
	protected readonly secondLookahead = new Lookahead<string>()

	protected updateItems() {
		if (this.isLeftCrlf()) this.handleLeftCrlf()
		else this.handleFreeLeft()
	}

	private handleFreeLeft() {
		this.readCurr()
		if (this.lookahead.isUnset()) this.lastItem.unset()
		else {
			this.expectRightCrlf()
			this.advance()
		}
	}

	private expectRightCrlf() {
		if (this.isRightCrlf()) {
			this.lookahead.sync("\n")
			this.secondLookahead.update()
		}
	}

	private handleLeftCrlf() {
		this.curr = "\n"
		this.advance()
		this.advance()
	}

	override baseInit(): void {
		this.lookahead.init(this.resource!)
		this.secondLookahead.init(this.resource!)
		this.secondLookahead.update()
		if (this.lastItem.isUnset() && this.secondLookahead.isUnset())
			this.advance()
		this.updateItems()
	}

	private readCurr() {
		this.curr = this.lastItem.get()
	}

	private advance(): void {
		this.lastItem.sync(this.lookahead.get())
		this.lookahead.sync(this.secondLookahead.get())
		this.secondLookahead.update()
	}

	private isLeftCrlf() {
		return this.lastItem.get() === "\r" && this.lookahead.get() === "\n"
	}

	private isRightCrlf() {
		return (
			this.lookahead.get() === "\r" && this.secondLookahead.get() === "\n"
		)
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
