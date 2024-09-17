import assert from "assert"
import type { Flushable, Resulting } from "../../../dist/src/Pattern/interfaces.js"
import { it } from "node:test"

export function arraysSame(
	arr1: any[],
	arr2: any[],
	lowCompare: (x: any, y: any) => boolean = equals
) {
	let size = arr1.length
	while (size--) if (!lowCompare(arr1[size], arr2[size])) return false
	return true
}

export function ClassConstructorTest<ClassType = any>(
	checker: (x: any) => x is ClassType
) {
	return function (constructor: (...x: any[]) => ClassType, ...input: any[]) {
		const instance: ClassType = constructor(...input)
		it("constructor", () => assert(checker(instance)))
		return instance
	}
}

export function FlushableResultableTestFlush(
	x: Flushable & Resulting,
	result: any,
	compare: (x: any, y: any) => boolean
) {
	it("method: .flush", () => {
		x.flush()
		assert(compare(x.result, result))
	})
}

export function iterationTest<Type extends Iterable<any> = any>(
	collectionInstance: Type,
	iteratedOver: any[]
) {
	it("method: [Symbol.iterator]", () =>
		assert(arraysSame([...collectionInstance], iteratedOver)))
}

export function ambigiousMethodTest<InstanceType = any>(methodName: string) {
	return function (
		instance: InstanceType,
		input: any[],
		expectedValue: any,
		compare: (x: any, y: any) => boolean
	) {
		it(`method: .${methodName}`, () =>
			assert(compare(instance[methodName](...input), expectedValue)))
	}
}

export function classSpecificAmbigiousMethodTest<InstanceType = any>(methodName: string) {
	return function (compare: (x: any, y: any) => boolean) {
		return function (instance: InstanceType, input: any[], expectedValue: any) {
			it(`method: .${methodName}(${input
				.map((x) => x.toString())
				.join(", ")})`, () =>
				assert(compare(instance[methodName](...input), expectedValue)))
		}
	}
}

export function classSpecificAmbigiousPropertyTest<InstanceType = any>(propName: string) {
	return function (compare: (x: any, y: any) => boolean) {
		return function (instance: InstanceType, expectedValue: any) {
			it(`property: .${propName}`, () =>
				assert(compare(instance[propName], expectedValue)))
		}
	}
}

export function FlushableResultableAmbigiousMethodTest<
	InstanceType extends Resulting = any
>(methodName: string) {
	return function (
		instance: InstanceType,
		items: any[],
		expectedResult: any,
		compare: any
	) {
		it(`method: .${methodName}`, () => {
			const result = instance[methodName](...items)
			assert(compare(result, expectedResult))
			assert(compare(result, instance.result))
		})
	}
}

export function utilTest(util: Function, utilName: string) {
	return function (compare: (x: any, y: any) => boolean) {
		return function (input: any[], expected: any) {
			it(`util: ${utilName} (${input.map((x) => x.toString()).join(",")})`, () =>
				assert(compare(util(...input), expected)))
		}
	}
}

export const equals = (x: any, y: any) => x === y
