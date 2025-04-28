import { type } from "@hgargg-0710/one"
import assert from "assert"
import { TypicalBuffer } from "./TypicalBuffer.js"
import type { ISequence } from "../../interfaces.js"

const { isNumber } = type

// TODO: THINK about which methods should this thing actually include; 
// ! remove the `implements` IF it's not necessary here...; 
export class RotationBuffer<Type = any>
	extends TypicalBuffer<Type>
	implements ISequence<Type>
{
	["constructor"]: new (n?: number) => this

	// * first-read index
	private rotation: number = 0

	// * last-read index
	private lastInd: number = 0

	private shifted(i: number) {
		return (i + this.rotation) % this.maxSize
	}

	//
	// * Interface Methods:
	//

	get size() {
		const baseSize = this.lastInd - this.rotation
		return baseSize < 0 ? baseSize + this.maxSize : baseSize
	}

	write(i: number, item: Type) {
		return super.write(this.shifted(i), item)
	}

	read(i: number) {
		return super.read(this.shifted(i))
	}

	push(...items: Type[]) {
		const offset = this.maxSize - items.length
		let i = this.rotation
		for (let j = 0; j < items.length; ++j) this.write(offset + j, items[j])
		this.lastInd = (this.lastInd + (i - this.rotation)) % this.maxSize
		return this
	}

	init(value: Type[]) {
		return super.init(
			value.length > this.maxSize ? value.slice(0, this.maxSize) : value
		)
	}

	copy() {
		return this.emptied().init(this.collection)
	}

	emptied() {
		return new this.constructor(this.maxSize)
	}

	get() {
		return [...this]
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.maxSize; ++i) yield this.read(i)
	}

	//
	// * Non-Interface Methods:
	//

	renew(value: Type) {
		this.lastInd = this.rotation
		this.push(value)
	}

	last() {
		return this.read(this.lastInd)
	}

	forward() {
		this.rotation = this.shifted(1)
	}

	backward() {
		const backshift = this.maxSize - 1 // '+ this.maxSize' is to keep `.rotation` positive
		this.rotation = (this.rotation + backshift) % this.maxSize
	}

	isEmpty() {
		return this.size === 0
	}

	isFull() {
		return this.size === this.maxSize
	}

	constructor(private readonly maxSize = Infinity) {
		assert(isNumber(maxSize))
		super(new Array(maxSize === Infinity ? 0 : maxSize))
	}
}
