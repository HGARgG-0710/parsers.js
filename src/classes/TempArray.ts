import { number } from "@hgargg-0710/one"
import { MixinArray } from "../internal/MixinArray.js"

const { min } = number

export class TempArray<Type = any> extends MixinArray<Type> {
	["constructor"]: new (n?: number) => this

	private realSize: number = 0

	private get allocSize() {
		return super.size
	}

	private freeSpace() {
		return this.allocSize - this.realSize
	}

	private pushFree(...x: Type[]) {
		const totalIncrease = x.length
		const fastIncrease = min(this.freeSpace(), totalIncrease)
		for (let i = 0; i < fastIncrease; ++i) this.write(i, x[i])
		return [fastIncrease, totalIncrease]
	}

	private rawPush(...x: Type[]) {
		super.push(...x)
	}

	private condAlloc(newItems: number) {
		if (newItems > 0) this.items.length += newItems
	}

	get size() {
		return this.realSize
	}

	copy() {
		return new this.constructor(this.size)
	}

	push(...x: Type[]): this {
		this.rawPush(...x.slice(...this.pushFree(...x)))
		this.realSize += x.length
		return this
	}

	write(i: number, value: Type): this {
		if (i > this.realSize) this.realSize = i + 1
		return super.write(i, value)
	}

	init(newSize: number) {
		this.realSize = 0
		this.condAlloc(newSize - this.size)
		return this
	}

	constructor(allocSize: number = 0) {
		super(new Array(allocSize))
	}
}
