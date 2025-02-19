import type { Summat } from "@hgargg-0710/summat.ts"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type {
	BasicReversibleStream,
	ReversedStream as IReversedStream
} from "./interfaces.js"

import { valueDelegate, valuePropDelegate, withSuper } from "src/refactor.js"
import { valueIsCurrEnd } from "../StreamClass/refactor.js"
import { valueCurr } from "../StreamClass/refactor.js"
import { StreamClass } from "../StreamClass/abstract.js"
import { reversedStreamInitialize } from "./refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

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
): new (value?: BasicReversibleStream<Type>) => IReversedStream<Type> {
	const baseClass = ReversedStreamBase(hasPosition, buffer)
	class reversedStream extends baseClass implements IReversedStream<Type> {
		value: BasicReversibleStream<Type>
		init: (value?: BasicReversibleStream<Type>) => IReversedStream<Type>
		super: Summat

		constructor(value?: BasicReversibleStream<Type>) {
			super(value)
			this.init(value)
		}
	}

	withSuper(reversedStream, baseClass, {
		rewind: ConstDescriptor(valueFinish),
		finish: ConstDescriptor(valueRewind),
		init: ConstDescriptor(reversedStreamInitialize)
	})

	return reversedStream
}
