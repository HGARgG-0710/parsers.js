import type { MultiIndex } from "../interfaces.js"
import type { MultiIndexModifier } from "./interfaces.js"

import { setValue } from "src/Pattern/utils.js"

import { array } from "@hgargg-0710/one"
const { clear } = array

export function multiIndexModifierNextLevel(this: MultiIndexModifier) {
	this.value.value.push(0)
	return [0]
}

export function multiIndexModifierResize(this: MultiIndexModifier, length: number = 0) {
	this.value.levels = length
	return this.value
}

export function multiIndexModifierClear(this: MultiIndexModifier) {
	clear(this.value.value)
	return this.value
}

export function multiIndexModifierIncLast(this: MultiIndexModifier) {
	return ++this.value.value[this.value.levels - 1]
}

export function multiIndexModifierDecLast(this: MultiIndexModifier) {
	return --this.value.value[this.value.levels - 1]
}

export function multiIndexModifierExtend(this: MultiIndexModifier, subIndex: number[]) {
	return this.value.value.push(...subIndex)
}

export function multiIndexModifierPrevLevel(this: MultiIndexModifier): number[] {
	return [this.value.value.pop() as number]
}

export function multiIndexModifierInitialize(
	this: MultiIndexModifier,
	multind: MultiIndex
) {
	setValue(this, multind)
	return this
}
