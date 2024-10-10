import type { Summat } from "@hgargg-0710/summat.ts"

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

export interface TransformedStream<UnderType = any, UpperType = any>
	extends Transformable<UnderType, UpperType>,
		BasicStream<UpperType>,
		Inputted<BasicStream<UnderType>> {}

export interface EffectiveTransformedStream<UnderType = any, UpperType = any>
	extends Transformable<UnderType, UpperType>,
		Superable,
		Inputted<EndableStream<UnderType>>,
		StreamClassInstance<UpperType> {}
