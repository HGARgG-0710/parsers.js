import { object, type } from "@hgargg-0710/one"
import assert from "node:assert"
import { mixin } from "../../../dist/main.js"
import { InterfaceTest, type InterfaceShape } from "../lib.js"

const { withoutConstructor } = object.classes
const { propertyDescriptors, withoutProperties, keys } = object
const { isStruct } = type

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

export enum ConstructorTestTypes {
	NO_CONSTRUCTOR = 0,
	HAS_CONSTRUCTOR = 1
}

export enum ParentTestTypes {
	NO_PARENTS = 0,
	CLASS_PARENTS = 1,
	MIXIN_PARENTS = 2,
	CLASS_AND_MIXIN_PARENTS = 3
}

abstract class BaseMixinTest {
	protected readonly mixinInstance: mixin
	protected readonly mixinSuper: Function[]

	constructor(
		mixinShape: mixin.IMixinShape,
		superClasses: Function[] = []
	) {
		this.mixinInstance = new mixin(mixinShape, superClasses)
		this.mixinSuper = [...superClasses]
	}
}

abstract class BaseMixinPrototypeTest<
	T = any,
	Args extends any[] = any[]
> extends BaseMixinTest {
	protected readonly mixinName: string

	protected abstract testedConditions(
		mixinClass: Function,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	): void

	toClass(expectedPrototypeDescriptors: PropertyDescriptorMap) {
		this.testedConditions(
			this.mixinInstance.toClass(),
			expectedPrototypeDescriptors
		)
	}

	constructor(mixinShape: mixin.IMixinShape, superClasses?: Function[]) {
		super(mixinShape, superClasses)
		this.mixinName = mixinShape.name
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
		mixinClass: Function,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	) {
		assert(
			object.recursiveSame(
				expectedPrototypeDescriptors,
				withoutSuper(this.mixinPrototypeDescriptors(mixinClass.prototype))
			)
		)
	}

	private verifyName(mixinClass: Function) {
		assert.strictEqual(this.mixinName, mixinClass.name)
		assert.strictEqual(this.mixinName, this.mixinInstance.name)
	}

	private verifySuper(mixinClass: Function) {
		const mixinSuper = mixinClass.prototype.super
		for (const x of this.mixinSuper) {
			const currSuper = mixinSuper[x.name]
			assert(!!currSuper)

			const prototypeMap = withoutSuper(propertyDescriptors(x.prototype))
			for (const k of keys(prototypeMap)) {
				const currDescriptor = (prototypeMap as any)[k]
				const currSuperProp = currSuper[k]

				if (!!currDescriptor.get || !!currDescriptor.set) {
					assert(isStruct(currSuperProp))
					assert.strictEqual(currSuperProp.set, currDescriptor.set)
					assert.strictEqual(currSuperProp.get, currDescriptor.get)
					continue
				}

				assert.strictEqual(currSuperProp, currDescriptor.value)
			}
		}
	}

	protected testedConditions(
		mixinClass: Function,
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
		mixinClass: Function,
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
	private readonly origConstructor: Function

	protected mixinPrototypeDescriptors(x: object): PropertyDescriptorMap {
		return propertyDescriptors(x)
	}

	protected testedConditions(
		mixinClass: Function,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	) {
		super.testedConditions(mixinClass, expectedPrototypeDescriptors)
		assert.strictEqual(mixinClass, this.origConstructor)
	}

	constructor(mixinShape: mixin.IMixinShape, superClasses?: Function[]) {
		super(mixinShape, superClasses)
		this.origConstructor = mixinShape.constructor!
	}
}

export class MixinInstanceTest<
	T = any,
	Args extends any[] = any[]
> extends BaseMixinTest {
	withInstance(expected: InterfaceShape) {
		return new InterfaceTest<T, Args>(expected).withClass(
			this.mixinInstance.toClass() as new (...args: Args) => T
		)
	}
}
