import type { MultiIndex } from "../interfaces.js"
import type { MultiIndexModifier } from "./interfaces.js"

import { array } from "@hgargg-0710/one"
const { clear } = array

export function multiIndexModifierNextLevel(this: MultiIndexModifier) {
	this.multind.value.push(0)
	return [0]
}

export function multiIndexModifierResize(this: MultiIndexModifier, length: number = 0) {
	this.multind.levels = length
	return this.multind
}

export function multiIndexModifierClear(this: MultiIndexModifier) {
	clear(this.multind.value)
	return this.multind
}

export function multiIndexModifierIncLast(this: MultiIndexModifier) {
	return ++this.multind.value[this.multind.levels - 1]
}

export function multiIndexModifierDecLast(this: MultiIndexModifier) {
	return --this.multind.value[this.multind.levels - 1]
}

export function multiIndexModifierExtend(this: MultiIndexModifier, subIndex: number[]) {
	return this.multind.value.push(...subIndex)
}

export function multiIndexModifierPrevLevel(this: MultiIndexModifier): number[] {
	return [this.multind.value.pop() as number]
}

export function multiIndexModifierInitialize(
	this: MultiIndexModifier,
	multind: MultiIndex
) {
	this.multind = multind
	return this
}
