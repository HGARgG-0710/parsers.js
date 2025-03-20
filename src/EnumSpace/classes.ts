import type { IEnumSpace } from "./interfaces.js"
import type { IMappable, ISizeable } from "../interfaces.js"

import { makeDelegate } from "../refactor.js"

import { functional, inplace, object, array, type } from "@hgargg-0710/one"
const { id } = functional
const { out } = inplace
const { empty, extendPrototype } = object
const { uniqueArr, numbers } = array
const { ConstDescriptor } = object.descriptor
const { isNumber, isArray } = type

abstract class PreEnumSpace<Type = any> implements ISizeable, IEnumSpace<Type> {
	protected value: Type[] = []

	generator?: (i?: number, ...x: any[]) => Type;

	["constructor"]: new (value?: Type[]) => IEnumSpace<Type>

	add(size: number): this {
		this.value!.push(
			...numbers(size).map((i: number) => this.generator!(this.size + i))
		)
		this.ensureUnique()
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.value!))
	}

	map<Out = any>(mapped: IMappable<Type, Out> = id<Type> as any) {
		return this.value.map(mapped)
	}

	set size(size: number) {
		const diff = this.size - size
		if (diff > 0) out(this.value, size, diff)
		else this.add(diff)
	}

	get size() {
		return this.value.length
	}

	join(space: IEnumSpace<Type>) {
		this.value.push(...space.map())
		this.ensureUnique()
		return this
	}

	protected ensureUnique() {
		this.value = uniqueArr(this.value!)
	}

	constructor(init: Type[] | number = []) {
		const value = isNumber(init) ? [] : init
		const count = isArray(init) ? 0 : init

		this.size = count
		this.value = value
	}
}

export function EnumSpace<Type = any>(
	generator?: (i?: number, ...x: any[]) => Type
): new (init?: Type[] | number) => IEnumSpace<Type> {
	const enumSpace = makeDelegate(PreEnumSpace<Type>, ["value"], "delegate")

	extendPrototype(enumSpace, {
		generator: ConstDescriptor(generator)
	})

	return enumSpace as new (init?: Type[] | number) => IEnumSpace<Type>
}

// * Pre-doc note: default provides benefits - 1. stable memory footprint; 2. easy to generate new instances (no need for user involvement); 3. unlimited number of instances
export const ConstEnum = EnumSpace(empty)

// * Pre-doc note: default provides benefits - 1. debugability; 2. serializability; 3. (as consequence of 1.) usage easier to integrate with external tools; 4. lazy evaluation
export const FiniteEnum = EnumSpace()
