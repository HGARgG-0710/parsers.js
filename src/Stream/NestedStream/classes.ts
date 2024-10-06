import {
	effectiveNestedStreamInitCurr,
	effectiveNestedStreamNext,
	effectiveNestedStreamInitialize,
	effectiveNestedStreamIsEnd
} from "./methods.js"
import type { EffectiveNestedStream } from "./interfaces.js"

import { StreamClass } from "../StreamClass/classes.js"

import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import { underStreamDefaultIsEnd } from "../UnderStream/methods.js"
import type { FastLookupTable } from "src/IndexMap/FastLookupTable/interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

// * Explanation: the 'preInit: true' is needed on account of 'currNested' - it would not be well to read it, only to discover that the property is `null`;
const NestedStreamBase = StreamClass({
	isCurrEnd: effectiveNestedStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	initGetter: effectiveNestedStreamInitCurr,
	defaultIsEnd: underStreamDefaultIsEnd,
	preInit: true
})

const NestedStreamPrototype = {
	init: { value: effectiveNestedStreamInitialize },
	super: { value: NestedStreamBase.prototype }
}

export function NestedStream<Type = any>(
	nestedTypes: FastLookupTable<any, StreamPredicate>
) {
	class NestedStream extends NestedStreamBase implements EffectiveNestedStream<Type> {
		input: EndableStream<Type>
		currNested: boolean
		_index: any

		super: Summat
		typesTable: FastLookupTable<any, StreamPredicate>

		init: (input?: EndableStream<Type>, _index?: any) => EffectiveNestedStream<Type>;
		["constructor"]: new (
			input?: EndableStream<Type> | undefined,
			_index?: any
		) => EffectiveNestedStream<Type>

		constructor(input?: EndableStream<Type>, _index?: any) {
			super()
			this.init(input, _index)
		}
	}

	Object.defineProperties(NestedStream.prototype, NestedStreamPrototype)
	NestedStream.prototype.typesTable = nestedTypes

	return NestedStream
}
