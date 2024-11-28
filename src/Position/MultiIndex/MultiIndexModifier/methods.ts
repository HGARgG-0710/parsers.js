import type { MultiIndex } from "../interfaces.js"
import type { MultiIndexModifier } from "./interfaces.js"

import { setValue } from "../../../Pattern/utils.js"

import { array } from "@hgargg-0710/one"
const { clear } = array

export function multiIndexModifierNextLevel(this: MultiIndexModifier) {
	return this.extend([0])
}

export function multiIndexModifierResize(this: MultiIndexModifier, length: number = 0) {
	this.value!.levels = length
	return this.value
}

export function multiIndexModifierClear(this: MultiIndexModifier) {
	const { value } = this
	clear(value!.value)
	return value
}

export function multiIndexModifierIncLast(this: MultiIndexModifier) {
	const { value, levels } = this.value!
	return ++value[levels - 1]
}

export function multiIndexModifierDecLast(this: MultiIndexModifier) {
	const { value, levels } = this.value!
	return --value[levels - 1]
}

export function multiIndexModifierExtend(this: MultiIndexModifier, subIndex: number[]) {
	this.value!.value.push(...subIndex)
	return subIndex
}

export function multiIndexModifierPrevLevel(this: MultiIndexModifier): number[] {
	return [this.value!.value.pop() as number]
}

export function multiIndexModifierInitialize(
	this: MultiIndexModifier,
	multind?: MultiIndex
) {
	if (multind) setValue(this, multind)
	return this
}
