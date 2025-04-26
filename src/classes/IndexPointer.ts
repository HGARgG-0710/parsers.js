import { BadIndex } from "../constants.js"

export class IndexPointer {
	static BadPointer() {
		return new IndexPointer(BadIndex)
	}

	invalidate() {
		this.index = BadIndex
	}

	swap(pointer: IndexPointer) {
		const temp = this.index
		this.index = pointer.index
		pointer.index = temp
	}

	set(newIndex: number) {
		this.index = newIndex
	}

	constructor(public index: number) {}
}
