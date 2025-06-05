import { object, type } from "@hgargg-0710/one"
import { TestCounter } from "../lib/lib.js"
import {
	CLASS_PARENTS,
	HAS_CONSTRUCTOR,
	MixinInstanceTest,
	MixinPrototypeTest,
	NO_CONSTRUCTOR,
	NO_PARENTS,
	PureMixinPrototypeTest
} from "./lib/classes.js"

const { prototype, extendPrototype } = object
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

mixinTestCounter.test([HAS_CONSTRUCTOR, CLASS_PARENTS], () => {
	function T() {
		if (!this.b) this.b = 11
	}

	function Parent1() {
		T.call(this)
		this.b = 12
	}

	extendPrototype(
		Parent1,
		Object.getOwnPropertyDescriptors({
			get X() {
				return 10
			}
		})
	)

	function Parent2() {
		T.call(this)
		this._m = ""
		this.c = this.b + 1
		this.b = 13
	}

	extendPrototype(
		Parent2,
		Object.getOwnPropertyDescriptors({
			m(m?: string) {
				if (m) this._m = m
				else return this._m
			},

			get X() {
				return 9
			},

			get B() {
				return 19
			}
		})
	)

	function constructor1() {
		this.super.Parent1.constructor.call(this)
		this.super.Parent2.constructor.call(this)
	}

	function constructor2() {
		this.super.Parent2.constructor.call(this)
		this.super.Parent1.constructor.call(this)
	}

	const mixinShape1 = {
		name: "Test4",
		properties: {
			r: 19,
			get B() {
				return 12
			}
		},
		constructor: constructor1
	}
	const mixinShape2 = {
		name: "Test4",
		properties: {
			d() {
				return this.c + 17
			}
		},
		constructor: constructor2
	}

	new MixinPrototypeTest(mixinShape1, [], [Parent2, Parent1]).toClass({
		constructor: {
			value: constructor1,
			writable: true,
			enumerable: false,
			configurable: true
		},
		m: {
			value: Object.getOwnPropertyDescriptor(Parent2.prototype, "m")!
				.value,
			writable: true,
			enumerable: true,
			configurable: true
		},
		X: {
			get: Object.getOwnPropertyDescriptor(Parent1.prototype, "X")!.get,
			set: undefined,
			enumerable: true,
			configurable: true
		},
		B: {
			get: Object.getOwnPropertyDescriptor(mixinShape1.properties, "B")!
				.get,
			set: undefined,
			enumerable: true,
			configurable: true
		},
		r: {
			value: 19,
			writable: true,
			enumerable: true,
			configurable: true
		}
	})

	new MixinPrototypeTest(mixinShape2, [], [Parent1, Parent2]).toClass({
		constructor: {
			value: constructor2,
			writable: true,
			enumerable: false,
			configurable: true
		},
		X: {
			get: Object.getOwnPropertyDescriptor(Parent2.prototype, "X")!.get,
			set: undefined,
			enumerable: true,
			configurable: true
		},
		m: {
			value: Object.getOwnPropertyDescriptor(Parent2.prototype, "m")!
				.value,
			writable: true,
			enumerable: true,
			configurable: true
		},
		B: {
			get: Object.getOwnPropertyDescriptor(Parent2.prototype, "B")!.get,
			set: undefined,
			enumerable: true,
			configurable: true
		},
		d: {
			value: Object.getOwnPropertyDescriptor(mixinShape2.properties, "d")!
				.value,
			writable: true,
			enumerable: true,
			configurable: true
		}
	})

	const mPred = (x: any) => {
		x.m("10")
		const A = x.m() === "10"
		x.m("119")
		const B = x.m() === "119"
		return A && B
	}

	new MixinInstanceTest(mixinShape1, [], [Parent2, Parent1]).withInstance({
		X: (x: any) => x.X === 10,
		c: (x: any) => x.c === 13,
		m: mPred,
		B: (x: any) => x.B === 12,
		r: (x: any) => x.r === 19
	})()

	new MixinInstanceTest(mixinShape2, [], [Parent1, Parent2]).withInstance({
		X: (x: any) => x.X === 9,
		c: (x: any) => x.c === 12,
		m: mPred,
		B: (x: any) => x.B === 19,
		d: (x: any) => x.d() === 29
	})()
})

