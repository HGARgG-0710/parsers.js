import { object } from "@hgargg-0710/one"
import assert from "node:assert"
import { mixin, type IMixinShape } from "../../../../dist/main.js"

const { propertyDescriptors } = object

export class MixinTest<T = any, Args extends any[] = any[]> {
	private readonly mixinInstance: mixin<T, Args>
	private readonly origConstructor: (...args: Args) => T | void

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
	}

	constructor(mixinShape: IMixinShape<T, Args>) {
		this.origConstructor = mixinShape.constructor
		this.mixinInstance = new mixin(mixinShape)
	}
}
