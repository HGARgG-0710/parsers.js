import { array, object, type } from "@hgargg-0710/one"
import { mixin } from "../../../dist/main.js"
import { TestCounter } from "../lib.js"
import {
	ConstructorTestTypes,
	MixinInstanceTest,
	MixinPrototypeTest,
	ParentTestTypes,
	PureMixinPrototypeTest
} from "./lib.js"

const { prototype, extendPrototype } = object
const { isFunction } = type

const mixinTestCounter = new TestCounter(
	([hasConstructor, parentCode, categoryCount]: [number, number, number]) =>
		`mixin (#${hasConstructor}.${parentCode}.${categoryCount})`
)

mixinTestCounter.test(
	[ConstructorTestTypes.NO_CONSTRUCTOR, ParentTestTypes.NO_PARENTS],
	() =>
		new PureMixinPrototypeTest({ name: "Test0", properties: {} }).toClass(
			{}
		),
	true
)

mixinTestCounter.test(
	[ConstructorTestTypes.HAS_CONSTRUCTOR, ParentTestTypes.NO_PARENTS],
	() => {
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
	},
	true
)

mixinTestCounter.test(
	[ConstructorTestTypes.NO_CONSTRUCTOR, ParentTestTypes.NO_PARENTS],
	() => {
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
				get: Object.getOwnPropertyDescriptor(
					mixinShape.properties,
					"T"
				)!.get!,
				set: Object.getOwnPropertyDescriptor(
					mixinShape.properties,
					"T"
				)!.set!,
				enumerable: true,
				configurable: true
			},
			R: {
				get: Object.getOwnPropertyDescriptor(
					mixinShape.properties,
					"R"
				)!.get!,
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
	},
	true
)

mixinTestCounter.test(
	[ConstructorTestTypes.HAS_CONSTRUCTOR, ParentTestTypes.NO_PARENTS],
	() => {
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
	},
	true
)

mixinTestCounter.test(
	[ConstructorTestTypes.HAS_CONSTRUCTOR, ParentTestTypes.CLASS_PARENTS],
	() => {
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
				value: Parent2.prototype.m,
				writable: true,
				enumerable: true,
				configurable: true
			},
			X: {
				get: Object.getOwnPropertyDescriptor(Parent1.prototype, "X")!
					.get,
				set: undefined,
				enumerable: true,
				configurable: true
			},
			B: {
				get: Object.getOwnPropertyDescriptor(
					mixinShape1.properties,
					"B"
				)!.get,
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
				get: Object.getOwnPropertyDescriptor(Parent2.prototype, "X")!
					.get,
				set: undefined,
				enumerable: true,
				configurable: true
			},
			m: {
				value: Parent2.prototype.m,
				writable: true,
				enumerable: true,
				configurable: true
			},
			B: {
				get: Object.getOwnPropertyDescriptor(Parent2.prototype, "B")!
					.get,
				set: undefined,
				enumerable: true,
				configurable: true
			},
			d: {
				value: mixinShape2.properties.d,
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

		new MixinInstanceTest(mixinShape1, [], [Parent2, Parent1]).withInstance(
			{
				X: (x: any) => x.X === 10,
				c: (x: any) => x.c === 13,
				m: mPred,
				B: (x: any) => x.B === 12,
				r: (x: any) => x.r === 19
			}
		)()

		new MixinInstanceTest(mixinShape2, [], [Parent1, Parent2]).withInstance(
			{
				X: (x: any) => x.X === 9,
				c: (x: any) => x.c === 12,
				m: mPred,
				B: (x: any) => x.B === 19,
				d: (x: any) => x.d() === 29
			}
		)()
	},
	true
)

