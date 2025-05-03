import { MixinArray } from "../internal/MixinArray.js"

export class ArrayCollection<Type = any> extends MixinArray<Type> {
	init(items: Type[]) {
		this.items = items
		return this
	}
}
