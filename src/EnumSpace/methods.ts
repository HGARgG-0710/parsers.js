import type { EnumSpace, Mappable } from "./interfaces.js"
import { ConstEnum } from "./classes.js"

import { function as _f } from "@hgargg-0710/one"
const { id } = _f

export function constEnumAdd(this: ConstEnum, size: number) {
	this.value.push(...Array.from({ length: size }, () => ({})))
	this.size += size
	return this
}

export function constEnumJoin(this: ConstEnum, enums: EnumSpace) {
	this.value.push(...enums.value)
	this.size += enums.size
	return this
}

export function constEnumCopy(this: ConstEnum) {
	return new ConstEnum(this.value.length)
}

export function constEnumMap(this: ConstEnum, mapped: Mappable<{}> = id) {
	return this.value.map(mapped)
}
