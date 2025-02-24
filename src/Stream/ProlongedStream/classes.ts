import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { StreamClassInstance } from "../StreamClass/interfaces.js"
import type { AbstractConstructor } from "../StreamClass/refactor.js"
import type { ProlongedStream as IProlongedStream } from "./interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

import {
	prolongedStreamIsEnd,
	prolongedStreamNext,
	prolongedStreamCurr,
	prolongedStreamDefaultIsEnd,
	prolongedStreamInitialize
} from "./refactor.js"

import { StreamClass } from "../StreamClass/abstract.js"
import { withSuper } from "src/refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

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
	}) as AbstractConstructor<[any], StreamClassInstance<Type> & Pattern>

export function ProlongedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (streams?: BasicStream<Type>[]) => IProlongedStream<Type> {
	const baseClass = ProlongedStreamBase(hasPosition, buffer)
	class prolongedStream extends baseClass implements IProlongedStream<Type> {
		value: StreamClassInstance<Type>[]
		streamIndex: number

		init: (streams?: BasicStream<Type>[]) => IProlongedStream<Type>
		super: Summat

		constructor(streams?: BasicStream<Type>[]) {
			super(streams)
			this.init(streams)
		}
	}

	withSuper(prolongedStream, baseClass, {
		init: ConstDescriptor(prolongedStreamInitialize<Type>)
	})

	return prolongedStream
}
