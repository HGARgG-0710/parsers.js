import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import {
	mixin,
	type IMixinShape,
	type INonVoidConstructor
} from "../../../../dist/main.js"

const { propertyDescriptors } = object

export class MixinTest<T = any, Args extends any[] = any[]> {
	private readonly mixinInstance: mixin<T, Args>
	private readonly mixinName: string
	private readonly origConstructor: INonVoidConstructor<T, Args>

	toClass(expectedPrototypeDescriptors: PropertyDescriptorMap) {
		const mixinClass = this.mixinInstance.toClass()
		const mixinPrototypeDescriptors = propertyDescriptors(
			mixinClass.prototype
		)

		assert(
			object.recursiveSame(
				expectedPrototypeDescriptors,
				mixinPrototypeDescriptors
			)
		)

		assert.strictEqual(mixinClass, this.origConstructor)
		assert.strictEqual(this.mixinName, mixinClass.name)
		assert.strictEqual(this.mixinName, this.mixinInstance.name)
	}

	constructor(mixinShape: IMixinShape<T, Args>) {
		this.origConstructor = mixinShape.constructor as INonVoidConstructor<
			T,
			Args
		>
		this.mixinName = mixinShape.name
		this.mixinInstance = new mixin(mixinShape)
	}
}
