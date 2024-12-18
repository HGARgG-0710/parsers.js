import type { Summat } from "@hgargg-0710/summat.ts"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type {
	ReversibleStream,
	BasicReversibleStream,
	ReversedStream as ReversedStreamType
} from "./interfaces.js"

import {
	valueRewind,
	valueCurr,
	valuePrev,
	valueIsStart,
	valueNext,
	valueIsEnd,
	valueDefaultIsStart,
	valueFinish
} from "../../Pattern/methods.js"

import { reversedStreamInitialize } from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"
import { extendPrototype } from "../../utils.js"

const ReversedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: valueCurr,
		baseNextIter: valuePrev,
		basePrevIter: valueNext,
		isCurrEnd: valueIsStart,
		isCurrStart: valueIsEnd,
		defaultIsEnd: valueDefaultIsStart,
		hasPosition,
		buffer,
		isPattern: true
	}) as PatternReversedStreamConstructor<Type>

export function ReversedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) {
	const baseClass = ReversedStreamBase(hasPosition, buffer)
	class reversedStream extends baseClass implements ReversedStreamType<Type> {
		value: BasicReversibleStream<Type>
		init: (value?: BasicReversibleStream) => ReversedStreamType<Type>
		super: Summat

		constructor(value?: ReversibleStream<Type>) {
			super(value)
			this.init(value)
		}
	}

	extendPrototype(reversedStream, {
		super: { value: baseClass.prototype },
		rewind: { value: valueFinish },
		finish: { value: valueRewind },
		init: { value: reversedStreamInitialize }
	})

	return reversedStream
}
