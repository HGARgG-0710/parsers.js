import type { BasicStream } from "../BasicStream/interfaces.js"
import { positionalStreamNext } from "./methods.js"
import { StreamClass } from "../StreamClass/classes.js"
import {
	underStreamCurr,
	underStreamIsEnd,
	underStreamDefaultIsEnd
} from "../UnderStream/methods.js"
import type { PositionalInputtedStream } from "./interfaces.js"
import { inputStreamInitialize } from "../InputStream/methods.js"

export const PositionalStreamBase = StreamClass({
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

	constructor(input?: BasicStream<Type>) {
		super()
		this.init(input)
		super.init()
	}
}

Object.defineProperties(PositionalStream.prototype, {
	init: { value: inputStreamInitialize }
})
