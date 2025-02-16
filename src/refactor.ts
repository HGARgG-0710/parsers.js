// * A dump file with a load of good ideas that don't fit the library's ontology (and whose presence is needed for practical reasons - implementation details, in other words)

import type { HasType } from "./IndexMap/interfaces.js"
import type { Prototypal } from "./interfaces.js"

import { object} from "@hgargg-0710/one"
const { propertyDescriptors, withoutProperties } = object

/**
 * Returns whether `set.has(x)`
 */

export const has = (set: HasType) => (x: any) => set.has(x)

export const parameterWaster =
	<Type = any>(X: new (...input: any[]) => Type) =>
	() =>
		new X()

export const getSetDescriptor = (get: () => any, set: () => any) => ({ get, set })

export const withoutConstructor = withoutProperties(new Set(["constructor"]))

export const extendPrototype = (
	Extended: Prototypal,
	properties: PropertyDescriptorMap
) => Object.defineProperties(Extended.prototype, properties)

export const mixin = (Extended: Prototypal, ...classes: Prototypal[]) =>
	classes.forEach((ParentClass) =>
		extendPrototype(
			Extended,
			withoutConstructor(
				propertyDescriptors(ParentClass.prototype)
			) as PropertyDescriptorMap
		)
	)

export const alterProp = Object.defineProperty

export const protoProp = (
	Extended: Prototypal,
	name: PropertyKey,
	value: PropertyDescriptor
) => Object.defineProperty(Extended.prototype, name, value)

export const delegate = (delegatePropName: string) => (delegateMethodName: string) =>
	function (...delegateArgs: any[]) {
		return this[delegatePropName][delegateMethodName](...delegateArgs)
	}

export const delegateProperty = (delegatePropName: string) => (propName: string) =>
	function () {
		return this[delegatePropName][propName]
	}

export const [valueDelegate, valuePropDelegate] = [delegate, delegateProperty].map((x) =>
	x("value")
)

export const classWrapper =
	(X: new (...args: any[]) => any) =>
	(...args: any[]) =>
		new X(...args)

export const copyFunction = (f: Function) => f.bind(null)

export const charCodeAt = (string: string, i: number) => string.charCodeAt(i)

export const superDescriptor = (Super: Prototypal) => ({
	super: { value: Super.prototype }
})

export const withSuper = (
	Class: Prototypal,
	Base: Prototypal,
	rest: PropertyDescriptorMap
) =>
	extendPrototype(Class, {
		...superDescriptor(Base),
		...rest
	})
