import { isNumber } from "src/misc.js"
import type { NavigableStream } from "./NavigableStream.js"
import { type Position, positionConvert } from "./Position.js"
import type { PositionalStream } from "./PositionalStream.js"
import type { Indexed } from "../Indexed.js"
import type { IterableStream } from "./IterableStream.js"
import type { ReversibleStream } from "./ReversibleStream.js"
import type { CopiableStream } from "./CopiableStream.js"
import type { RewindableStream } from "./RewindableStream.js"
import { StreamEndingHandler } from "./StreamEndingHandler.js"

// ? [general idea]: use the global this-based functions + data fields instead of this (for purposes of potential memory-saving? No need to create function every time, only just to reference);
export function InputStream<Type = any>(
	input: Indexed<Type>
): PositionalStream<Type> &
	IterableStream<Type> &
	NavigableStream<Type> &
	ReversibleStream<Type> &
	RewindableStream<Type> &
	CopiableStream<Type> {
	return StreamEndingHandler(
		{
			input,
			pos: 0,
			curr: inputStreamCurr,
			next: inputStreamtNext,
			prev: inputStreamtPrev,
			isStart: inputStreamIsStart,
			rewind: inputStreamRewind,
			copy: inputStreamCopy,
			navigate: inputStreamNavigate,
			[Symbol.iterator]: inputStreamIterator
		},
		inputStreamIsEnd
	) as PositionalStream<Type> &
		IterableStream<Type> &
		NavigableStream<Type> &
		ReversibleStream<Type> &
		RewindableStream<Type> &
		CopiableStream<Type>
}

export function inputStreamCurr() {
	return this.input[this.pos]
}
export function inputStreamtNext() {
	const prev = this.pos
	this.pos += !this.isEnd
	return this.input[prev]
}
export function inputStreamtPrev() {
	const prev = this.pos
	// ! AGAIN: THIS IS __supposed__ to be used with something that is a PositionalStream with NUMBER '.pos' (this has to be given its own name...); REMOVE the explicit number-conversion...;
	this.pos -= +!this.isStart
	return this.input[prev]
}
export function inputStreamIsEnd() {
	return this.pos >= this.input.length
}
export function inputStreamRewind() {
	return this.input[(this.pos = 0)]
}
export function inputStreamCopy() {
	const inputStream = InputStream(this.input)
	inputStream.pos = this.pos
	return inputStream
}
export function inputStreamIsStart() {
	return !this.pos
}
export function* inputStreamIterator() {
	while (this.pos < this.input.length) {
		yield this.input[this.pos]
		++this.pos
	}
}
export function inputStreamNavigate(
	this: PositionalStream & NavigableStream,
	index: Position
) {
	index = positionConvert(index)
	if (isNumber(index)) return this.input[(this.pos = index)]
	while (!this.isEnd && !index(this)) this.next()
	// TODO: REWRITE the interface in a fashion that this "as" information be supplied AS A PART OF THEM. Example: here, the 'inputStreamNavigate' is SUPPOSED to be used with a 'number' OR 'PositionObject' as '.pos';
	return this.input[positionConvert(this.pos) as number]
}