mixinTestCounter.test(
	[ConstructorTestTypes.HAS_CONSTRUCTOR, ParentTestTypes.MIXIN_PARENTS],
	() => {
		function parent1Constructor(x: number) {
			this.S = x
		}

		const parent1Shape = {
			name: "MixinParent1",
			properties: {
				t: 10,
				s: 0,

				set S(newS: number) {
					this.s = newS
				},

				get S() {
					return this.s
				},

				m() {
					return 19
				},

				*[Symbol.iterator]() {
					yield 10
					yield 11
				}
			},

			constructor: parent1Constructor
		}

		const parent1 = new mixin(parent1Shape)

		function parent2Constructor(m: number) {
			this.z = m
		}

		const parent2Shape = {
			name: "MixinParent2",
			properties: {
				t: 5,
				z: 11,

				m() {
					return this.z
				}
			},
			constructor: parent2Constructor
		}

		const parent2 = new mixin(parent2Shape)

		function constructor(x: number, m: number) {
			this.super.MixinParent1.constructor.call(this, x)
			this.super.MixinParent2.constructor.call(this, m)
		}

		const mixinShape = {
			name: "Test5",
			properties: {
				z: 2,
				get r() {
					return 19
				}
			},
			constructor
		}

		new MixinPrototypeTest(mixinShape, [parent1, parent2]).toClass({
			constructor: {
				value: constructor,
				writable: true,
				enumerable: false,
				configurable: true
			},
			t: {
				value: 5,
				writable: true,
				enumerable: true,
				configurable: true
			},
			s: {
				value: 0,
				writable: true,
				enumerable: true,
				configurable: true
			},
			S: {
				get: Object.getOwnPropertyDescriptor(
					parent1Shape.properties,
					"S"
				)!.get!,
				set: Object.getOwnPropertyDescriptor(
					parent1Shape.properties,
					"S"
				)!.set!,
				enumerable: true,
				configurable: true
			},
			m: {
				value: parent2Shape.properties.m,
				writable: true,
				enumerable: true,
				configurable: true
			},
			[Symbol.iterator]: {
				value: parent1Shape.properties[Symbol.iterator],
				writable: true,
				enumerable: true,
				configurable: true
			},
			z: {
				value: 2,
				writable: true,
				enumerable: true,
				configurable: true
			},
			r: {
				get: Object.getOwnPropertyDescriptor(
					mixinShape.properties,
					"r"
				)!.get,
				set: undefined,
				enumerable: true,
				configurable: true
			}
		})

		new MixinInstanceTest(mixinShape, [parent1, parent2]).withInstance({
			r: (x: any) => x.r === 19,
			z: (x: any) => x.z === 29,
			t: (x: any) => x.t === 5,
			s: (x: any) => {
				const initS = x.S === x.s
				const initS1 = x.S === 11
				x.S = 3
				return initS && initS1 && x.s === x.S && x.S === 3
			},
			iter: (x: any) => array.same([10, 11], [...x]),
			m: (x: any) => x.m() === 29
		})(11, 29)
	},
	true
)

mixinTestCounter.test(
	[
		ConstructorTestTypes.HAS_CONSTRUCTOR,
		ParentTestTypes.CLASS_AND_MIXIN_PARENTS
	],
	() => {
		function ClassParent1() {}

		extendPrototype(
			ClassParent1,
			Object.getOwnPropertyDescriptors({
				get m() {
					return 19
				},

				*[Symbol.iterator]() {
					yield 11
					yield 95
					yield 17
					yield 49
				}
			})
		)

		const parent1 = new mixin({
			name: "MixinParent1",
			properties: {
				get m() {
					return 20
				}
			}
		})

		const parent2Shape = {
			name: "MixinParent2",
			properties: {
				get m() {
					return 5
				}
			}
		}

		const parent2 = new mixin(parent2Shape)

		function constructor() {}

		const mixinShape = {
			name: "Test6",
			properties: {
				get s() {
					return (
						this.super.MixinParent1.m.get.call(this) +
						this.super.MixinParent2.m.get.call(this) -
						this.super.ClassParent1.m.get.call(this)
					)
				}
			},
			constructor
		}

		new MixinPrototypeTest(
			mixinShape,
			[parent1, parent2],
			[ClassParent1]
		).toClass({
			constructor: {
				value: constructor,
				writable: true,
				enumerable: false,
				configurable: true
			},
			m: {
				get: Object.getOwnPropertyDescriptor(
					parent2Shape.properties,
					"m"
				)!.get,
				set: undefined,
				enumerable: true,
				configurable: true
			},
			s: {
				get: Object.getOwnPropertyDescriptor(
					mixinShape.properties,
					"s"
				)!.get,
				set: undefined,
				enumerable: true,
				configurable: true
			},
			[Symbol.iterator]: {
				value: ClassParent1.prototype[Symbol.iterator],
				writable: true,
				enumerable: true,
				configurable: true
			}
		})

		new MixinInstanceTest(
			mixinShape,
			[parent1, parent2],
			[ClassParent1]
		).withInstance({
			s: (x: any) => x.s === 6,
			m: (x: any) => x.m === 5,
			iter: (x: any) => array.same([11, 95, 17, 49], [...x])
		})()
	},
	true
)

