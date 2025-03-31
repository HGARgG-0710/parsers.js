import { ArrayCollection } from "../../../Collection/classes.js"

export abstract class TypicalBuffer<Type = any> extends ArrayCollection<Type> {
	reverse() {
		this.value.reverse()
		return this
	}

	read(i: number) {
		return this.value[i]
	}

	write(i: number, value: Type) {
		this.value[i] = value
		return this
	}
}
