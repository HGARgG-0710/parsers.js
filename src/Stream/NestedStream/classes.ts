import type { Summat } from "@hgargg-0710/summat.ts"
import type { EffectiveNestedStream } from "./interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { FastLookupTable } from "../../IndexMap/FastLookupTable/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"

import { inputDefaultIsEnd } from "../StreamClass/methods.js"
import {
	effectiveNestedStreamInitCurr,
	effectiveNestedStreamNext,
	effectiveNestedStreamInitialize,
	effectiveNestedStreamIsEnd
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

import { function as _f } from "@hgargg-0710/one"
const { cached } = _f

// * Explanation: the 'preInit: true' is needed on account of 'currNested' - it would not be well to read it, only to discover that the property is `null`, instead of expected 'boolean';
const NestedStreamBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		isCurrEnd: effectiveNestedStreamIsEnd,
		baseNextIter: effectiveNestedStreamNext,
		initGetter: effectiveNestedStreamInitCurr,
		defaultIsEnd: inputDefaultIsEnd,
		hasPosition,
		preInit: true
	})
) as (hasPosition?: boolean) => new () => StreamClassInstance

export function NestedStream<Type = any>(
	nestedTypes: FastLookupTable<any, StreamPredicate>,
	hasPosition: boolean = false
) {
	const baseClass = NestedStreamBase(hasPosition)
	class NestedStream extends baseClass implements EffectiveNestedStream<Type> {
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

	Object.defineProperties(NestedStream.prototype, {
		init: { value: effectiveNestedStreamInitialize<Type> },
		super: { value: baseClass.prototype },
		typesTable: { value: nestedTypes }
	})

	return NestedStream
}
