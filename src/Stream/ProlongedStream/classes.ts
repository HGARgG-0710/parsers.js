import type { BasicStream } from "../BasicStream/interfaces.js"
import { effectiveNestedStreamNext } from "../NestedStream/methods.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { EffectiveProlongedStream } from "./interfaces.js"
import {
	effectiveProlongedStreamIsEnd,
	prolongedStreamCurr,
	prolongedStreamDefaultIsEnd,
	prolongedStreamInitialize
} from "./methods.js"

export const ProlongedStreamBase = StreamClass({
	currGetter: prolongedStreamCurr,
	isCurrEnd: effectiveProlongedStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	defaultIsEnd: prolongedStreamDefaultIsEnd
})

export class ProlongedStream<Type = any>
	extends ProlongedStreamBase
	implements EffectiveProlongedStream<Type>
{
	input: StreamClassInstance<Type>[]
	pos: number
	streamIndex: number

	init: (streams?: BasicStream<Type>[]) => ProlongedStream<Type>

	constructor(streams?: BasicStream<Type>[]) {
		super()
		this.init(streams)
		super.init()
	}
}

Object.defineProperties(ProlongedStream.prototype, {
	init: { value: prolongedStreamInitialize }
})