// ! REMINDER[1]: this is supposed to be a bunch of CLASSIC function-based JavaScript constructors, INSTEAD of TypeScript-style classes.
// ! REMINDER[2]: STILL haven't tried out the "parent methods" on:
// 		* 1. function-classes
// 		* 2. 'mixin' objects

// * [MixinPrototypeTest + MixinInstanceTest]
// 2 mixins +  getters + setters + methods + prototype-vars
// !!! ADD [Symbol.iterator] - to make sure it does work after all...
// TODO: finish
// mixinTestCounter.test([HAS_CONSTRUCTOR, MIXIN_PARENTS], () => {
// 	const parent1 = new mixin({ name: "Parent1", properties: {} })
// 	const parent2 = new mixin({ name: "Parent2", properties: {} })

// 	function constructor() {}

// 	const mixinShape = { name: "Test5", properties: {}, constructor }

// 	new MixinPrototypeTest(mixinShape, [parent1, parent2]).toClass({})

// 	const instanceTest = new MixinInstanceTest(mixinShape, [
// 		parent1,
// 		parent2
// 	]).withInstance({})
// })

// * [MixinPrototypeTest + MixinInstanceTest]
// 1 class + 2 mixins +  getters + setters + methods + prototype-vars
// TODO: finish
// !!! ADD [Symbol.iterator] - to make sure it does work after all...
// mixinTestCounter.test([HAS_CONSTRUCTOR, CLASS_AND_MIXIN_PARENTS], () => {
// 	class ClassParent1 {}

// 	const parent1 = new mixin({ name: "MixinParent1", properties: {} })
// 	const parent2 = new mixin({ name: "MixinParent2", properties: {} })

// 	function constructor() {}

// 	const mixinShape = { name: "Test6", properties: {}, constructor }

// 	new MixinPrototypeTest(
// 		mixinShape,
// 		[parent1, parent2],
// 		[ClassParent1]
// 	).toClass({})

// 	const instanceTest = new MixinInstanceTest(
// 		mixinShape,
// 		[parent1, parent2],
// 		[ClassParent1]
// 	).withInstance({})
// })

// * [PureMixinPrototypeTest + MixinInstanceTest]
// 2 'class' parents + 3 'mixin' parents + gettesr + setters + methods + prototype-vars
// TODO: finish
// mixinTestCounter.test([NO_CONSTRUCTOR, CLASS_AND_MIXIN_PARENTS], () => {
// 	class ClassParent1 {}
// 	class ClassParent2 {}

// 	const parent1 = new mixin({ name: "MixinParent1", properties: {} })
// 	const parent2 = new mixin({ name: "MixinParent2", properties: {} })
// 	const parent3 = new mixin({ name: "MixinParent3", properties: {} })

// 	function constructor() {}

// 	const mixinShape = { name: "Test7", properties: {}, constructor }

// 	new MixinPrototypeTest(
// 		mixinShape,
// 		[parent1, parent2, parent3],
// 		[ClassParent1, ClassParent2]
// 	).toClass({})

// 	const instanceTest = new MixinInstanceTest(
// 		mixinShape,
// 		[parent1, parent2, parent3],
// 		[ClassParent1, ClassParent2]
// 	)
// })

// ! TESTS are intended to verify TWO behaviours:
// 	1. [in 'parent'-tests only...] the '.super' stuff:
// 		1. [.constructor-tests only] presence of `super.SomeParentName.constructor`
// 		2. ability to store MULTIPLE parents
// 		3. ORDER of property inheritance [overriding - when a CLASS and a MIXIN, or MULTIPLE classes/mixins are added - THERE MUST be a specific property-addition order present]:
// 			1. FIRST - copy from `class`es
// 			2. THEN - copy from `mixin`s
//			3. COPY in each of the arrays - from FIRST to LAST [that is - properties in the LATER parents have HIGHER precedence - are less likely to be overriden]:
