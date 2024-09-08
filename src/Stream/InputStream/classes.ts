import type { Indexed } from "../interfaces.js"
import { inputStreamRewind } from "./methods.js"
import { inputStreamNavigate } from "./methods.js"
import { inputStreamPrev } from "./methods.js"
import { inputStreamNext } from "./methods.js"
import { inputStreamIsEnd } from "./methods.js"
import { inputStreamCopy } from "./methods.js"
import { inputStreamFinish } from "./methods.js"
import { inputStreamIterator } from "./methods.js"
import { inputStreamCurr } from "./methods.js"
import { inputStreamIsStart } from "./methods.js"
import type { InputStream } from "./interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import { Inputted } from "../UnderStream/classes.js"

export const InputStreamClass = StreamClass({
	currGetter: inputStreamCurr,
	baseNextIter: inputStreamNext,
	basePrevIter: inputStreamPrev,
	isCurrEnd: inputStreamIsEnd,
	isCurrStart: inputStreamIsStart
})

export function InputStream<Type = any>(input: Indexed<Type>): InputStream<Type> {
	const result = Inputted(InputStreamClass(), input)
	result.pos = 0
	result.rewind = inputStreamRewind<Type>
	result.finish = inputStreamFinish<Type>
	result.navigate = inputStreamNavigate<Type>
	result.copy = inputStreamCopy<Type>
	result[Symbol.iterator] = inputStreamIterator<Type>
	return result as InputStream<Type>
}
