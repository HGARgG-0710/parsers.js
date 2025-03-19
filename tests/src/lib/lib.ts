// * The main file for the testing mini-framework;

import assert from "assert"
import { it } from "node:test"

import type { IInitializable } from "../../../dist/src/Stream/StreamClass/methods/init.js"

import { classWrapper } from "@hgargg-0710/one/dist/src/object/classes.js"

import { object, boolean, functional, type, array  } from "@hgargg-0710/one"
const { ownKeys, kv } = object
const { equals, not } = boolean
const { or } = functional
const { isFunction, isObject, isNull, isArray } = type
const { same } = array

export function recursiveToString(x: any) {
	if (isNull(x)) return "null"
	if (isArray(x)) return `[ ${x.map(recursiveToString).join(", ")} ]`
	if (isObject(x)) {
		const [allKeys, values] = kv(x)
		const mappedKeys = allKeys.map((x) => x.toString())
		const mappedValues = values.map(recursiveToString)

		const converted: string[] = []
		for (let i = 0; i < mappedKeys.length; ++i)
			converted.push(`${mappedKeys[i]}: ${mappedValues[i]}`)
		return `${x.constructor.name} { ${converted.join(", ")} }`
	}
	return x.toString()
}

export function inputDescribe(...input: any[]) {
	return input.map(recursiveToString).join(", ")
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
					assert(
						prop in instance && !ownKeys(instance).includes(prop)
					))
			for (const prop of ownProps)
				it(`Is Own Property? (${prop.toString()})`, () =>
					assert(ownKeys(instance).includes(prop)))
		})
		return instance
	}
}

export function FunctionalClassConctructorTest<
	ClassType extends object = object
>(
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

	return function (
		constructor: new (...x: any[]) => ClassType,
		...input: any[]
	) {
		return UnderFunctionalTest(classWrapper(constructor), ...input)
	}
}

export function PropertyMethodTest(propName: string) {
	return function <Type = any>(methodName: string) {
		return function (
			instance: Type,
			compared: any,
			input: any[] = [],
			compare: (x: any, y: any) => boolean = equals
		) {
			method(methodName, () => {
				instance[methodName](...input)
				assert(compare(instance[propName], compared))
			})
		}
	}
}

export function iterationTest<Type extends Iterable<any> = any>(
	collectionInstance: Type,
	iteratedOver: any[],
	compare: (x: any, y: any) => boolean = equals
) {
	method("[Symbol.iterator]", () =>
		assert(same(collectionInstance, iteratedOver, compare))
	)
}

export function methodTest<InstanceType = any>(methodName: string) {
	return function (
		instance: InstanceType,
		expectedValue: any,
		...input: any[]
	) {
		method(
			methodName,
			() =>
				assert.strictEqual(
					instance[methodName](...input),
					expectedValue
				),
			...input
		)
	}
}

export function comparisonMethodTest<InstanceType = any>(
	methodName: string,
	compare: (x: any, y: any) => boolean
) {
	return function (
		instance: InstanceType,
		expectedValue: any,
		...input: any[]
	) {
		method(
			methodName,
			() =>
				assert(compare(instance[methodName](...input), expectedValue)),
			...input
		)
	}
}

export function flexibleComparisonMethodTest<InstanceType = any>(
	methodName: string
) {
	return function (
		instance: InstanceType,
		expectedValue: any,
		input: any[],
		compare: (x: any, y: any) => boolean = equals
	) {
		method(
			methodName,
			() =>
				assert(compare(instance[methodName](...input), expectedValue)),
			...input
		)
	}
}

export function setMethodTest<InstanceType = any>(
	setMethodName: string,
	getMethodName: string
) {
	return function (
		instance: InstanceType,
		expectedValue: any,
		...input: any[]
	) {
		method(
			setMethodName,
			() => {
				instance[setMethodName](...input)
				assert.strictEqual(
					input[getMethodName](input[0]),
					expectedValue
				)
			},
			...input
		)
	}
}

export function utilTest(testedUtil: Function, utilName: string) {
	return function (expected: any, ...input: any[]) {
		util(
			utilName,
			() => assert.strictEqual(testedUtil(...input), expected),
			...input
		)
	}
}

export function comparisonUtilTest(compare: (x: any, y: any) => boolean) {
	return function (testedUtil: Function, utilName: string) {
		return function (expected: any, ...input: any[]) {
			util(
				utilName,
				() => assert(compare(testedUtil(...input), expected)),
				...input
			)
		}
	}
}

export function predicateUtilTest(pred: (x: any) => boolean) {
	return function (testedUtil: Function, utilName: string) {
		return function (...input: any[]) {
			util(utilName, () => assert(pred(testedUtil(...input))), ...input)
		}
	}
}

export function doubleCurriedComparisonUtilTest(
	compare: (x: any, y: any) => boolean
) {
	return function (testedUtil: Function, utilName: string, arity: number) {
		return function (expected: any, ...input: any[]) {
			util(
				utilName,
				() =>
					assert(
						compare(
							testedUtil(...input.slice(0, arity))(
								...input.slice(arity)
							),
							expected
						)
					),
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
		lowCompare: (x: any, y: any) => boolean = equals
	) {
		util(
			utilName,
			() => assert(highCompare(util(...input), expected, lowCompare)),
			...input
		)
	}
}

export function flexibleUtilTest(testedUtil: Function, utilName: string) {
	return function (
		expected: any,
		compare: (x: any, y: any) => boolean,
		...input: any[]
	) {
		util(
			utilName,
			() => assert(compare(testedUtil(...input), expected)),
			...input
		)
	}
}

export const optional = (type: Function) => or(not, type)
export const optionalMethod = optional(isFunction)

export function InitClassConstructorTest<
	ClassType extends IInitializable = IInitializable
>(
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

	return function (
		constructor: new (...x: any[]) => ClassType,
		...input: any[]
	) {
		const instance = new constructor()
		;(instance.init as (...x: any[]) => any)(...input)
		return UnderChainTest(instance)
	}
}

export function signatures<SignatureType extends object = any>(
	signatures: SignatureType[],
	post: (signature: SignatureType) => () => void
) {
	for (let i = 0; i < signatures.length; ++i)
		it(`signature: ${i}`, post(signatures[i]))
}

export const [method, util] = ["method", "util"].map(
	(typeString, i) =>
		(name: string, post: () => void, ...args: any[]) =>
			it(
				`${typeString}: ${!i ? "." : ""}${name}(${inputDescribe(
					args
				)})`,
				post
			)
)

export const [classTest, property, namespace, importName, quality] = [
	"class",
	"property",
	"namespace",
	"import",
	"quality"
].map(
	(typeString, i) => (name: string, post: () => void) =>
		it(`${typeString}: ${i === 1 ? "." : ""}${name}`, post)
)

export function uniquenessTest(x: Iterable<any>) {
	quality("uniqueness", () =>
		assert.strictEqual(new Set(x).size, [...x].length)
	)
}
