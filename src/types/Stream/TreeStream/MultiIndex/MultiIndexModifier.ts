import type { Summat } from "@hgargg-0710/summat.ts"
import { array } from "@hgargg-0710/one"
const { clear } = array

import type { MultiIndex } from "../MultiIndex.js"

export interface MultiIndexModifier extends Summat {
	multind: MultiIndex
	nextLevel(): number[]
	prevLevel(): number[]
	resize(length: number): MultiIndex
	clear(): MultiIndex
	incLast(): number
	decLast(): number
	extend(subIndex: number[]): void
}
export function multiIndexModifierNextLevel(this: MultiIndexModifier) {
	this.multind.value.push(0)
	return [0]
}

export function multiIndexModifierResize(this: MultiIndexModifier, length: number = 0) {
	this.multind.value.length = length
	return this.multind
}

export function multiIndexModifierClear(this: MultiIndexModifier) {
	clear(this.multind.value)
	return this.multind
}

export function multiIndexModifierIncLast(this: MultiIndexModifier) {
	return ++this.multind.value[this.multind.value.length - 1]
}

export function multiIndexModifierDecLast(this: MultiIndexModifier) {
	return --this.multind.value[this.multind.value.length - 1]
}

export function multiIndexModifierExtend(this: MultiIndexModifier, subIndex: number[]) {
	return this.multind.value.push(...subIndex)
}

export function multiIndexModifierPrevLevel(this: MultiIndexModifier) {
	return [this.multind.value.pop()]
}

export function MultiIndexModifier(multind: MultiIndex): MultiIndexModifier {
	return {
		multind,
		nextLevel: multiIndexModifierNextLevel,
		prevLevel: multiIndexModifierPrevLevel,
		resize: multiIndexModifierResize,
		clear: multiIndexModifierClear,
		incLast: multiIndexModifierIncLast,
		decLast: multiIndexModifierDecLast,
		extend: multiIndexModifierExtend
	}
}
