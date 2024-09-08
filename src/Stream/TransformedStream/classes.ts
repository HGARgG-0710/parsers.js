import { underStreamIsEnd } from "../UnderStream/methods.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../StreamClass/classes.js"

import { basicStreamInitGetter } from "../BasicStream/methods.js"
import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import { transformedStreamNext } from "./methods.js"
import type { TransformableStream, TransformedStream } from "./interfaces.js"
import { transformStream } from "./methods.js"

import type { BaseStream } from "../BasicStream/interfaces.js"

export function TransformedStream<UnderType = any, UpperType = any>(
	input: TransformableStream<UnderType, UpperType>,
	transform: StreamTransform<UnderType, UpperType>
): TransformedStream<UnderType, UpperType> {
	return ForwardStreamIterationHandler(
		StreamCurrGetter<UpperType>(
			{
				pos: 0,
				transform,
				input,
				isStart: true
			},
			undefined,
			basicStreamInitGetter<UpperType>
		),
		transformedStreamNext<UnderType, UpperType>,
		underStreamIsEnd<UpperType>
	) as TransformedStream<UnderType, UpperType>
}

export function TransformableStream<UnderType = any, UpperType = any>() {
	return function (
		stream: BaseStream<UnderType>
	): TransformableStream<UnderType, UpperType> {
		stream.transform = transformStream<UnderType, UpperType>
		return stream as TransformableStream<UnderType, UpperType>
	}
}
