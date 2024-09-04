import type { Indexed } from "../interfaces.js"
import {
	ForwardStreamIterationHandler,
	BackwardStreamIterationHandler,
	StreamCurrGetter,
	inputStreamRewind,
	inputStreamNavigate,
	inputStreamPrev
} from "_src/types.js"
import { inputStreamNext } from "../BasicStream/methods.js"
import { inputStreamIsEnd } from "../PreBasicStream/methods.js"
import { inputStreamCopy } from "../CopiableStream/methods.js"
import { inputStreamFinish } from "../FinishableStream/methods.js"
import { inputStreamIterator } from "../IterableStream/methods.js"
import { inputStreamCurr } from "../PreBasicStream/methods.js"
import { inputStreamIsStartGetter } from "../ReversibleStream/methods.js"
import type { InputStream } from "./interfaces.js"

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
