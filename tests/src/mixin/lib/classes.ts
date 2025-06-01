import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import {
	mixin,
	type IMixinShape,
	type INonVoidConstructor,
	type IOutClass
} from "../../../../dist/main.js"

const { withoutConstructor } = object.classes
const { propertyDescriptors } = object

abstract class BaseMixinTest<T = any, Args extends any[] = any[]> {
	protected readonly mixinInstance: mixin<T, Args>
	protected readonly mixinName: string

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

	constructor(mixinShape: IMixinShape<T, Args>) {
		this.mixinName = mixinShape.name
		this.mixinInstance = new mixin(mixinShape)
	}
}

abstract class DefaultMixinTest<
	T = any,
	Args extends any[] = any[]
> extends BaseMixinTest<T, Args> {
	protected abstract mixinPrototypeDescriptors(
		x: object
	): PropertyDescriptorMap

	protected testedConditions(
		mixinClass: new (...args: Args) => void | T,
		expectedPrototypeDescriptors: PropertyDescriptorMap
	): void {
		assert(
			object.recursiveSame(
				expectedPrototypeDescriptors,
				this.mixinPrototypeDescriptors(mixinClass.prototype)
			)
		)

		assert.strictEqual(this.mixinName, mixinClass.name)
		assert.strictEqual(this.mixinName, this.mixinInstance.name)
	}
}

export class PureMixinTest<
	T = any,
	Args extends any[] = any
> extends DefaultMixinTest<T, Args> {
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
		assert.strictEqual(String(mixinClass), "function () {}")
	}
}

export class MixinTest<
	T = any,
	Args extends any[] = any[]
> extends DefaultMixinTest<T, Args> {
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
