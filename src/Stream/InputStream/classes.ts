import type { Indexed } from "../interfaces.js"
import { inputStreamDefaultIsEnd, effectiveInputStreamRewind } from "./methods.js"
import { effectiveInputStreamNavigate } from "./methods.js"
import { inputStreamPrev } from "./methods.js"
import { inputStreamNext } from "./methods.js"
import { inputStreamIsEnd } from "./methods.js"
import { effectiveInputStreamCopy } from "./methods.js"
import { inputStreamFinish } from "./methods.js"
import { inputStreamIterator } from "./methods.js"
import { inputStreamCurr } from "./methods.js"
import { inputStreamIsStart } from "./methods.js"
import type { EffectiveInputStream } from "./interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import { Inputted } from "../UnderStream/classes.js"

export const InputStreamClass = StreamClass({
	currGetter: inputStreamCurr,
	baseNextIter: inputStreamNext,
	basePrevIter: inputStreamPrev,
	isCurrEnd: inputStreamIsEnd,
	isCurrStart: inputStreamIsStart,
	defaultIsEnd: inputStreamDefaultIsEnd
})

export function InputStream<Type = any>(
	input: Indexed<Type>
): EffectiveInputStream<Type> {
	const result = Inputted(InputStreamClass(), input)
	result.pos = 0
	result.rewind = effectiveInputStreamRewind<Type>
	result.finish = inputStreamFinish<Type>
	result.navigate = effectiveInputStreamNavigate<Type>
	result.copy = effectiveInputStreamCopy<Type>
	result[Symbol.iterator] = inputStreamIterator<Type>
	return result as EffectiveInputStream<Type>
}
