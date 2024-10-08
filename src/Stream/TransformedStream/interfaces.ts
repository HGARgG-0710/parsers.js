import type { Summat } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "../interfaces.js"
import type { Posed } from "../PositionalStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamTransform } from "../../Parser/ParserMap/interfaces.js"
import type { Superable } from "../StreamClass/Superable/interfaces.js"

export interface Transformable<InType = any, OutType = any> extends Summat {
	transform: StreamTransform<InType, OutType>
}

export interface TransformableStream<UnderType = any, UpperType = any>
	extends BasicStream<UnderType>,
		Transformable<UnderType, BasicStream<UpperType>> {}

export interface BasicTransformedStream<UnderType = any, UpperType = any>
	extends BasicStream<UpperType>,
		Transformable<UnderType, UpperType>,
		Posed<number>,
		Iterable<UpperType> {}

export interface TransformedStream<UnderType = any, UpperType = any>
	extends BasicTransformedStream<UnderType, UpperType>,
		Inputted<BasicStream<UnderType>> {}

export interface EndableTransformableStream<UnderType = any, UpperType = any>
	extends EndableStream<UnderType>,
		TransformableStream<UnderType, UpperType> {}

export interface EffectiveTransformedStream<UnderType = any, UpperType = any>
	extends BasicTransformedStream<UnderType, UpperType>,
		Superable,
		Inputted<EndableTransformableStream<UnderType, UpperType>>,
		StreamClassInstance<UpperType> {}
