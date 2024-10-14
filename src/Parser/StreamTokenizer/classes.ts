import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamTokenizer } from "./interfaces.js"
import type {
	EndableStream,
	StreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"

import { streamTokenizerInitialize, streamTokenizerNext } from "./methods.js"
import { inputDefaultIsEnd, inputIsEnd } from "../../Stream/StreamClass/methods.js"

import { StreamClass } from "../../Stream/StreamClass/classes.js"

import { function as _f } from "@hgargg-0710/one"
import type { StreamHandler } from "../TableMap/interfaces.js"
const { cached } = _f

const StreamTokenizerBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		initGetter: streamTokenizerNext,
		isCurrEnd: inputIsEnd,
		baseNextIter: streamTokenizerNext,
		defaultIsEnd: inputDefaultIsEnd,
		hasPosition
	})
) as (hasPosition: boolean) => new () => StreamClassInstance

export function StreamTokenizer<OutType = any>(
	tokenHandler: StreamHandler<OutType>,
	hasPosition: boolean = false
) {
	const baseClass = StreamTokenizerBase(hasPosition)
	class streamTokenizerClass<InType = any>
		extends baseClass
		implements StreamTokenizer<InType, OutType>
	{
		input: EndableStream<InType>
		super: Summat
		tokenHandler: StreamHandler<OutType>

		init: (input?: EndableStream<InType>) => StreamTokenizer<InType, OutType>

		constructor(input?: EndableStream<InType>) {
			super()
			this.init(input)
		}
	}

	Object.defineProperties(streamTokenizerClass.prototype, {
		super: { value: baseClass.prototype },
		init: { value: streamTokenizerInitialize },
		tokenHandler: { value: tokenHandler }
	})

	return streamTokenizerClass
}
