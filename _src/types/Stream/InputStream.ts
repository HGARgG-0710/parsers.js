import { inputStreamNavigate, type NavigableStream } from "./NavigableStream.js"
import type { PositionalStream } from "./PositionalStream.js"
import type { Indexed } from "../../misc.js"
import { inputStreamIterator, type IterableStream } from "./IterableStream.js"
import { inputStreamPrev, type ReversibleStream } from "./ReversibleStream.js"
import { inputStreamIsStartGetter } from "./StartedStream.js"
import { inputStreamCopy, type CopiableStream } from "./CopiableStream.js"
import { inputStreamRewind, type RewindableStream } from "./RewindableStream.js"
import {
	BackwardStreamIterationHandler,
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "./StreamIterationHandler.js"
import { inputStreamFinish, type FinishableStream } from "./FinishableStream.js"
import { type Inputted } from "src/interfaces/Inputted.js"
import { inputStreamCurr } from "./PreBasicStream.js"
import { inputStreamNext, inputStreamIsEnd } from "./BasicStream.js"
import type { BaseNextable, BasePrevable } from "src/interfaces/BaseIterable.js"
import type { IsEndCurrable, IsStartCurrable } from "src/interfaces/BoundCheckable.js"

export interface InputStream<Type = any>
	extends PositionalStream<Type, number>,
		IterableStream<Type>,
		NavigableStream<Type>,
		ReversibleStream<Type>,
		RewindableStream<Type>,
		CopiableStream<Type>,
		FinishableStream<Type>,
		Inputted<Indexed>,
		BaseNextable<Type>,
		BasePrevable<Type>,
		IsEndCurrable,
		IsStartCurrable {}

export function InputStream<Type = any>(input: Indexed<Type>): InputStream<Type> {
	return ForwardStreamIterationHandler<Type>(
		BackwardStreamIterationHandler<Type>(
			StreamCurrGetter(
				{
					input,
					pos: 0,
					rewind: inputStreamRewind<Type>,
					copy: inputStreamCopy<Type>,
					navigate: inputStreamNavigate<Type>,
					finish: inputStreamFinish<Type>,
					[Symbol.iterator]: inputStreamIterator<Type>
				},
				inputStreamCurr<Type>
			),
			inputStreamPrev<Type>,
			inputStreamIsStartGetter<Type>
		),
		inputStreamNext<Type>,
		inputStreamIsEnd<Type>
	) as InputStream<Type>
}
