import { inputStreamNavigate, type NavigableStream } from "./NavigableStream.js"
import type { PositionalStream } from "./PositionalStream.js"
import type { Indexed } from "../Indexed.js"
import { inputStreamIterator, type IterableStream } from "./IterableStream.js"
import {
	inputStreamIsStart,
	inputStreamtPrev,
	type ReversibleStream
} from "./ReversibleStream.js"
import { inputStreamCopy, type CopiableStream } from "./CopiableStream.js"
import { inputStreamRewind, type RewindableStream } from "./RewindableStream.js"
import { StreamEndingHandler } from "./StreamEndingHandler.js"
import { inputStreamFinish, type FinishableStream } from "./FinishableStream.js"
import { inputStreamIsEnd } from "./BasicStream.js"
import { inputStreamtNext } from "./PreBasicStream.js"
import { inputStreamCurr } from "./PreBasicStream.js"

// ? [general idea]: use the global this-based functions + data fields instead of this (for purposes of potential memory-saving? No need to create function every time, only just to reference);
export function InputStream<Type = any>(
	input: Indexed<Type>
): PositionalStream<Type> &
	IterableStream<Type> &
	NavigableStream<Type> &
	ReversibleStream<Type> &
	RewindableStream<Type> &
	CopiableStream<Type> &
	FinishableStream<Type> {
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
			finish: inputStreamFinish,
			[Symbol.iterator]: inputStreamIterator
		},
		inputStreamIsEnd
	) as PositionalStream<Type> &
		IterableStream<Type> &
		NavigableStream<Type> &
		ReversibleStream<Type> &
		RewindableStream<Type> &
		CopiableStream<Type> &
		FinishableStream<Type>
}
