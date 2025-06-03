import { TestCounter } from "../lib/lib.js"
import {
	HAS_CONSTRUCTOR,
	MixinInstanceTest,
	MixinPrototypeTest,
	NO_CONSTRUCTOR,
	NO_PARENTS,
	PureMixinPrototypeTest
} from "./lib/classes.js"

import { type } from "@hgargg-0710/one"
const { isFunction } = type

const mixinTestCounter = new TestCounter(
	([hasConstructor, parentCode, categoryCount]: [number, number, number]) =>
		`mixin (#${hasConstructor}.${parentCode}.${categoryCount})`
)

mixinTestCounter.test([NO_CONSTRUCTOR, NO_PARENTS], () =>
	new PureMixinPrototypeTest({ name: "Test0", properties: {} }).toClass({})
)

mixinTestCounter.test([HAS_CONSTRUCTOR, NO_PARENTS], () => {
	const constructor = function () {}
	new MixinPrototypeTest({
		name: "Test1",
		properties: {},
		constructor
	}).toClass({
		constructor: {
			value: constructor,
			writable: true,
			enumerable: false,
			configurable: true
		}
	})
})

mixinTestCounter.test([NO_CONSTRUCTOR, NO_PARENTS], () => {
	const b = function (c: number) {
		return c + 5
	}

	function resetA(x: any) {
		x.a = 10
	}

	const mixinShape = {
		name: "Test2",
		properties: {
			a: 10,
			b: b,
			c(d: number) {
				return this.b(d + this.a + 3)
			},
			set T(t: number) {
				this.a = t
			},
			get T() {
				return this.a
			},
			get R() {
				return 17
			}
		}
	}

	new PureMixinPrototypeTest(mixinShape).toClass({
		a: {
			value: 10,
			writable: true,
			enumerable: true,
			configurable: true
		},
		b: {
			value: b,
			writable: true,
			enumerable: true,
			configurable: true
		},
		c: {
			value: mixinShape.properties.c,
			writable: true,
			enumerable: true,
			configurable: true
		},
		T: {
			get: Object.getOwnPropertyDescriptor(mixinShape.properties, "T")!
				.get!,
			set: Object.getOwnPropertyDescriptor(mixinShape.properties, "T")!
				.set!,
			enumerable: true,
			configurable: true
		},
		R: {
			get: Object.getOwnPropertyDescriptor(mixinShape.properties, "R")!
				.get!,
			set: undefined,
			enumerable: true,
			configurable: true
		}
	})

	new MixinInstanceTest(mixinShape).withInstance({
		a: (x: any) => {
			resetA(x)
			return x.a === 10
		},
		b: (x: any) => isFunction(x.b) && x.b === b,
		c: (x: any) => x.c(11) === 29,
		T: (x: any) => {
			const initSame = x.T === x.a
			x.T = x.T + 1
			return initSame && x.a === x.T
		},
		R: (x: any) => {
			return x.R === 17
		}
	})
})

// ! TESTS are intended to verify TWO behaviours:
// 	1. [in 'constructor'-tests only...] OVERRIDING [of ALL kinds of properties - methods/state/getters/setters/etc]
// 	2. [in 'parent'-tests only...] the '.super' stuff...

// TODO: tests left to do:
// * 1. with .constructor [MixinPrototypeTest + MixinInstanceTest]:
// 		1. no parents:
// 			1. getters + setters + methods + prototype-vars
// 2. parents:
// 			1. 2 classes +  getters + setters + methods + prototype-vars
// 			2. 2 mixins +  getters + setters + methods + prototype-vars
// 			3. 1 class + 2 mixins +  getters + setters + methods + prototype-vars
// * 2. without .constructor [PureMixinPrototypeTest + MixinInstanceTest]:
// 		2. with 'class' parents:
// 			1. 1 parent + getters + setters + methods + prototype-vars
// 			2. 3 parents + getters + setters + methods + prototype-vars
// 		3. with 'mixin' parents:
// 			1. 1 parent + getters + setters + methods + prototype-vars
// 			2. 3 parents + gettesr + setters + methods + prototype-vars
// 		4. with both 'class' and 'mixin' parents
// 			1. 1 'class' parent + 1 'mixin' parent + getters + setters + methods + prototype-vars
// 			2. 2 'class' parents + 3 'mixin' parents + gettesr + setters + methods + prototype-vars
