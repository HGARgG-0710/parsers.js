import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import { TransformedStream } from "./classes.js"
import type { TransformableStream } from "./interfaces.js"

export function transformStream<UnderType = any, UpperType = any>(
	this: TransformableStream<UnderType, UpperType>,
	transform: StreamTransform<UnderType, UpperType>
) {
	return TransformedStream<UnderType, UpperType>(this, transform)
}
