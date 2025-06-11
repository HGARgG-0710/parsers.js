import { array, number, type } from "@hgargg-0710/one"
import assert from "assert"
import { InitMixin } from "./MixinArray.js"

const { copy } = array
const { min } = number
const { isNumber } = type

export class RotationBuffer<T = any> extends InitMixin<T> {
	private ["constructor"]: new (n?: number) => this

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

	private prepareForInit() {
		this.resetBounds()
		this.signalNonEmptiness()
	}

	private resetBounds() {
		this.resetStart()
		this.resetLastInd()
	}

	private resetStart() {
		this.rotation = 0
	}

	private resetLastInd() {
		this.lastInd = this.maxPos()
	}

	private renewElements() {
		this.resetStart()
		this.unsetLastInd()
		this.signalEmptiness()
	}

	private signalNonEmptiness() {
		this.isEmpty = false
	}

	private unsetLastInd() {
		this.lastInd = -1
	}

	private signalEmptiness() {
		this.isEmpty = true
	}

	private freeSpace() {
		return this.maxSize - this.size
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
			this.shiftRight(rightSize)
			this.fill(rightSize, left)
			this.resetBounds()
		}
	}

	private shiftRight(rightSize: number) {
		for (let i = 0; i < rightSize; ++i)
			this.items[i] = this.items[i + rightSize]
	}

	private fill(from: number, items: T[]) {
		for (let i = from; i < this.maxSize; ++i) this.items[i] = items[i]
	}

	//
	// * Inherited Methods:
	//

	get size() {
		if (this.isEmpty) return 0
		const baseSize = this.lastInd - this.rotation
		return baseSize <= 0 ? baseSize + this.maxSize : baseSize
	}

	write(i: number, item: T) {
		return super.write(this.shifted(i), item)
	}

	read(i: number) {
		return super.read(this.shifted(i))
	}

	push(...items: T[]) {
		this.extendSize(items.length)
		const writeAfter = this.size
		for (let i = 0; i < items.length; ++i)
			this.write(writeAfter + i, items[i])
		if (this.isEmpty) this.isEmpty = false
		return this
	}

	init(items: T[]) {
		this.prepareForInit()
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

	clear() {
		this.resetBounds()
		this.signalEmptiness()
	}

	first() {
		return this.read(0)
	}

	last() {
		return this.read(this.lastInd)
	}

	forward(n: number = 1) {
		this.rotation = this.shifted(n)
	}

	backward() {
		if (this.isFull()) this.renewElements()
		else this.rotation = this.shifted(this.maxPos())
		return this.isEmpty
	}

	constructor(maxSize: number) {
		assert(isNumber(maxSize))
		assert(maxSize > 0)
		super(new Array(maxSize))
	}
}
