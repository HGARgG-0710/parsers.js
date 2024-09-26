import type { Indexed } from "../interfaces.js"
import type { EffectiveInputStream } from "./interfaces.js"

import { StreamClass } from "../StreamClass/classes.js"

import {
	inputStreamDefaultIsEnd,
	effectiveInputStreamRewind,
	inputStreamInitialize,
	inputStreamCurr,
	inputStreamIsStart,
	inputStreamIterator,
	inputStreamFinish,
	effectiveInputStreamCopy,
	inputStreamIsEnd,
	inputStreamNext,
	inputStreamPrev,
	effectiveInputStreamNavigate
} from "./methods.js"

export const InputStreamBase = StreamClass({
	currGetter: inputStreamCurr,
	baseNextIter: inputStreamNext,
	basePrevIter: inputStreamPrev,
	isCurrEnd: inputStreamIsEnd,
	isCurrStart: inputStreamIsStart,
	defaultIsEnd: inputStreamDefaultIsEnd
})

export class InputStream<Type = any>
	extends InputStreamBase
	implements EffectiveInputStream<Type>
{
	pos: number
	input: Indexed<Type>

	finish: () => Type
	rewind: () => Type
	navigate: () => Type
	copy: () => EffectiveInputStream<Type>

	prev: () => Type
	isCurrStart: () => boolean

	init: (input?: Indexed<Type>) => EffectiveInputStream<Type>

	constructor(input?: Indexed<Type>) {
		super()
		this.init(input)
		super.init()
	}
}

Object.defineProperties(InputStream.prototype, {
	rewind: { value: effectiveInputStreamRewind },
	finish: { value: inputStreamFinish },
	navigate: { value: effectiveInputStreamNavigate },
	copy: { value: effectiveInputStreamCopy },
	init: { value: inputStreamInitialize },
	[Symbol.iterator]: { value: inputStreamIterator }
})
