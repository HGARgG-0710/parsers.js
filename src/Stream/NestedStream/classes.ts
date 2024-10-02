import {
	effectiveNestedStreamInitCurr,
	effectiveNestedStreamNext,
	effectiveNestedStreamInitialize,
	effectiveNestedStreamIsEnd
} from "./methods.js"
import type { EffectiveNestedStream } from "./interfaces.js"

import { StreamClass } from "../StreamClass/classes.js"

import type { StreamHandler, StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import { underStreamDefaultIsEnd } from "../UnderStream/methods.js"
import type { FastLookupTable } from "src/IndexMap/FastLookupTable/interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"
import { current } from "src/utils.js"

// * explanation: the 'preInit: true' is needed on account of 'currNested' - it would not be well to read it, only to discover that the property is `null`;
export const NestedStreamBase = StreamClass({
	isCurrEnd: effectiveNestedStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	initGetter: effectiveNestedStreamInitCurr,
	defaultIsEnd: underStreamDefaultIsEnd,
	preInit: true
})

// TODO list for implementation:
// ! 0. PRIOR: fix the:
// 		0.1. PersistentIndexMap - lack of proper implementation for '._index'-keeping on the key-value pairs on it [likewise, CHANGE THE 'Indexable' return value to [KeyType, ValueType] from JUST ValueType];
// 		0.2. OptimizedLinearIndexMap - implement it... [single method, basically...];
// * 1. Implement the new NestedlyTransformedStream
// * 	1.1. Which will reference THE SAME table, and use it like [accepts a 'NestedStream' as '.input']:
// 			const method = this.typesTable.byOwned(this.input.curr)
// 			return (isArray(method) ? last(method) : method)(this.input.curr)

export function NestedStream<Type = any>(
	nestedTypes: FastLookupTable<any, [StreamPredicate, (null | StreamHandler)?]>
) {
	class NestedStream extends NestedStreamBase implements EffectiveNestedStream<Type> {
		input: EndableStream<Type>
		currNested: boolean
		_index: any

		super: Summat
		typesTable: FastLookupTable<any, [StreamPredicate, (StreamHandler | null)?]>

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
		typesTable: { value: nestedTypes },
		init: { value: effectiveNestedStreamInitialize },
		super: { value: NestedStreamBase.prototype }
	})

	function NestedlyTransformedStream<ToType = any>(
		transformations: StreamHandler<ToType>[]
	) {
		class NestedlyTransfromedStream {}

		// * updating the 'transformations'
		if (transformations.length)
			NestedStream.prototype.typesTable.mutate(
				(curr: [StreamPredicate, (null | StreamHandler<ToType>)?], i: number) => {
					curr[1] = transformations[i] || current
					return curr
				}
			)

		return NestedlyTransfromedStream
	}

	return [NestedStream, NestedlyTransformedStream]
}
