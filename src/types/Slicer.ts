import { isSymbol } from "src/misc.js"
import type { Indexed } from "./Indexed.js"

// ^ IDEA: create a library 'proxy-op' SPECIFICALLY for proxy-related optimizations of common data-structures/algorithms that involve copying;
export const slicerMap = new Map<string | symbol, Function>([
	[Symbol.iterator, slicerIterator],
	["reduce", slicerReduce],
	["reSlice", reSlice]
])
export function slicedGet(indexed: Indexed & object, p: string | symbol) {
	if (isSymbol(p) || isNaN(p as unknown as number)) {
		if (slicerMap.has(p))
			return (...args: any[]) => slicerMap.get(p).apply(indexed, args)
		return Reflect.get(indexed, p)
	}
	const index = Number(p) + indexed.from
	return index < indexed.to ? indexed[index] : undefined
}
export function reSlice(this: Indexed & object, from?: number, to?: number) {
	this.from = from
	if (to) this.to = to
}
export function* slicerIterator(this: Indexed & object) {
	for (let i = this.from; i < this.to; ++i) yield this[i]
}
export function slicerReduce(this: Indexed & object, reducer: Function, init: any) {
	let result = init
	for (let i = this.from; i < this.to; ++i)
		result = reducer(result, this[i], i - this.from)
	return result
}

export type Slicer<T extends Indexed & object> = T & {
	reSlice(from?: number, to?: number): void
}

export function Slicer<T extends Indexed & object>(
	indexed: T,
	from: number = 0,
	to: number = indexed.length
): Slicer<T> {
	const slicer: Slicer<T> = new Proxy<Indexed & object>(indexed, {
		get: slicedGet
	}) as Slicer<T>
	slicer.reSlice(from, to)
	return slicer
}
