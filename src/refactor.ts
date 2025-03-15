// * A dump file with a load of good ideas that don't fit the library's ontology (and whose presence is needed for practical reasons - implementation details, in other words)

import type { object as t_object } from "@hgargg-0710/one"

import { functional, object, type } from "@hgargg-0710/one"
const { argWaster, trivialCompose } = functional
const { extendPrototype, keys, propertyDescriptors } = object
const { delegateMethod, delegateProperty, classWrapper } = object.classes
const { ConstDescriptor } = object.descriptor
const { isFunction } = type

type Prototypal = t_object.Constructor

export const parameterWaster = trivialCompose(
	(f: Function) => argWaster(f)(),
	classWrapper
)

export const [valueDelegate, valuePropDelegate] = [
	delegateMethod,
	delegateProperty
].map((x) => x("value"))

export const superDescriptor = (Super: Prototypal) => ({
	super: ConstDescriptor(Super.prototype)
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
	
export function makeDelegate(classObj: any, delegateName: string): Function {
	const proto = propertyDescriptors(classObj.prototype)
	const protoKeys = keys(proto)

	const delegatePrototype: PropertyDescriptorMap = {}
	for (let i = 0; i < protoKeys.length; ++i) {
		const itemName = protoKeys[i] as number | string
		const itemValue = proto[itemName]

		if ("value" in itemValue) {
			if (isFunction(itemValue.value)) {
				delegatePrototype[itemName] = ConstDescriptor(function (
					...args: any[]
				) {
					return this[delegateName][itemName].call(this, ...args)
				})
				continue
			}
			delegatePrototype[itemName] = proto[itemName]
			continue
		}

		delegatePrototype[itemName] = {}

		if ("get" in itemValue)
			delegatePrototype[itemName].get = function () {
				return this[delegateName][itemName]
			}

		if ("set" in itemValue)
			delegatePrototype[itemName].set = function (v: any) {
				return (this[delegateName][itemName] = v)
			}
	}

	class delegateClass {
		constructor(...args: any[]) {
			this[delegateName] = new classObj(...args)
		}
	}

	extendPrototype(delegateClass, delegatePrototype)

	return delegateClass
}
