import { ArrayCollection } from "../../classes/ArrayCollection.js"

export abstract class TypicalBuffer<Type = any> extends ArrayCollection<Type> {
	read(i: number) {
		return this.items[i]
	}

	write(i: number, value: Type) {
		this.items[i] = value
		return this
	}
}
