import type { Summat } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "../interfaces.js"
import type { PositionalInputtedStream } from "./interfaces.js"
import {
	underStreamCurr,
	underStreamIsEnd,
	underStreamDefaultIsEnd
} from "../UnderStream/methods.js"
import { effectiveInputStreamInitialize } from "../InputStream/methods.js"
import { positionalStreamNext } from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const PositionalStreamBase = StreamClass({
	isCurrEnd: underStreamIsEnd,
	baseNextIter: positionalStreamNext,
	currGetter: underStreamCurr,
	defaultIsEnd: underStreamDefaultIsEnd
})

export class PositionalStream<Type = any>
	extends PositionalStreamBase
	implements PositionalInputtedStream<Type>
{
	pos: number
	input: BasicStream<Type>
	init: (input?: BasicStream<Type>) => PositionalStream<Type>

	super: Summat

	constructor(input?: BasicStream<Type>) {
		super()
		this.init(input)
	}
}

Object.defineProperties(PositionalStream.prototype, {
	super: { value: PositionalStreamBase.prototype },
	init: { value: effectiveInputStreamInitialize }
})
