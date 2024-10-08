import { typeof as type } from "@hgargg-0710/one"
const { isSymbol } = type

import type { Indexed } from "../../../interfaces.js"

// ! Place [refactor] into the 'proxy-op' library LATER!

export const slicerMethods = new Map<string | symbol, Function>([
	[Symbol.iterator, slicerIterator],
	["reduce", slicerReduce],
	["reSlice", reSlice]
])
export const slicerProperties = new Map<string | symbol, Function>([
	["length", slicerLength]
])

export function slicedGet(indexed: Indexed & object, p: string | symbol) {
	if (isSymbol(p) || Number.isNaN(Number(p))) {
		if (slicerMethods.has(p))
			return (...args: any[]) =>
				(slicerMethods.get(p) as Function).apply(indexed, args)
		if (slicerProperties.has(p)) return (slicerProperties.get(p) as Function)(indexed)
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

export function slicerLength(this: Indexed & object) {
	return this.to - this.from
}
