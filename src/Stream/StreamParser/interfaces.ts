import type { Summat } from "@hgargg-0710/summat.ts"
import type { IEndableStream, IStream } from "../interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"

export type IStreamParserInitSignature<InType = any, OutType = any> = [
	IEndableStream<InType>?,
	IFreezableBuffer<OutType>?,
	Summat?
]

export type IStreamParserConstructor<InType = any, OutType = any> = new (
	value?: IEndableStream<InType>,
	buffer?: IFreezableBuffer<OutType>,
	state?: Summat
) => IStreamParser<InType, OutType>

export type IStreamParser<InType = any, OutType = any> = IStream<
	OutType,
	IEndableStream<InType>,
	number,
	IStreamParserInitSignature<InType, OutType>
>

export type * from "./interfaces/IndexStream.js"
