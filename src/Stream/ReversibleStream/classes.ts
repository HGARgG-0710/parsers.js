import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type {
	ReversibleStream,
	BasicReversibleStream,
	ReversedStream
} from "./interfaces.js"

import {
	inputRewind,
	inputCurr,
	inputPrev,
	inputIsStart,
	inputNext,
	inputIsEnd,
	inputDefaultIsStart,
	inputFinish
} from "../StreamClass/methods.js"
import { reversedStreamInitialize } from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

import { function as _f } from "@hgargg-0710/one"
const { cached } = _f

const ReversedStreamBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		currGetter: inputCurr,
		baseNextIter: inputPrev,
		basePrevIter: inputNext,
		isCurrEnd: inputIsStart,
		isCurrStart: inputIsEnd,
		defaultIsEnd: inputDefaultIsStart,
		hasPosition
	})
) as (hasPosition: boolean) => new () => ReversedStreamClassInstance

export function ReversedStream<Type = any>(hasPosition: boolean = false) {
	const baseClass = ReversedStreamBase(hasPosition)
	class reversedStream extends baseClass implements ReversedStream<Type> {
		input: BasicReversibleStream<Type>
		init: (input?: BasicReversibleStream) => ReversedStream<Type>
		super: Summat

		constructor(input?: ReversibleStream<Type>) {
			super()
			this.init(input)
		}
	}

	Object.defineProperties(reversedStream.prototype, {
		super: { value: baseClass.prototype },
		rewind: { value: inputFinish },
		finish: { value: inputRewind },
		init: { value: reversedStreamInitialize }
	})

	return reversedStream
}