mixinTestCounter.test(
	[
		ConstructorTestTypes.NO_CONSTRUCTOR,
		ParentTestTypes.CLASS_AND_MIXIN_PARENTS
	],
	() => {
		function ClassParent1() {}

		extendPrototype(
			ClassParent1,
			Object.getOwnPropertyDescriptors({
				set d(newD: number) {
					this._s = newD
				},

				m() {
					return 11
				}
			})
		)

		function ClassParent2() {}

		extendPrototype(
			ClassParent2,
			Object.getOwnPropertyDescriptors({
				set d(newD: number) {
					this.k = newD
				},

				m() {
					return 20
				},

				*[Symbol.iterator]() {
					yield 17
				}
			})
		)

		const parent1 = new mixin({
			name: "MixinParent1",
			properties: {
				m() {
					return 31
				}
			}
		})
		const parent2 = new mixin({
			name: "MixinParent2",
			properties: {
				m() {
					return -3
				}
			}
		})

		const parent3Shape = {
			name: "MixinParent3",
			properties: {
				set d(newD: number) {
					this.r = newD
				},

				m() {
					return -13
				}
			}
		}

		const parent3 = new mixin(parent3Shape)

		const mixinShape = {
			name: "Test7",
			properties: {
				set d(newD: number) {
					this.super.ClassParent1.d.set.call(this, newD)
					this.super.ClassParent2.d.set.call(this, newD)
					this.super.MixinParent3.d.set.call(this, newD)
				},

				*[Symbol.iterator]() {
					yield this.super.ClassParent1.m()
					yield this.super.ClassParent2.m()
					yield this.super.MixinParent1.m()
					yield this.super.MixinParent2.m()
					yield this.super.MixinParent3.m()
				}
			}
		}

		new PureMixinPrototypeTest(
			mixinShape,
			[parent1, parent2, parent3],
			[ClassParent1, ClassParent2]
		).toClass({
			d: {
				get: undefined,
				set: Object.getOwnPropertyDescriptor(
					mixinShape.properties,
					"d"
				)!.set,
				enumerable: true,
				configurable: true
			},
			m: {
				value: parent3Shape.properties.m,
				writable: true,
				enumerable: true,
				configurable: true
			},
			[Symbol.iterator]: {
				value: mixinShape.properties[Symbol.iterator],
				writable: true,
				enumerable: true,
				configurable: true
			}
		})

		new MixinInstanceTest(
			mixinShape,
			[parent1, parent2, parent3],
			[ClassParent1, ClassParent2]
		).withInstance({
			m: (x: any) => x.m() === -13,
			t: (x: any) => array.same([11, 20, 31, -3, -13], [...x]),
			d: (x: any) => {
				x.d = 20
				const initD1 = x._s === 20
				const initD2 = x.k === 20
				const initD3 = x.r === 20
				x.d = 11
				return (
					initD1 &&
					initD2 &&
					initD3 &&
					x._s === 11 &&
					x.k === 11 &&
					x.r === 11
				)
			}
		})()
	},
	true
)

mixinTestCounter.test(
	[ConstructorTestTypes.HAS_CONSTRUCTOR, ParentTestTypes.NO_PARENTS],
	() => {
		const mixinShape = {
			name: "Test8",
			properties: {},
			constructor(x: number) {
				this.x = x + 1
			}
		}

		new MixinInstanceTest(mixinShape).withInstance({
			x: (exp: any) => exp.x === 11
		})(10)
	},
	true
)
