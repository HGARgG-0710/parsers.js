import { type, object } from "@hgargg-0710/one"
import { TestCounter } from "../lib/lib.js"
import {
	HAS_CONSTRUCTOR,
	MixinInstanceTest,
	MixinPrototypeTest,
	NO_CONSTRUCTOR,
	NO_PARENTS,
	PureMixinPrototypeTest
} from "./lib/classes.js"

const { prototype } = object
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
	})()
})

mixinTestCounter.test([HAS_CONSTRUCTOR, NO_PARENTS], () => {
	function constructor(a: number, b: string) {
		this.a = a === this.a ? a + 1 : a
		this.b = b + "b"
	}

	const mixinShape = {
		name: "Test3",
		properties: {
			a: 3,
			k() {
				return this.b + "m"
			},
			m(b: string) {
				this.b = b
			}
		},
		constructor
	}

	new MixinPrototypeTest(mixinShape).toClass({
		constructor: {
			value: constructor,
			writable: true,
			enumerable: false,
			configurable: true
		},
		a: {
			value: 3,
			writable: true,
			enumerable: true,
			configurable: true
		},
		k: {
			value: mixinShape.properties.k,
			writable: true,
			enumerable: true,
			configurable: true
		},
		m: {
			value: mixinShape.properties.m,
			writable: true,
			enumerable: true,
			configurable: true
		}
	})

	const instanceTest = new MixinInstanceTest(mixinShape).withInstance({
		a: (x: any) => {
			const initDiff = x.a !== prototype(x).a
			x.a = prototype(x).a + 1
			return initDiff && x.a !== prototype(x).a
		},
		m: (x: any) => {
			const hasB = !!x.b
			const newB = x.b + "a"
			x.m(newB)
			return hasB && x.b === newB && x.k() === newB + "m"
		}
	})

	instanceTest(10, "mer")
	instanceTest(-11, "70")
})

// ! TESTS are intended to verify TWO behaviours:
// 	1. [in 'parent'-tests only...] the '.super' stuff: 
// 		1. [.constructor-tests only] presence of `super.SomeParentName.constructor`
// 		2. ability to store MULTIPLE parents
// 		3. ORDER of property inheritance [overriding - when a CLASS and a MIXIN, or MULTIPLE classes/mixins are added - THERE MUST be a specific property-addition order present]: 
// 			1. FIRST - copy from `class`es
// 			2. THEN - copy from `mixin`s
//			3. COPY in each of the arrays - from FIRST to LAST [that is - properties in the LATER parents have HIGHER precedence - are less likely to be overriden]: 

// TODO: tests left to do:
// * 1. with .constructor [MixinPrototypeTest + MixinInstanceTest]:
// 		2. parents:
// 			1. 2 classes +  getters + setters + methods + prototype-vars
// 			2. 2 mixins +  getters + setters + methods + prototype-vars
// 			3. 1 class + 2 mixins +  getters + setters + methods + prototype-vars
// * 2. without .constructor [PureMixinPrototypeTest + MixinInstanceTest]:
// 		1. with both 'class' and 'mixin' parents
// 			1. 1 'class' parent + 1 'mixin' parent + getters + setters + methods + prototype-vars
// 			2. 2 'class' parents + 3 'mixin' parents + gettesr + setters + methods + prototype-vars
