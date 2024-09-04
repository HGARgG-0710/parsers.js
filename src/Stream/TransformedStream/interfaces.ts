import type { Summat } from "@hgargg-0710/summat.ts"

import type {
	BasicStream,
	BaseStream,
	EssentialStream
} from "../BasicStream/interfaces.js"
import type { Started } from "../ReversibleStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { Inputted } from "../interfaces.js"
import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"

export interface Transformable<InType = any, OutType = any> extends Summat {
	transform(f: InType): OutType
}

export interface TransformableStream<UnderType = any, UpperType = any>
	extends BaseStream<UnderType>,
		Transformable<UnderType, BasicStream<UpperType>> {}

export interface TransformedStream<UnderType = any, UpperType = any>
	extends PositionalStream<UpperType, number>,
		EssentialStream<UpperType>,
		Inputted<BaseStream<UnderType>>,
		Started {
	transform: StreamTransform<UnderType, UpperType>
}
