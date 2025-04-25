import type { Summat } from "@hgargg-0710/summat.ts"
import type { IFreezableSequence } from "../../interfaces.js"
import type {
	IEndableStream,
	IStream,
	IStreamClassInstance
} from "../interfaces.js"

export type IStreamParserInitSignature<InType = any, OutType = any> = [
	IEndableStream<InType>?,
	IFreezableSequence<OutType>?,
	Summat?
]

export type IStreamParserConstructor<InType = any, OutType = any> = new (
	value?: IEndableStream<InType>,
	buffer?: IFreezableSequence<OutType>,
	state?: Summat
) => IConcreteStreamParser<InType, OutType>

export type IStreamParser<InType = any, OutType = any> = IStream<
	OutType,
	number,
	IStreamParserInitSignature<InType, OutType>
>

export type IConcreteStreamParser<InType = any, OutType = any> = IStreamParser<
	InType,
	OutType
> &
	IStreamClassInstance<
		OutType,
		number,
		IStreamParserInitSignature<InType, OutType>
	>

export type * from "./interfaces/IndexStream.js"
