import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamTokenizer } from "./interfaces.js"
import type {
	EndableStream,
	PatternStreamConstructor
} from "../../Stream/StreamClass/interfaces.js"

import type { StreamHandler } from "../../Parser/TableMap/interfaces.js"

import { streamTokenizerInitialize, streamTokenizerNext } from "./methods.js"
import { valueDefaultIsEnd, valueIsEnd } from "src/Pattern/methods.js"
import { StreamClass } from "../../Stream/StreamClass/classes.js"

const StreamTokenizerBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) =>
	StreamClass<Type>({
		initGetter: streamTokenizerNext,
		isCurrEnd: valueIsEnd,
		baseNextIter: streamTokenizerNext,
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
	const baseClass = StreamTokenizerBase(hasPosition, buffer, state)
	class streamTokenizerClass<InType = any>
		extends baseClass
		implements StreamTokenizer<InType, OutType>
	{
		value: EndableStream<InType>
		super: Summat
		handler: StreamHandler<OutType>

		init: (value?: EndableStream<InType>) => StreamTokenizer<InType, OutType>

		constructor(value?: EndableStream<InType>) {
			super(value)
			this.init(value)
		}
	}

	Object.defineProperties(streamTokenizerClass.prototype, {
		super: { value: baseClass.prototype },
		init: { value: streamTokenizerInitialize },
		handler: { value: handler }
	})

	return streamTokenizerClass
}
