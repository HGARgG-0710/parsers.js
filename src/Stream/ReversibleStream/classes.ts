import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ReversibleStream,
	ReversedStream as ReversedStreamType,
	BasicReversibleStream
} from "./interfaces.js"

import {
	inputRewind,
	inputCurr,
	inputPrev,
	inputIsStart,
	inputNext,
	inputIsEnd,
	inputDefaultIsStart,
	inputFinish
} from "../StreamClass/methods.js"
import { reversedStreamInitialize } from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"

const ReversedStreamBase = StreamClass({
	currGetter: inputCurr,
	baseNextIter: inputPrev,
	basePrevIter: inputNext,
	isCurrEnd: inputIsStart,
	isCurrStart: inputIsEnd,
	defaultIsEnd: inputDefaultIsStart
}) as new () => ReversedStreamClassInstance

export class ReversedStream<Type = any>
	extends ReversedStreamBase
	implements ReversedStreamType<Type>
{
	input: BasicReversibleStream<Type>
	init: (input?: BasicReversibleStream) => ReversedStream<Type>
	super: Summat

	constructor(input?: ReversibleStream<Type>) {
		super()
		this.init(input)
	}
}

Object.defineProperties(ReversedStream.prototype, {
	super: { value: ReversedStreamBase.prototype },
	rewind: { value: inputFinish },
	finish: { value: inputRewind },
	init: { value: reversedStreamInitialize }
})
