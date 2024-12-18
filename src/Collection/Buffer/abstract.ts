import { IterableCollection } from "../abstract.js"

import { defaults } from "../../constants.js"
const { isFrozen } = defaults.FreezableBuffer

export abstract class TypicalUnfreezable<Type = any> extends IterableCollection<Type> {
	isFrozen: boolean = isFrozen

	unfreeze() {
		this.isFrozen = false
		return this
	}

	freeze() {
		this.isFrozen = true
		return this
	}

	read(i: number) {
		return this.value[i] as Type
	}

	get size() {
		return this.value.length
	}
}
