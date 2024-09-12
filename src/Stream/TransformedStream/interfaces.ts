import type { Summat } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "../BasicStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { StreamTransform } from "src/Parser/ParserMap/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface Transformable<InType = any, OutType = any> extends Summat {
	transform(f: InType): OutType
}

export interface TransformableStream<UnderType = any, UpperType = any>
	extends EndableStream<UnderType>,
		Transformable<UnderType, BasicStream<UpperType>> {}

export interface TransformedStream<UnderType = any, UpperType = any>
	extends PositionalStream<UpperType, number>,
		StreamClassInstance<UpperType>,
		Inputted<TransformableStream<UnderType, UpperType>>,
		IterableStream<UpperType> {
	transform: StreamTransform<UnderType, UpperType>
}
