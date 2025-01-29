import type { Summat } from "@hgargg-0710/summat.ts"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type {
	ReversibleStream,
	BasicReversibleStream,
	ReversedStream as ReversedStreamType
} from "./interfaces.js"

import {
	valueDelegate,
	valuePropDelegate,
	withSuper
} from "src/refactor.js"
import { valueIsCurrEnd } from "../StreamClass/refactor.js"
import { valueCurr } from "../StreamClass/refactor.js"
import { StreamClass } from "../StreamClass/abstract.js"
import { reversedStreamInitialize } from "./refactor.js"

const valueDefaultIsStart = valuePropDelegate("isStart")
const [valuePrev, valueNext, valueIsStart, valueRewind, valueFinish] = [
	"prev",
	"next",
	"isCurrStart",
	"rewind",
	"finish"
].map(valueDelegate)

const ReversedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: valueCurr,
		baseNextIter: valuePrev,
		basePrevIter: valueNext,
		isCurrEnd: valueIsStart,
		isCurrStart: valueIsCurrEnd,
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

	withSuper(reversedStream, baseClass, {
		rewind: { value: valueFinish },
		finish: { value: valueRewind },
		init: { value: reversedStreamInitialize }
	})

	return reversedStream
}
