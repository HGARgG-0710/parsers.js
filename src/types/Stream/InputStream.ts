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
import {
	StreamCurrGetter,
	StreamEndingHandler,
	StreamStartHandler
} from "./StreamEndingHandler.js"
import { inputStreamFinish, type FinishableStream } from "./FinishableStream.js"
import { inputStreamIsEnd, type Inputted } from "./BasicStream.js"
import { inputStreamCurr } from "./PreBasicStream.js"
import { inputStreamtNext } from "./StreamIterable.js"

export interface InputStream<Type = any>
	extends PositionalStream<Type, number>,
		IterableStream<Type>,
		NavigableStream<Type>,
		ReversibleStream<Type>,
		RewindableStream<Type>,
		CopiableStream<Type>,
		FinishableStream<Type>,
		Inputted<Indexed> {}

// ? [general idea]: use the global this-based functions + data fields instead of this (for purposes of potential memory-saving? No need to create function every time, only just to reference);
export function InputStream<Type = any>(input: Indexed<Type>): InputStream<Type> {
	return StreamStartHandler(
		StreamEndingHandler(
			StreamCurrGetter(
				{
					input,
					pos: 0,
					next: inputStreamtNext<Type>,
					prev: inputStreamtPrev<Type>,
					rewind: inputStreamRewind<Type>,
					copy: inputStreamCopy<Type>,
					navigate: inputStreamNavigate,
					finish: inputStreamFinish,
					[Symbol.iterator]: inputStreamIterator
				},
				inputStreamCurr<Type>
			),
			inputStreamIsEnd<Type>
		),
		inputStreamIsStart<Type>
	) as InputStream<Type>
}
