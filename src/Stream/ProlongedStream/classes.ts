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

import { function as _f } from "@hgargg-0710/one"
const { cached } = _f

const ProlongedStreamBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		currGetter: prolongedStreamCurr,
		isCurrEnd: effectiveProlongedStreamIsEnd,
		baseNextIter: effectiveProlongedStreamNext,
		defaultIsEnd: prolongedStreamDefaultIsEnd,
		hasPosition
	})
) as (hasPosition?: boolean) => new () => StreamClassInstance

export function ProlongedStream<Type = any>(
	hasPosition: boolean = false
): new (streams?: BasicStream<Type>[]) => EffectiveProlongedStream<Type> {
	const baseClass = ProlongedStreamBase(hasPosition)
	class prolongedStream extends baseClass implements EffectiveProlongedStream<Type> {
		input: StreamClassInstance<Type>[]
		streamIndex: number

		init: (streams?: BasicStream<Type>[]) => EffectiveProlongedStream<Type>
		super: Summat

		constructor(streams?: BasicStream<Type>[]) {
			super()
			this.init(streams)
		}
	}

	Object.defineProperties(prolongedStream.prototype, {
		super: { value: baseClass.prototype },
		init: { value: prolongedStreamInitialize<Type> }
	})

	return prolongedStream
}
