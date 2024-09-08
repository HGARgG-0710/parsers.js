import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import { TransformedStream as TransformedStreamConstructor } from "./classes.js"
import type { TransformableStream, TransformedStream } from "./interfaces.js"

export function transformStream<UnderType = any, UpperType = any>(
	this: TransformableStream<UnderType, UpperType>,
	transform: StreamTransform<UnderType, UpperType>
) {
	return TransformedStreamConstructor<UnderType, UpperType>(this, transform)
}

export function transformedStreamNext<UnderType = any, UpperType = any>(
	this: TransformedStream<UnderType, UpperType>
) {
	const result = this.transform(this.input, this.pos)
	this.input.next()
	++this.pos
	return result
}
