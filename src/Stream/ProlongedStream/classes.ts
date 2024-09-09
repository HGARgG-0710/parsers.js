import type { BasicStream } from "../BasicStream/interfaces.js"
import { effectiveNestedStreamNext } from "../NestedStream/methods.js"
import { StreamClass } from "../StreamClass/classes.js"
import { Inputted } from "../UnderStream/classes.js"
import type { EffectiveProlongedStream } from "./interfaces.js"
import { effectiveProlongedStreamIsEnd, prolongedStreamCurr } from "./methods.js"

export const ProlongedStreamClass = StreamClass({
	currGetter: prolongedStreamCurr,
	isCurrEnd: effectiveProlongedStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext
})

export function ProlongedStream<Type = any>(
	streams: BasicStream<Type>[]
): EffectiveProlongedStream<Type> {
	const result = Inputted(ProlongedStreamClass(), streams)
	result.pos = 0
	result.streamIndex = 0
	return result as EffectiveProlongedStream<Type>
}
