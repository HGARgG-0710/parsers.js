import assert from "assert"
import { it } from "node:test"

import type { Flushable, Resulting } from "../../../dist/src/Pattern/interfaces.js"
import type { Initializable } from "../../../dist/src/Stream/StreamClass/interfaces.js"

import { object, boolean, function as _f, typeof as type } from "@hgargg-0710/one"
const { ownKeys } = object
const { equals, not } = boolean
const { or } = _f
const { isFunction } = type

export function inputDescribe(...input: any[]) {
	return input.map((x) => x.toString()).join(", ")
}

export function arraysSame(
	arr1: any[],
	arr2: any[],
	lowCompare: (x: any, y: any) => boolean = equals
) {
	let size = arr1.length
	while (size--) if (!lowCompare(arr1[size], arr2[size])) return false
	return true
}

export function ChainClassConstructorTest<ClassType extends object = object>(
	checker: (x: any) => x is ClassType,
	prototypeProps: (string | symbol)[] = [],
	ownProps: (string | symbol)[] = [],
	isInit: boolean = false
) {
	return function (instance: ClassType) {
		it(`${isInit ? "(delayed) " : ""}constructor`, () => {
			assert(checker(instance))
			for (const prop of prototypeProps)
				it(`Is a Prototype Property? (${prop.toString()})`, () =>
					assert(prop in instance && !ownKeys(instance).includes(prop)))
			for (const prop of ownProps)
				it(`Is Own Property? (${prop.toString()})`, () =>
					assert(ownKeys(instance).includes(prop)))
		})
		return instance
	}
}

export function FunctionalClassConctructorTest<ClassType extends object = object>(
	checker: (x: any) => x is ClassType,
	prototypeProps: (string | symbol)[] = [],
	ownProps: (string | symbol)[] = []
) {
	const UnderChainTest = ChainClassConstructorTest<ClassType>(
		checker,
		prototypeProps,
		ownProps
	)
	return function (constructor: (...x: any[]) => ClassType, ...input: any[]) {
		return UnderChainTest(constructor(...input))
	}
}

export function ClassConstructorTest<ClassType extends object = object>(
	checker: (x: any) => x is ClassType,
	prototypeProps: (string | symbol)[] = [],
	ownProps: (string | symbol)[] = []
) {
	const UnderFunctionalTest = FunctionalClassConctructorTest<ClassType>(
		checker,
		prototypeProps,
		ownProps
	)
	return function (constructor: new (...x: any[]) => ClassType, ...input: any[]) {
		return UnderFunctionalTest(
			(...input: any[]) => new constructor(...input),
			...input
		)
	}
}

export function FlushableResultingTestFlush(
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

export function methodTest<InstanceType = any>(methodName: string) {
	return function (instance: InstanceType, expectedValue: any, ...input: any[]) {
		it(`method: .${methodName}(${inputDescribe(input)})`, () =>
			assert.strictEqual(instance[methodName](...input), expectedValue))
	}
}

export function ambigiousMethodTest<InstanceType = any>(methodName: string) {
	return function (
		instance: InstanceType,
		expectedValue: any,
		compare: (x: any, y: any) => boolean,
		...input: any[]
	) {
		it(`method: .${methodName}`, () =>
			assert(compare(instance[methodName](...input), expectedValue)))
	}
}

export function unambigiousMethodTest<InstanceType = any>(
	methodName: string,
	compare: (x: any, y: any) => boolean
) {
	return function (instance: InstanceType, expectedValue: any, ...input: any[]) {
		it(`method: .${methodName}`, () =>
			assert(compare(instance[methodName](...input), expectedValue)))
	}
}

export function classSpecificAmbigiousMethodTest<InstanceType = any>(methodName: string) {
	return function (compare: (x: any, y: any) => boolean) {
		return function (
			instance: InstanceType,
			expectedValue: any,
			lowCompare = compare,
			...input: any[]
		) {
			it(`method: .${methodName}(${inputDescribe(input)})`, () =>
				assert(lowCompare(instance[methodName](...input), expectedValue)))
		}
	}
}

export function setMethodTest<InstanceType = any>(
	setMethodName: string,
	getMethodName: string
) {
	return function (instance: InstanceType, expectedValue: any, ...input: any[]) {
		it(`method: ${setMethodName}(${inputDescribe(input)})`, () => {
			instance[setMethodName](...input)
			assert.strictEqual(input[getMethodName](input[0]), expectedValue)
		})
	}
}

export function ResultingAmbigiousMethodTest<InstanceType extends Resulting = any>(
	methodName: string
) {
	return function (
		instance: InstanceType,
		items: any[],
		expectedResult: any,
		compare: any
	) {
		it(`method: .${methodName}(${inputDescribe(items)})`, () => {
			const result = instance[methodName](...items)
			assert(compare(result, expectedResult))
			assert(compare(result, instance.result))
		})
	}
}

export function utilTest(util: Function, utilName: string) {
	return function (compare: (x: any, y: any) => boolean) {
		return function (expected: any, ...input: any[]) {
			it(`util: ${utilName} (${inputDescribe(input)})`, () =>
				assert(compare(util(...input), expected)))
		}
	}
}

export function tripleUtilTest(
	util: Function,
	utilName: string,
	highCompare: (x: any, y: any, z: (x: any, y: any) => boolean) => boolean
) {
	return function (
		input: any[],
		expected: any,
		lowCompare: (x: any, y: any) => boolean
	) {
		it(`util: ${utilName} (${inputDescribe(input)})`, () =>
			assert(highCompare(util(...input), expected, lowCompare)))
	}
}

export function blockExtension(...blocks: Function[]) {
	return function (...input: any[]) {
		for (const block of blocks) block(...input)
	}
}

export const optional = (type: Function) => or(not, type)
export const optionalMethod = optional(isFunction)

export function InitClassConstructorTest<ClassType extends Initializable = Initializable>(
	checker: (x: any) => x is ClassType,
	prototypeProps: (string | symbol)[] = [],
	ownProps: (string | symbol)[] = []
) {
	const UnderChainTest = ChainClassConstructorTest<ClassType>(
		checker,
		prototypeProps,
		ownProps,
		true
	)
	return function (constructor: new (...x: any[]) => ClassType, ...input: any[]) {
		const instance = new constructor()
		instance.init(...input)
		return UnderChainTest(instance)
	}
}
