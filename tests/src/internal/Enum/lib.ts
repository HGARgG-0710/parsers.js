import { array, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { Enum, IMappable } from "../../../dist/src/internal/Enum.js"
import { ClassTest, MethodTest } from "../../lib.js"
import { assertDistinct } from "../interfaces/Copiable/lib.js"

const { structCheck } = object
const { isFunction } = type

export enum TestTypes {
	INSTANCE_TEST = 0,
	STATIC_TEST = 1
}

const toMap = new MethodTest("toMap", function <
	T = any,
	Out = any
>(this: Enum<T>, mapped: IMappable<T, Out>, keys: T[], values: Out[]) {
	const map = this.toMap(mapped)
	assert(array.same(map.keys(), keys))
	assert(array.same(map.values(), values))
})

const copy = new MethodTest("copy", function <T = any>(this: Enum<T>) {
	const copied = this.copy()
	assert(array.same(this.toMap().keys(), copied.toMap().keys()))
	assertDistinct(this, copied)
})

class EnumTest<T = any> extends ClassTest<Enum<T>> {
	toMap<Out = any>(mapped: IMappable<T, Out>, keys: T[], values: Out[]) {
		this.testMethod("toMap", mapped, keys, values)
	}

	copy() {
		this.testMethod("copy")
	}

	constructor() {
		super([toMap, copy])
	}
}

export function enumTest<T = any>() {
	return new EnumTest<T>()
}
