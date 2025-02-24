import type { Summat } from "@hgargg-0710/summat.ts"
import type { FreezableBuffer } from "../../Collection/Buffer/interfaces.js"
import type {
	EndableStream,
	PatternStreamConstructor
} from "../../Stream/StreamClass/interfaces.js"
import type { StreamHandler } from "../../Parser/TableMap/interfaces.js"
import type { StreamParser as IStreamParser } from "./interfaces.js"

import { DefaultEndStream } from "../StreamClass/abstract.js"
import { valueIsCurrEnd } from "../StreamClass/refactor.js"
import { streamParserInitialize, streamParserNext } from "./refactor.js"
import { withSuper } from "src/refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

const StreamParserBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) =>
	DefaultEndStream<Type>({
		initGetter: streamParserNext,
		isCurrEnd: valueIsCurrEnd,
		baseNextIter: streamParserNext,
		hasPosition,
		buffer,
		state,
		isPattern: true
	}) as PatternStreamConstructor<Type>

export function StreamParser<InType = any, OutType = any>(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
): new (
	handler?: StreamHandler<OutType>,
	value?: EndableStream<InType>,
	state?: Summat
) => IStreamParser<InType, OutType> {
	const baseClass = StreamParserBase(hasPosition, buffer, state)
	class streamTokenizerClass
		extends baseClass
		implements IStreamParser<InType, OutType>
	{
		value: EndableStream<InType>
		super: Summat
		handler: StreamHandler<OutType>

		pos?: number
		buffer?: FreezableBuffer<OutType>
		state?: Summat

		init: (
			handler?: StreamHandler<OutType>,
			value?: EndableStream<InType>,
			state?: Summat
		) => IStreamParser<InType, OutType>

		constructor(
			handler: StreamHandler<OutType>,
			value?: EndableStream<InType>,
			state: Summat = {}
		) {
			super(value)
			this.init(handler, value, state)
		}
	}

	withSuper(streamTokenizerClass, baseClass, {
		init: ConstDescriptor(streamParserInitialize)
	})

	return streamTokenizerClass
}

export const BasicParser = <InType = any, OutType = any>(
	hasPosition: boolean = false,
	state: boolean = false
) => StreamParser<InType, OutType>(hasPosition, true, state)

export const LocatorStream = <InType = any>(
	hasPosition: boolean = false,
	state: boolean = false
) => StreamParser<InType, boolean>(hasPosition, false, state)

export * from "./classes/PositionalValidator.js"
export * from "./classes/StreamValidator.js"
