import type { IIndexed } from "../../../interfaces.js";
import { IterableCollection } from "../IterableCollection.js";


export abstract class TypicalUnfreezable<Type = any> extends IterableCollection<Type> {
	isFrozen = false;

	["constructor"]: new (value?: IIndexed<Type>) => typeof this

	unfreeze() {
		this.isFrozen = false
		return this
	}

	freeze() {
		this.isFrozen = true
		return this
	}

	read(i: number) {
		return this.collection![i] as Type
	}

	copy() {
		return new this.constructor(this.collection)
	}

	emptied() {
		return new this.constructor()
	}
}
