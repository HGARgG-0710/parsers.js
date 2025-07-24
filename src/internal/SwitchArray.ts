import { array, inplace } from "@hgargg-0710/one"
import { Initializable } from "../classes/Initializer.js"
import type { IArray } from "../interfaces/Array.js"
import type { ISwitchIdentifiable, ITerminal } from "./RecursiveList.js"
import {
	isSwitch,
	itemsInitializer,
	maybeDeSwitch,
	RecursiveRenewer,
	renewerInitializer,
	wrapSwitch,
	type IRecursiveItems,
	type IRecursivelySwitchable
} from "./RecursiveList.js"

const { first, clear } = array
const { insert, mutate, out } = inplace

const switchArrayInitializer = {
	init(target: SwitchArray, items?: any[], renewer?: RecursiveRenewer) {
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

/**
 * This is a class that encapsulates the `IRecursiveItems`
 * of the `RecursiveList`, and which is used by the user
 * via the `IStreamArray` whenever modifying the internal
 * structure of a `DynamicParser`.
 */
export class SwitchArray<
		T extends ITerminal<Recursive> = any,
		Recursive extends ISwitchIdentifiable = any
	>
	extends Initializable<
		[IRecursiveItems<T, Recursive>, RecursiveRenewer<T, Recursive>]
	>
	implements IArray<T | Recursive>
{
	private _items: IRecursiveItems<T, Recursive>
	private renewer: RecursiveRenewer<T, Recursive>

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

	private baseWrite(i: number, value: IRecursivelySwitchable<T, Recursive>) {
		this.items[i] = value
	}

	private maybeWrapSwitch(r: T | Recursive) {
		return this.renewer.maybeWrapSwitch(r)
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive>) {
		this.renewer = renewer
	}

	setItems(items: IRecursiveItems<T, Recursive>) {
		this.items = items
	}

	protected get initializer() {
		return switchArrayInitializer
	}

	write(i: number, value: T | Recursive) {
		const currItem = this.items[i]
		if (!this.renewer.isRecursive(value)) this.baseWrite(i, value)
		else if (isSwitch(currItem)) currItem.init(value)
		else this.baseWrite(i, wrapSwitch(value))
		return this
	}

	get(i: number) {
		return this.items[i]
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

	*[Symbol.iterator]() {
		for (let i = this.size; i--; ) yield this.items[i]
	}

	constructor(
		items?: IRecursiveItems<T, Recursive>,
		renewer?: RecursiveRenewer<T, Recursive>
	) {
		super()
		this.init(items, renewer)
	}
}
