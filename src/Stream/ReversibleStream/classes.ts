import type { Summat } from "@hgargg-0710/summat.ts"
import type { AbstractConstructor } from "../StreamClass/refactor.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IReversedStream, ReversibleStream } from "./interfaces.js"

import { valueDelegate, valuePropDelegate, withSuper } from "src/refactor.js"
import { valueIsCurrEnd } from "../StreamClass/refactor.js"
import { valueCurr } from "../StreamClass/refactor.js"
import { StreamClass } from "../StreamClass/abstract.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./refactor.js"
const { init } = methods

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
	}) as AbstractConstructor<[any], ReversedStreamClassInstance<Type> & Pattern>

export function ReversedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (value?: ReversibleStream<Type>) => IReversedStream<Type> {
	const baseClass = ReversedStreamBase(hasPosition, buffer)
	class reversedStream extends baseClass implements IReversedStream<Type> {
		value: ReversibleStream<Type>
		init: (value?: ReversibleStream<Type>) => IReversedStream<Type>
		super: Summat

		constructor(value?: ReversibleStream<Type>) {
			super(value)
			this.init(value)
		}
	}

	withSuper(reversedStream, baseClass, {
		rewind: ConstDescriptor(valueFinish),
		finish: ConstDescriptor(valueRewind),
		init: ConstDescriptor(init)
	})

	return reversedStream
}
