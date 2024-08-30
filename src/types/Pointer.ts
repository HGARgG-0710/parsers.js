import type { Summat } from "./Summat.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Pointer<Type = any> extends Summat {
	value: Type | Pointer<Type>
	get(): Type
	set(newvalue: Type): Type
}

const valueCheck = structCheck("value", "get", "set")
export const isPointer = (x: any): x is Pointer =>
	valueCheck(x) && isFunction(x.get) && isFunction(x.set)

export function pointerGet<Type = any>(this: Pointer<Type>) {
	let current: Type | Pointer<Type> = this.value
	while (isPointer(current)) current = current.value
	return current
}

export function pointerSet<Type = any>(this: Pointer<Type>, newvalue: Type) {
	let current: Type | Pointer<Type> = this.value
	while (isPointer(current)) {
		const { value } = current
		if (!isPointer(value)) break
		current = value
	}
	;(current as Pointer<Type>).value = newvalue
	return newvalue
}

export function Pointer<Type = any>(value: Type | Pointer<Type>): Pointer<Type> {
	return {
		value,
		get: pointerGet<Type>,
		set: pointerSet<Type>
	}
}
