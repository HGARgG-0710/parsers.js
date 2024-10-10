import type { Summat } from "@hgargg-0710/summat.ts"

import type { Posed } from "../../Position/interfaces.js"
import type { StreamTransform } from "../../Parser/ParserMap/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type {
	Inputted,
	Superable,
	EndableStream,
	StreamClassInstance
} from "../StreamClass/interfaces.js"

export interface Transformable<InType = any, OutType = any> extends Summat {
	transform: StreamTransform<InType, OutType>
}

export interface TransformableStream<UnderType = any, UpperType = any>
	extends BasicStream<UnderType>,
		Transformable<UnderType, BasicStream<UpperType>> {}

export interface BasicTransformed<UnderType = any, UpperType = any>
	extends Transformable<UnderType, UpperType>,
		Posed<number>,
		Iterable<UpperType> {}

export interface TransformedStream<UnderType = any, UpperType = any>
	extends BasicTransformed<UnderType, UpperType>,
		BasicStream<UpperType>,
		Inputted<BasicStream<UnderType>> {}

export interface EndableTransformableStream<UnderType = any, UpperType = any>
	extends EndableStream<UnderType>,
		TransformableStream<UnderType, UpperType> {}

export interface EffectiveTransformedStream<UnderType = any, UpperType = any>
	extends BasicTransformed<UnderType, UpperType>,
		Superable,
		Inputted<EndableTransformableStream<UnderType, UpperType>>,
		StreamClassInstance<UpperType> {}
