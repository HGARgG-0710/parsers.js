import type { Summat } from "@hgargg-0710/summat.ts"
import type { NestedStream as EffectiveNestedStream } from "./interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { FastLookupTable } from "../../IndexMap/FastLookupTable/interfaces.js"
import type {
	EndableStream,
	PatternStreamConstructor
} from "../StreamClass/interfaces.js"

import { DefaultEndStream } from "../StreamClass/abstract.js"
import {
	nestedStreamInitCurr,
	nestedStreamNext,
	nestedStreamInitialize,
	nestedStreamIsEnd
} from "./refactor.js"

import { withSuper } from "src/refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

const NestedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	DefaultEndStream<Type | EffectiveNestedStream<Type>>({
		isCurrEnd: nestedStreamIsEnd,
		baseNextIter: nestedStreamNext<Type>,
		initGetter: nestedStreamInitCurr,
		hasPosition,
		buffer,
		isPattern: true
	}) as PatternStreamConstructor<Type>

export function NestedStream<Type = any>(
	nestedTypes: FastLookupTable<any, StreamPredicate>,
	hasPosition: boolean = false,
	buffer: boolean = false
): new (value?: EndableStream<Type>, _index?: any) => EffectiveNestedStream<Type> {
	const baseClass = NestedStreamBase(hasPosition, buffer)
	class NestedStream extends baseClass implements EffectiveNestedStream<Type> {
		value: EndableStream<Type>
		currNested: boolean
		assignedIndex?: any

		super: Summat
		typesTable: FastLookupTable<any, StreamPredicate>

		init: (value?: EndableStream<Type>, _index?: any) => EffectiveNestedStream<Type>;
		["constructor"]: new (
			value?: EndableStream<Type>,
			_index?: any
		) => EffectiveNestedStream<Type>

		constructor(value?: EndableStream<Type>, index?: any) {
			super(value)
			this.init(value, index)
		}
	}

	withSuper(NestedStream, baseClass, {
		init: ConstDescriptor(nestedStreamInitialize<Type>),
		typesTable: ConstDescriptor(nestedTypes)
	})

	return NestedStream
}
