import { array, number, type } from "@hgargg-0710/one"
import assert from "assert"
import { TypicalBuffer } from "./TypicalBuffer.js"

const { copy } = array
const { min } = number
const { isNumber } = type

export class RotationBuffer<Type = any> extends TypicalBuffer<Type> {
	["constructor"]: new (n?: number) => this

	// * first-read index
	private rotation: number = 0

	// * last-read index
	private lastInd: number = -1

	private isEmpty: boolean = true

	private set maxSize(newSize: number) {
		this.items.length = newSize
	}

	private get maxSize() {
		return this.items.length
	}

	private maxPos() {
		return this.maxSize - 1
	}

	private resetStart() {
		this.rotation = 0
	}

	private renewElements() {
		this.resetStart()
		this.lastInd = -1
		this.isEmpty = true
	}

	private freeSpace() {
		return this.isEmpty ? this.maxSize : this.maxSize - this.size
	}

	private isFull() {
		return this.freeSpace() === 0
	}

	private wrapped(n: number) {
		return n % this.maxSize
	}

	private shifted(i: number) {
		return this.wrapped(i + this.rotation)
	}

	private endShift(i: number) {
		return this.wrapped(i + this.lastInd)
	}

	private extendSize(n: number) {
		this.allocSpace(n - this.moveEnd(n))
	}

	private moveEnd(n: number) {
		const lastIncrease = min(this.freeSpace(), n)
		this.lastInd = this.endShift(lastIncrease)
		return lastIncrease
	}

	private allocSpace(space: number) {
		if (space > 0) {
			this.reOrder()
			this.maxSize += space
		}
	}

	private reOrder() {
		if (this.rotation > 0 && !this.isEmpty) {
			const left = this.items.slice(0, this.rotation + 1)
			const rightSize = this.maxSize - this.rotation

			for (let i = 0; i < rightSize; ++i)
				this.items[i] = this.items[i + rightSize]

			for (let i = rightSize; i < this.maxSize; ++i)
				this.items[i] = left[i]

			this.resetStart()
			this.lastInd = this.maxPos()
		}
	}

	//
	// * Inherited Methods:
	//

	get size() {
		if (this.isEmpty) return 0
		const baseSize = this.lastInd - this.rotation
		return baseSize <= 0 ? baseSize + this.maxSize : baseSize
	}

	write(i: number, item: Type) {
		return super.write(this.shifted(i), item)
	}

	read(i: number) {
		return super.read(this.shifted(i))
	}

	push(...items: Type[]) {
		this.extendSize(items.length)
		const writeAfter = this.size
		for (let i = 0; i < items.length; ++i)
			this.write(writeAfter + i, items[i])
		if (this.isEmpty) this.isEmpty = false
		return this
	}

	init(items: Type[]) {
		return super.init(
			items.length > this.maxSize ? items.slice(0, this.maxSize) : items
		)
	}

	copy() {
		return new this.constructor(this.maxSize).init(copy(this.items))
	}

	//
	// * Non-Interface Methods:
	//

	last() {
		return this.read(this.lastInd)
	}

	forward(n: number = 1) {
		this.rotation = this.shifted(n)
	}

	backward() {
		if (this.isFull()) this.renewElements()
		else this.rotation = this.shifted(this.maxPos())
	}

	constructor(maxSize: number) {
		assert(isNumber(maxSize))
		assert(maxSize > 0)
		super(new Array(maxSize))
	}
}
