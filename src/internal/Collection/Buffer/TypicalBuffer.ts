import { ArrayCollection } from "../../../Collection/classes.js"

export abstract class TypicalBuffer<Type = any> extends ArrayCollection<Type> {
	read(i: number) {
		return this.value[i]
	}

	write(i: number, value: Type) {
		this.value[i] = value
		return this
	}
}
