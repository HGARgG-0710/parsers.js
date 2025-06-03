import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import {
	mixin,
	type IMixinShape,
	type INonVoidConstructor,
	type IOutClass
} from "../../../../dist/main.js"
import { InterfaceTest, type InterfaceShape } from "../../lib/lib.js"

const { withoutConstructor } = object.classes
const { propertyDescriptors, withoutProperties } = object

const withoutSuper = withoutProperties("super")

/**
 * * Format documentation for 'mixin' tests' semver
 *
 * format: a.b.c, where
 * 		a - one of: 0/1, being
 * 			0 - 'constructor' property not explicitly specified
 * 			1 - '.constructor' property explicitly specified
 * 		b - one of: 0/1/2/3, being
 * 			0 - niether 'mixins' nor 'classes' parents-parameters has been given values in the 'mixin' constructor
 * 			1 - 'classes' parameter has been given a value, but not 'mixins'
 * 			2 - 'mixins' parameter has been given a value, but not 'classes'
 * 			3 - both 'mixins' and 'classes' parameters have been given values
 * 		c - current test count [amongst tests with the same 'a.b' sub-version]
 */

export const NO_CONSTRUCTOR = 0
export const HAS_CONSTRUCTOR = 1

export const NO_PARENTS = 0
export const CLASS_PARENTS = 1
export const MIXIN_PARENTS = 2
export const CLASS_AND_MIXIN_PARENTS = 3

abstract class BaseMixinTest<T = any, Args extends any[] = any[]> {
	protected readonly mixinInstance: mixin<T, Args>
	constructor(mixinShape: IMixinShape<T, Args>) {
		this.mixinInstance = new mixin(mixinShape)
	}
}

abstract class BaseMixinPrototypeTest<
	T = any,
	Args extends any[] = any[]
> extends BaseMixinTest<T, Args> {
	protected readonly mixinName: string
	protected readonly mixinSuper: (new (...args: any) => any)[]

	protected abstract testedConditions(
		mixinClass: new (...args: Args) => T | void,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	): void

	toClass(expectedPrototypeDescriptors: PropertyDescriptorMap) {
		this.testedConditions(
			this.mixinInstance.toClass(),
			expectedPrototypeDescriptors
		)
	}

	constructor(
		mixinShape: IMixinShape<T, Args>,
		superMixins: mixin[] = [],
		superClasses: (new (...args: any) => any)[] = []
	) {
		super(mixinShape)
		this.mixinName = mixinShape.name
		this.mixinSuper = [
			...superMixins.map((x) => x.toClass()),
			...superClasses
		]
	}
}

abstract class DefaultMixinPrototypeTest<
	T = any,
	Args extends any[] = any[]
> extends BaseMixinPrototypeTest<T, Args> {
	protected abstract mixinPrototypeDescriptors(
		x: object
	): PropertyDescriptorMap

	private verifyPrototype(
		mixinClass: new (...args: Args) => T,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	) {
		assert(
			object.recursiveSame(
				expectedPrototypeDescriptors,
				withoutSuper(
					this.mixinPrototypeDescriptors(mixinClass.prototype)
				)
			)
		)
	}

	private verifyName(mixinClass: new (...args: Args) => T) {
		assert.strictEqual(this.mixinName, mixinClass.name)
		assert.strictEqual(this.mixinName, this.mixinInstance.name)
	}

	private verifySuper(mixinClass: new (...args: Args) => T) {
		const mixinSuper = mixinClass.prototype.super
		for (const x of this.mixinSuper)
			assert.strictEqual(mixinSuper[x.name], x.prototype)
	}

	protected testedConditions(
		mixinClass: new (...args: Args) => T,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	): void {
		this.verifyPrototype(mixinClass, expectedPrototypeDescriptors)
		this.verifyName(mixinClass)
		this.verifySuper(mixinClass)
	}
}

export class PureMixinPrototypeTest<
	T = any,
	Args extends any[] = any
> extends DefaultMixinPrototypeTest<T, Args> {
	protected mixinPrototypeDescriptors(x: object) {
		return withoutConstructor(
			propertyDescriptors(x)
		) as PropertyDescriptorMap
	}

	protected testedConditions(
		mixinClass: IOutClass<T, Args>,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	): void {
		super.testedConditions(mixinClass, expectedPrototypeDescriptors)
		assert.strictEqual(
			String(mixinClass),
			String(function () {})
		)
	}
}

export class MixinPrototypeTest<
	T = any,
	Args extends any[] = any[]
> extends DefaultMixinPrototypeTest<T, Args> {
	private readonly origConstructor: INonVoidConstructor<T, Args>

	protected mixinPrototypeDescriptors(x: object): PropertyDescriptorMap {
		return propertyDescriptors(x)
	}

	protected testedConditions(
		mixinClass: IOutClass<T, Args>,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	) {
		super.testedConditions(mixinClass, expectedPrototypeDescriptors)
		assert.strictEqual(mixinClass, this.origConstructor)
	}

	constructor(mixinShape: IMixinShape<T, Args>) {
		super(mixinShape)
		this.origConstructor = mixinShape.constructor as INonVoidConstructor<
			T,
			Args
		>
	}
}

export class MixinInstanceTest<
	T = any,
	Args extends any[] = any[]
> extends BaseMixinTest<T, Args> {
	withInstance(expected: InterfaceShape) {
		return new InterfaceTest(expected).withClass(
			this.mixinInstance.toClass()
		)
	}
}
