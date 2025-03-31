import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPattern } from "src/interfaces.js"
import type { IConstructor } from "../refactor.js"
import type { IReversedStreamClassInstance } from "../interfaces.js"
import type { IReversedStream } from "./interfaces.js"
import type { IReversibleStream } from "src/Stream/interfaces.js"

import {
	valueDelegate,
	valuePropDelegate,
	withSuper
} from "../../../refactor.js"

import { valueIsCurrEnd } from "../refactor.js"
import { valueCurr } from "../refactor.js"
import { StreamClass } from "../classes.js"

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
	hasBuffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: valueCurr,
		baseNextIter: valuePrev,
		basePrevIter: valueNext,
		isCurrEnd: valueIsStart,
		isCurrStart: valueIsCurrEnd,
		defaultIsEnd: valueDefaultIsStart,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer,
		isPattern: true
	}) as IConstructor<[any], IReversedStreamClassInstance<Type> & IPattern>

// TODO: IMPLEMENT the `.reversed()` method HERE! [it basically just returns the `.value` - NO COPY (same way as with the `this.reversed()` on the value...)];
export function ReversedStream<Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
): new (value?: IReversibleStream<Type>) => IReversedStream<Type> {
	const baseClass = ReversedStreamBase(hasPosition, hasBuffer)
	class reversedStream extends baseClass implements IReversedStream<Type> {
		value: IReversibleStream<Type>
		init: (value?: IReversibleStream<Type>) => IReversedStream<Type>
		super: Summat

		constructor(value?: IReversibleStream<Type>) {
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
