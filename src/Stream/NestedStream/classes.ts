import type { Summat } from "@hgargg-0710/summat.ts"
import type { EffectiveNestedStream } from "./interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { FastLookupTable } from "../../IndexMap/FastLookupTable/interfaces.js"
import type {
	EndableStream,
	PatternStreamConstructor
} from "../StreamClass/interfaces.js"

import { valueDefaultIsEnd } from "src/Pattern/methods.js"
import {
	effectiveNestedStreamInitCurr,
	effectiveNestedStreamNext,
	effectiveNestedStreamInitialize,
	effectiveNestedStreamIsEnd
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

// * Explanation: the 'preInit: true' is needed on account of 'currNested' - it would not be well to read it, only to discover that the property is `null`, instead of expected 'boolean';
const NestedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type | EffectiveNestedStream<Type>>({
		isCurrEnd: effectiveNestedStreamIsEnd,
		baseNextIter: effectiveNestedStreamNext<Type>,
		initGetter: effectiveNestedStreamInitCurr,
		defaultIsEnd: valueDefaultIsEnd,
		hasPosition,
		buffer,
		preInit: true,
		isPattern: true
	}) as PatternStreamConstructor<Type>

export function NestedStream<Type = any>(
	nestedTypes: FastLookupTable<any, StreamPredicate>,
	hasPosition: boolean = false,
	buffer: boolean = false
) {
	const baseClass = NestedStreamBase(hasPosition, buffer)
	class NestedStream extends baseClass implements EffectiveNestedStream<Type> {
		value: EndableStream<Type>
		currNested: boolean
		_index: any

		super: Summat
		typesTable: FastLookupTable<any, StreamPredicate>

		init: (value?: EndableStream<Type>, _index?: any) => EffectiveNestedStream<Type>;
		["constructor"]: new (
			value?: EndableStream<Type>,
			_index?: any
		) => EffectiveNestedStream<Type>

		constructor(value?: EndableStream<Type>, _index?: any) {
			super(value)
			this.init(value, _index)
		}
	}

	Object.defineProperties(NestedStream.prototype, {
		init: { value: effectiveNestedStreamInitialize<Type> },
		super: { value: baseClass.prototype },
		typesTable: { value: nestedTypes }
	})

	return NestedStream
}
