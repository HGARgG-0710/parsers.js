import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	EndableStream,
	PatternStreamConstructor
} from "../../Stream/StreamClass/interfaces.js"
import type { StreamHandler, StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { StreamParser as StreamParserType } from "./interfaces.js"

import { StreamClass } from "../../Stream/StreamClass/classes.js"
import { valueDefaultIsEnd, valueIsEnd } from "../../Pattern/methods.js"
import { streamParserInitialize, streamParserNext } from "./methods.js"
import { extendClass } from "../../utils.js"

const StreamParserBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) =>
	StreamClass<Type>({
		initGetter: streamParserNext,
		isCurrEnd: valueIsEnd,
		baseNextIter: streamParserNext,
		defaultIsEnd: valueDefaultIsEnd,
		hasPosition,
		buffer,
		state,
		isPattern: true
	}) as PatternStreamConstructor<Type>

export function StreamParser<OutType = any>(
	handler: StreamHandler<OutType>,
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) {
	const baseClass = StreamParserBase(hasPosition, buffer, state)
	class streamTokenizerClass<InType = any>
		extends baseClass
		implements StreamParserType<InType, OutType>
	{
		value: EndableStream<InType>
		super: Summat
		handler: StreamHandler<OutType>

		init: (
			value?: EndableStream<InType>,
			state?: Summat
		) => StreamParserType<InType, OutType>

		constructor(value?: EndableStream<InType>, state: Summat = {}) {
			super(value)
			this.init(value, state)
		}
	}

	extendClass(streamTokenizerClass, {
		super: { value: baseClass.prototype },
		init: { value: streamParserInitialize },
		handler: { value: handler }
	})

	return streamTokenizerClass
}

export const BasicParser = <OutType = any>(
	handler: StreamHandler<OutType>,
	hasPosition: boolean = false,
	state: boolean = false
) => StreamParser(handler, hasPosition, true, state)

export const LocatorStream = (
	locator: StreamPredicate,
	hasPosition: boolean = false,
	state: boolean = false
) => StreamParser(locator, hasPosition, false, state)

export * from "./classes/PositionalValidator.js"
export * from "./classes/StreamValidator.js"
