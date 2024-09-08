import type { Indexed } from "../interfaces.js"
import {
	ForwardStreamIterationHandler,
	BackwardStreamIterationHandler,
	StreamCurrGetter
} from "../StreamClass/classes.js"
import { inputStreamRewind } from "./methods.js"
import { inputStreamNavigate } from "./methods.js"
import { inputStreamPrev } from "./methods.js"
import { inputStreamNext } from "./methods.js"
import { inputStreamIsEnd } from "./methods.js"
import { inputStreamCopy } from "./methods.js"
import { inputStreamFinish } from "./methods.js"
import { inputStreamIterator } from "./methods.js"
import { inputStreamCurr } from "./methods.js"
import { inputStreamIsStartGetter } from "./methods.js"
import type { InputStream } from "./interfaces.js"

export function InputStream<Type = any>(input: Indexed<Type>): InputStream<Type> {
	return ForwardStreamIterationHandler<Type>(
		BackwardStreamIterationHandler<Type>(
			StreamCurrGetter<Type>(
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
