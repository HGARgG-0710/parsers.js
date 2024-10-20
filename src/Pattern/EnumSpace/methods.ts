import type { ConstEnumSpace, EnumSpace, Mappable } from "./interfaces.js"
import { ConstEnum } from "./classes.js"

const newConst = () => ({})

export function constEnumAdd(this: ConstEnumSpace, size: number) {
	this.value.push(...Array.from({ length: size }, newConst))
	this.size += size
	return this
}

export function constEnumJoin(this: ConstEnumSpace, enums: EnumSpace) {
	this.value.push(...enums.value)
	this.size += enums.size
	return this
}

export function constEnumCopy(this: ConstEnumSpace) {
	return new ConstEnum(this.value.length)
}

export function constEnumMap(this: ConstEnumSpace, mapped: Mappable<{}>) {
	return this.value.map(mapped)
}
