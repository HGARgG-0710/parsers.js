import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { ILookupTable } from "../../IndexMap/LookupTable/interfaces.js"
import type { Constructor } from "../StreamClass/refactor.js"
import type { IPattern } from "../../Pattern/interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"

import type {
	IEndableStream,
	IStreamClassInstance
} from "../StreamClass/interfaces.js"

import type { INestedStream, IUnderNestedStream } from "./interfaces.js"

import { withSuper } from "../../refactor.js"
import { DefaultEndStream } from "../StreamClass/classes.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
const { init, copy, ...baseMethods } = methods

const NestedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
) =>
	DefaultEndStream<Type | INestedStream<Type>>({
		...baseMethods,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer,
		isPattern: true
	}) as Constructor<[any], IStreamClassInstance<Type> & IPattern>

export function NestedStream<Type = any>(
	nestedTypes: ILookupTable<any, IStreamPredicate>
): (
	hasPosition?: boolean,
	hasBuffer?: boolean
) => new (value?: IEndableStream<Type>, _index?: any) => INestedStream<Type> {
	return function (hasPosition: boolean = false, hasBuffer: boolean = false) {
		const baseClass = NestedStreamBase(hasPosition, hasBuffer)
		class NestedStream extends baseClass implements INestedStream<Type> {
			value: IUnderNestedStream<Type>
			isCurrNested: boolean
			assignedIndex?: any

			super: Summat
			typesTable: ILookupTable<any, IStreamPredicate>

			init: (
				value?: IEndableStream<Type>,
				_index?: any
			) => INestedStream<Type>;

			["constructor"]: new (
				value?: IEndableStream<Type>,
				_index?: any,
				buffer?: IFreezableBuffer<Type>
			) => INestedStream<Type>

			constructor(value?: IEndableStream<Type>, index?: any) {
				super(value)
				this.init(value, index)
			}
		}

		withSuper(NestedStream, baseClass, {
			init: ConstDescriptor(init),
			copy: ConstDescriptor(copy),
			typesTable: ConstDescriptor(nestedTypes)
		})

		return NestedStream
	}
}
