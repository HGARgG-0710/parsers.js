// * The main file for the testing mini-framework;

import assert from "assert"
import { it } from "node:test"

import type { Flushable, Resulting } from "../../../dist/src/Pattern/interfaces.js"
import type { Initializable } from "../../../dist/src/Stream/StreamClass/interfaces.js"

import { object, boolean, function as _f, typeof as type } from "@hgargg-0710/one"
const { ownKeys, kv } = object
const { equals, not } = boolean
const { or } = _f
const { isFunction, isObject, isNull, isArray } = type

export function recursiveToString(x: any) {
	if (isNull(x)) return "null"
	if (isArray(x)) return `[ ${x.map(recursiveToString).join(", ")} ]`
	if (isObject(x)) {
		const [allKeys, values] = kv(x)
		const mappedKeys = allKeys.map((x) => x.toString())
		const mappedValues = values.map(recursiveToString)

		const converted = []
		for (let i = 0; i < mappedKeys.length; ++i)
			converted.push(`${mappedKeys[i]}: ${mappedValues[i]}`)
		return `${x.constructor.name} { ${converted.join(", ")} }`
	}
	return x.toString()
}

export function inputDescribe(...input: any[]) {
	return input.map(recursiveToString).join(", ")
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
	method("flush", () => {
		x.flush()
		assert(compare(x.result, result))
	})
}

export function iterationTest<Type extends Iterable<any> = any>(
	collectionInstance: Type,
	iteratedOver: any[],
	compare: (x: any, y: any) => boolean = equals
) {
	method("[Symbol.iterator]", () =>
		assert(arraysSame([...collectionInstance], iteratedOver, compare))
	)
}

export function methodTest<InstanceType = any>(methodName: string) {
	return function (instance: InstanceType, expectedValue: any, ...input: any[]) {
		method(
			methodName,
			() => assert.strictEqual(instance[methodName](...input), expectedValue),
			...input
		)
	}
}

export function comparisonMethodTest<InstanceType = any>(
	methodName: string,
	compare: (x: any, y: any) => boolean
) {
	return function (instance: InstanceType, expectedValue: any, ...input: any[]) {
		method(
			methodName,
			() => assert(compare(instance[methodName](...input), expectedValue)),
			...input
		)
	}
}

export function setMethodTest<InstanceType = any>(
	setMethodName: string,
	getMethodName: string
) {
	return function (instance: InstanceType, expectedValue: any, ...input: any[]) {
		method(
			setMethodName,
			() => {
				instance[setMethodName](...input)
				assert.strictEqual(input[getMethodName](input[0]), expectedValue)
			},
			...input
		)
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
		method(
			methodName,
			() => {
				const result = instance[methodName](...items)
				assert(compare(result, expectedResult))
				assert(compare(result, instance.result))
			},
			...items
		)
	}
}

export function utilTest(testedUtil: Function, utilName: string) {
	return function (compare: (x: any, y: any) => boolean) {
		return function (expected: any, ...input: any[]) {
			util(
				utilName,
				() => assert(compare(testedUtil(...input), expected)),
				...input
			)
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
		util(
			utilName,
			() => assert(highCompare(util(...input), expected, lowCompare)),
			...input
		)
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

export function signatures<SignatureType extends object = any>(
	signatures: SignatureType[],
	post: (signature: SignatureType) => () => void
) {
	for (let i = 0; i < signatures.length; ++i) it(`signature: ${i}`, post(signatures[i]))
}

export const [method, util] = ["method", "util"].map(
	(typeString) =>
		(name: string, post: () => void, ...args: any[]) =>
			it(`${typeString}: ${name}(${inputDescribe(args)})`, post)
)

export const [classTest, property] = ["class", "property"].map(
	(typeString) => (name: string, post: () => void) => it(`${typeString}: ${name}`, post)
)
