import { IndexPointer } from "../classes/IndexPointer.js"
import { array, inplace } from "@hgargg-0710/one"

const { insert, out, swap } = inplace
const { numbers } = array

export class PointerArray {
	private pointers: IndexPointer[]

	get size() {
		return this.pointers.length
	}

	private repair() {
		let i = this.size
		while (i--) this.pointers[i].set(i)
	}

	insert(position: number, count: number) {
		for (let i = position; i < this.size; ++i)
			this.pointers[i].set(count + i)

		insert(
			this.pointers,
			position,
			...numbers(count).map((x) => new IndexPointer(x))
		)
	}

	remove(position: number, count: number) {
		for (let i = position + count; i < this.size; ++i)
			this.pointers[i].set(i - count)

		out(this.pointers, position, count)
	}

	reverse() {
		this.pointers.reverse()
		this.repair()
	}

	filterIndexes(indexes: number[]) {
		const indexSet = new Set(indexes)
		this.pointers = this.pointers.filter((x, i) => {
			if (indexSet.has(i)) return true
			x.invalidate()
		})
		this.repair()
	}

	swap(i: number, j: number) {
		this.pointers[i].swap(this.pointers[j])
		swap(this.pointers, i, j)
	}

	getPointer(index: number) {
		return this.pointers[index]
	}

	constructor(length: number) {
		this.pointers = Array.from({ length }, (_x, i) => new IndexPointer(i))
	}
}
