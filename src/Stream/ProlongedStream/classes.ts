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
} from "./refactor.js"

import { StreamClass } from "../StreamClass/abstract.js"
import { withSuper } from "src/refactor.js"

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

	withSuper(prolongedStream, baseClass, {
		init: { value: prolongedStreamInitialize<Type> }
	})

	return prolongedStream
}
