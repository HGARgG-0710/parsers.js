import { array, inplace } from "@hgargg-0710/one"
import type { IInitializable } from "../interfaces.js"
import type { IArray } from "../interfaces/Array.js"
import {
	isSwitch,
	RecursiveRenewer,
	wrapSwitch,
	type IRecursiveItems,
	type IRecursiveListIdentifiable,
	type IRecursivelySwitchable,
	type ISwitchIdentifiable
} from "./RecursiveInitList.js"

const { first, clear } = array
const { insert, mutate, out } = inplace

function maybeDeSwitch<
	T extends IInitializable & ISwitchIdentifiable = any,
	Recursive extends IRecursiveListIdentifiable & ISwitchIdentifiable = any
>(raw: IRecursivelySwitchable<T, Recursive>) {
	return isSwitch(raw) ? raw.recursive : raw
}

export class SwitchArray<
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> implements IInitializable, IArray<T | Recursive>
{
	private _items: IRecursiveItems<T, Recursive>

	private set items(newItems: IRecursiveItems<T, Recursive>) {
		this._items = newItems
	}

	get items() {
		return this._items
	}

	get size() {
		return this.items.length
	}

	private maybeWrapSwitchMult(items: (T | Recursive)[]) {
		return mutate(items, this.maybeWrapSwitch.bind(this))
	}

	private isRecursive(item: T | Recursive) {
		return this.renewer.isRecursive(item)
	}

	private baseWrite(i: number, value: IRecursivelySwitchable<T, Recursive>) {
		this.items[i] = value
	}

	private maybeWrapSwitch(r: T | Recursive) {
		return this.renewer.maybeWrapSwitch(r)
	}

	*[Symbol.iterator]() {
		for (let i = this.size; i--; ) yield this.items[i]
	}

	raw() {
		const collected: (T | Recursive)[] = new Array(this.size)
		this.each((x, i: number) => (collected[i] = x))
		return collected
	}

	init(items: IRecursiveItems<T, Recursive>) {
		this.items = items
		return this
	}

	write(i: number, value: T | Recursive) {
		const currItem = this.read(i)
		if (!this.isRecursive(value)) this.baseWrite(i, value)
		else if (isSwitch(currItem)) currItem.init(value)
		else this.baseWrite(i, wrapSwitch(value))
		return this
	}

	read(i: number) {
		return maybeDeSwitch(this.items[i])
	}

	push(...items: (T | Recursive)[]) {
		this.items.push(...this.maybeWrapSwitchMult(items))
		return this
	}

	pop(count = 1) {
		this.items.length -= count
		return this
	}

	insert(i: number, ...values: (T | Recursive)[]) {
		insert(this.items, i, ...this.maybeWrapSwitchMult(values))
		return this
	}

	remove(i: number, count = 1) {
		out(this.items, i, count)
		return this
	}

	shift(count = 1) {
		this.items = this.items.slice(count)
		return this
	}

	unshift(...values: (T | Recursive)[]) {
		this.items.unshift(...this.maybeWrapSwitchMult(values))
		return this
	}

	each(callback: (x: T | Recursive, i?: number) => void) {
		for (let i = this.size; i--; ) callback(this.read(i), i)
		return this
	}

	clear() {
		clear(this.items)
		return this
	}

	fill(newItems: (T | Recursive)[]) {
		this.clear()
		this.items = this.maybeWrapSwitchMult(newItems)
		return this
	}

	first() {
		return first(this.items)
	}

	constructor(private readonly renewer: RecursiveRenewer<T, Recursive>) {}
}
