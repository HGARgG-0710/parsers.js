import type { StreamTransform } from "../../Parser/ParserMap/interfaces.js"
import { TransformedStream as TransformedStreamConstructor } from "./classes.js"
import type {
	EndableTransformableStream,
	EffectiveTransformedStream,
	TransformedStream
} from "./interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import { superInit } from "../StreamClass/Superable/utils.js"

export function transformStream<UnderType = any, UpperType = any>(
	this: EndableTransformableStream<UnderType, UpperType>,
	transform?: StreamTransform<UnderType, UpperType>
) {
	return new TransformedStreamConstructor<UnderType, UpperType>(this, transform)
}

export function transformedStreamInitCurr<UnderType = any, UpperType = any>(
	this: TransformedStream<UnderType, UpperType>
) {
	return this.transform(this.input, this.pos)
}

export function transformedStreamNext<UnderType = any, UpperType = any>(
	this: EffectiveTransformedStream<UnderType, UpperType>
) {
	this.input.next()
	++this.pos
	return this.initGetter()
}

export function transformedStreamInitialize<UnderType = any, UpperType = any>(
	this: EffectiveTransformedStream<UnderType, UpperType>,
	input?: EndableTransformableStream<UnderType, UpperType>,
	transform?: StreamTransform<UnderType, UpperType>
) {
	this.pos = 0
	if (transform) this.transform = transform
	if (input) {
		Inputted(this, input)
		superInit(this)
	}
	return this
}
