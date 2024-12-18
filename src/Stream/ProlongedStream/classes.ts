import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type {
	PatternStreamConstructor,
	StreamClassInstance
} from "../StreamClass/interfaces.js"
import type { ProlongedStream as EffectivProlongedStream } from "./interfaces.js"

import {
	prolongedStreamIsEnd,
	prolongedStreamNext,
	prolongedStreamCurr,
	prolongedStreamDefaultIsEnd,
	prolongedStreamInitialize
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"
import { extendPrototype } from "../../utils.js"

const ProlongedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: prolongedStreamCurr,
		isCurrEnd: prolongedStreamIsEnd,
		baseNextIter: prolongedStreamNext,
		defaultIsEnd: prolongedStreamDefaultIsEnd,
		hasPosition,
		buffer,
		isPattern: true
	}) as PatternStreamConstructor<Type>

export function ProlongedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (streams?: BasicStream<Type>[]) => EffectivProlongedStream<Type> {
	const baseClass = ProlongedStreamBase(hasPosition, buffer)
	class prolongedStream extends baseClass implements EffectivProlongedStream<Type> {
		value: StreamClassInstance<Type>[]
		streamIndex: number

		init: (streams?: BasicStream<Type>[]) => EffectivProlongedStream<Type>
		super: Summat

		constructor(streams?: BasicStream<Type>[]) {
			super(streams)
			this.init(streams)
		}
	}

	extendPrototype(prolongedStream, {
		super: { value: baseClass.prototype },
		init: { value: prolongedStreamInitialize<Type> }
	})

	return prolongedStream
}
