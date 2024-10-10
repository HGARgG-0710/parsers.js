import type { StreamTransform } from "../../Parser/ParserMap/interfaces.js"
import type { EffectiveTransformedStream, TransformedStream } from "./interfaces.js"

import { Inputted } from "../StreamClass/classes.js"
import { superInit } from "../StreamClass/utils.js"
import type { EndableStream } from "../StreamClass/interfaces.js"

export function transformedStreamInitCurr<UnderType = any, UpperType = any>(
	this: TransformedStream<UnderType, UpperType>
) {
	return this.transform(this.input, this.pos)
}

export function transformedStreamNext<UnderType = any, UpperType = any>(
	this: EffectiveTransformedStream<UnderType, UpperType>
) {
	this.input.next()
	return this.initGetter()
}

export function transformedStreamInitialize<UnderType = any, UpperType = any>(
	this: EffectiveTransformedStream<UnderType, UpperType>,
	input?: EndableStream<UnderType>,
	transform?: StreamTransform<UnderType, UpperType>
) {
	if (transform) this.transform = transform
	if (input) {
		Inputted(this, input)
		superInit(this)
	}
	return this
}
