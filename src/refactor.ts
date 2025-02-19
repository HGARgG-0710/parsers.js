// * A dump file with a load of good ideas that don't fit the library's ontology (and whose presence is needed for practical reasons - implementation details, in other words)

import type { Prototypal } from "./interfaces.js"

import { functional, object } from "@hgargg-0710/one"
const { argWaster, trivialCompose } = functional
const { extendPrototype } = object
const { delegateMethod, delegateProperty, classWrapper } = object.classes
const { ConstDescriptor } = object.descriptor

export const parameterWaster = trivialCompose(
	(f: Function) => argWaster(f)(),
	classWrapper
)

export const [valueDelegate, valuePropDelegate] = [delegateMethod, delegateProperty].map(
	(x) => x("value")
)

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
