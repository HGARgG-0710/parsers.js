import assert from "assert"
import type { Flushable, Resulting } from "../../../dist/src/Pattern/interfaces.js"
import { it } from "node:test"

export function arraysSame(arr1: any[], arr2: any[]) {
	let size = arr1.length
	while (size--) if (arr1[size] !== arr2[size]) return false
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
