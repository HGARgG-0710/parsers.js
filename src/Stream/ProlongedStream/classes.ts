import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type {
	PatternStreamConstructor,
	StreamClassInstance
} from "../StreamClass/interfaces.js"
import type { EffectiveProlongedStream } from "./interfaces.js"

import {
	effectiveProlongedStreamIsEnd,
	effectiveProlongedStreamNext,
	prolongedStreamCurr,
	prolongedStreamDefaultIsEnd,
	prolongedStreamInitialize
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const ProlongedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: prolongedStreamCurr,
		isCurrEnd: effectiveProlongedStreamIsEnd,
		baseNextIter: effectiveProlongedStreamNext,
		defaultIsEnd: prolongedStreamDefaultIsEnd,
		hasPosition,
		buffer,
		isPattern: true
	}) as PatternStreamConstructor<Type>

export function ProlongedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (streams?: BasicStream<Type>[]) => EffectiveProlongedStream<Type> {
	const baseClass = ProlongedStreamBase(hasPosition, buffer)
	class prolongedStream extends baseClass implements EffectiveProlongedStream<Type> {
		value: StreamClassInstance<Type>[]
		streamIndex: number

		init: (streams?: BasicStream<Type>[]) => EffectiveProlongedStream<Type>
		super: Summat

		constructor(streams?: BasicStream<Type>[]) {
			super(streams)
			this.init(streams)
		}
	}

	Object.defineProperties(prolongedStream.prototype, {
		super: { value: baseClass.prototype },
		init: { value: prolongedStreamInitialize<Type> }
	})

	return prolongedStream
}
