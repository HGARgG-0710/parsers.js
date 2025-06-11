import { number } from "@hgargg-0710/one"
import { MixinArray } from "../internal/MixinArray.js"
import type { IClearable, IPushable } from "../interfaces.js"

const { min } = number

export class RetainedArray<T = any>
	extends MixinArray<T>
	implements IPushable, IClearable
{
	private ["constructor"]: new (n?: number) => this

	private realSize: number = 0

	private get allocSize() {
		return super.size
	}

	private freeSpace() {
		return this.allocSize - this.realSize
	}

	private pushFree(...x: T[]) {
		const totalIncrease = x.length
		const fastIncrease = min(this.freeSpace(), totalIncrease)
		for (let i = 0; i < fastIncrease; ++i) this.write(i, x[i])
		return [fastIncrease, totalIncrease]
	}

	private rawPush(...x: T[]) {
		super.push(...x)
	}

	private condAlloc(newItems: number) {
		if (newItems > 0) super.size += newItems
	}

	get size() {
		return this.realSize
	}

	copy() {
		return new this.constructor(this.size)
	}

	push(...x: T[]): this {
		this.rawPush(...x.slice(...this.pushFree(...x)))
		this.realSize += x.length
		return this
	}

	write(i: number, value: T): this {
		if (i > this.realSize) this.realSize = i + 1
		return super.write(i, value)
	}

	clear() {
		this.realSize = 0
	}

	init(newSize: number) {
		this.clear()
		this.condAlloc(newSize - this.size)
		return this
	}

	constructor(allocSize: number = 0) {
		super(new Array(allocSize))
	}
}
