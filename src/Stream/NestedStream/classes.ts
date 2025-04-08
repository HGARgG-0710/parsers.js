import type { Summat } from "@hgargg-0710/summat.ts"
import type { IStreamPredicate } from "../../TableMap/interfaces.js"
import type { ILookupTable } from "../../LookupTable/interfaces.js"
import type { IConstructor } from "../StreamClass/refactor.js"
import type { IPattern } from "src/interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"

import type { IStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IEndableStream } from "../interfaces.js"

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
	}) as IConstructor<[any], IStreamClassInstance<Type> & IPattern>

export function NestedStream<Type = any, IndexType = any>(
	nestedTypes: ILookupTable<any, IStreamPredicate>
): (
	hasPosition?: boolean,
	hasBuffer?: boolean
) => new (value?: IUnderNestedStream<Type>, index?: IndexType) => INestedStream<
	Type,
	IndexType
> {
	return function (hasPosition: boolean = false, hasBuffer: boolean = false) {
		const baseClass = NestedStreamBase(hasPosition, hasBuffer)
		class NestedStream
			extends baseClass
			implements INestedStream<Type, IndexType>
		{
			value: IUnderNestedStream<Type>
			isCurrNested: boolean
			assignedIndex?: any

			readonly super: Summat
			readonly typesTable: ILookupTable<any, IStreamPredicate>

			init: (
				value?: IEndableStream<Type>,
				index?: IndexType
			) => INestedStream<Type>;

			["constructor"]: new (
				value?: IUnderNestedStream<Type>,
				index?: IndexType,
				buffer?: IFreezableBuffer<Type>
			) => INestedStream<Type>

			constructor(value?: IUnderNestedStream<Type>, index?: IndexType) {
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
