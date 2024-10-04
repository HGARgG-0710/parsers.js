import type { Summat } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "../BasicStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { IterableStream } from "../StreamClass/Iterable/interfaces.js"
import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"

export interface Transformable<InType = any, OutType = any> extends Summat {
	transform: StreamTransform<InType, OutType>
}

export interface TransformableStream<UnderType = any, UpperType = any>
	extends BasicStream<UnderType>,
		Transformable<UnderType, BasicStream<UpperType>> {}

export interface BasicTransformedStream<UnderType = any, UpperType = any>
	extends Transformable<UnderType, UpperType>,
		PositionalStream<UpperType, number>,
		IterableStream<UpperType> {}

export interface TransformedStream<UnderType = any, UpperType = any>
	extends BasicTransformedStream<UnderType, UpperType>,
		Inputted<BasicStream<UnderType>> {}

export interface EndableTransformableStream<UnderType = any, UpperType = any>
	extends EndableStream<UnderType>,
		TransformableStream<UnderType, UpperType> {}

export interface EffectiveTransformedStream<UnderType = any, UpperType = any>
	extends BasicTransformedStream<UnderType, UpperType>,
		Inputted<EndableTransformableStream<UnderType, UpperType>>,
		StreamClassInstance<UpperType> {}
