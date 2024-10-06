import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { EffectiveProlongedStream } from "./interfaces.js"
import {
	effectiveProlongedStreamIsEnd,
	effectiveProlongedStreamNext,
	prolongedStreamCurr,
	prolongedStreamDefaultIsEnd,
	prolongedStreamInitialize
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const ProlongedStreamBase = StreamClass({
	currGetter: prolongedStreamCurr,
	isCurrEnd: effectiveProlongedStreamIsEnd,
	baseNextIter: effectiveProlongedStreamNext,
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
	super: Summat

	constructor(streams?: BasicStream<Type>[]) {
		super()
		this.init(streams)
	}
}

Object.defineProperties(ProlongedStream.prototype, {
	super: { value: ProlongedStreamBase.prototype },
	init: { value: prolongedStreamInitialize }
})
