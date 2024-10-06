import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ReversibleStream,
	ReversedStream as ReversedStreamType,
	BasicReversibleStream
} from "./interfaces.js"

import {
	underStreamRewind,
	underStreamCurr,
	underStreamPrev,
	underStreamIsStart,
	underStreamNext,
	underStreamIsEnd,
	underStreamDefaultIsStart,
	underStreamFinish
} from "../UnderStream/methods.js"
import { reversedStreamInitialize } from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const ReversedStreamBase = StreamClass({
	currGetter: underStreamCurr,
	baseNextIter: underStreamPrev,
	basePrevIter: underStreamNext,
	isCurrEnd: underStreamIsStart,
	isCurrStart: underStreamIsEnd,
	defaultIsEnd: underStreamDefaultIsStart
})

export class ReversedStream<Type = any>
	extends ReversedStreamBase
	implements ReversedStreamType<Type>
{
	input: BasicReversibleStream<Type>
	prev: () => Type
	isCurrStart: () => boolean
	rewind: () => Type

	super: Summat

	constructor(input?: ReversibleStream<Type>) {
		super()
		this.init(input)
	}
}

Object.defineProperties(ReversedStream.prototype, {
	super: { value: ReversedStreamBase.prototype },
	rewind: { value: underStreamFinish },
	finish: { value: underStreamRewind },
	init: { value: reversedStreamInitialize }
})
