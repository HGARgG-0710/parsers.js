import { ArrayCollection } from "../../../classes/ArrayCollection.js"

export abstract class TypicalBuffer<Type = any> extends ArrayCollection<Type> {
	read(i: number) {
		return this.collection[i]
	}

	write(i: number, value: Type) {
		this.collection[i] = value
		return this
	}
}
