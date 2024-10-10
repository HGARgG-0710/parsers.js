import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamTransform } from "../../Parser/ParserMap/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { EffectiveTransformedStream } from "./interfaces.js"

import { inputDefaultIsEnd, inputIsEnd } from "../StreamClass/methods.js"

import {
	transformedStreamInitCurr,
	transformedStreamInitialize,
	transformedStreamNext
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

import { function as _f } from "@hgargg-0710/one"
const { cached } = _f

const TransformedStreamBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		isCurrEnd: inputIsEnd,
		initGetter: transformedStreamInitCurr,
		baseNextIter: transformedStreamNext,
		defaultIsEnd: inputDefaultIsEnd,
		hasPosition
	})
) as (hasPosition?: boolean) => new () => StreamClassInstance

export function TransformedStream<UnderType = any, UpperType = any>(
	hasPosition: boolean = false
) {
	const baseClass = TransformedStreamBase(hasPosition)
	class transformedStream
		extends baseClass
		implements EffectiveTransformedStream<UnderType, UpperType>
	{
		input: EndableStream<UnderType>
		transform: StreamTransform<UnderType, UpperType>

		super: Summat
		init: (
			input?: EndableStream<UnderType>,
			transform?: StreamTransform<UnderType, UpperType>
		) => EffectiveTransformedStream<UnderType, UpperType>

		constructor(
			input?: EndableStream<UnderType>,
			transform?: StreamTransform<UnderType, UpperType>
		) {
			super()
			this.init(input, transform)
		}
	}

	Object.defineProperties(transformedStream.prototype, {
		super: { value: baseClass.prototype },
		init: { value: transformedStreamInitialize }
	})

	return transformedStream
}
