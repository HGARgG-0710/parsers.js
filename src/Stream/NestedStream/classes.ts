import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { ILookupTable } from "../../IndexMap/LookupTable/interfaces.js"
import type { Constructor } from "../StreamClass/refactor.js"
import type { IPattern } from "../../Pattern/interfaces.js"

import type {
	IEndableStream,
	IStreamClassInstance
} from "../StreamClass/interfaces.js"

import type { INestedStream } from "./interfaces.js"

import { withSuper } from "../../refactor.js"
import { DefaultEndStream } from "../StreamClass/abstract.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./refactor.js"
const { init, ...baseMethods } = methods

const NestedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	DefaultEndStream<Type | INestedStream<Type>>({
		...baseMethods,
		hasPosition: hasPosition,
		hasBuffer: buffer,
		isPattern: true
	}) as Constructor<[any], IStreamClassInstance<Type> & IPattern>

export function NestedStream<Type = any>(
	nestedTypes: ILookupTable<any, IStreamPredicate>,
	hasPosition: boolean = false,
	buffer: boolean = false
): new (value?: IEndableStream<Type>, _index?: any) => INestedStream<Type> {
	const baseClass = NestedStreamBase(hasPosition, buffer)
	class NestedStream extends baseClass implements INestedStream<Type> {
		value: IEndableStream<Type>
		currNested: boolean
		assignedIndex?: any

		super: Summat
		typesTable: ILookupTable<any, IStreamPredicate>

		init: (
			value?: IEndableStream<Type>,
			_index?: any
		) => INestedStream<Type>;
		["constructor"]: new (
			value?: IEndableStream<Type>,
			_index?: any
		) => INestedStream<Type>

		constructor(value?: IEndableStream<Type>, index?: any) {
			super(value)
			this.init(value, index)
		}
	}

	withSuper(NestedStream, baseClass, {
		init: ConstDescriptor(init),
		typesTable: ConstDescriptor(nestedTypes)
	})

	return NestedStream
}
