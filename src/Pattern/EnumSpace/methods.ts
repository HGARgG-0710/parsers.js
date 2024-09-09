import { ConstEnum, IncrementEnum as IncrementEnumConstructor } from "./classes.js"
import type { ConstEnumSpace, EnumSpace, IncrementEnum, Mappable } from "./interfaces.js"

export function constEnumAdd(this: ConstEnumSpace, size: number) {
	this.value.push(...Array.from({ length: size }, () => ({})))
	return this
}

export function constEnumJoin(this: ConstEnumSpace, enums: EnumSpace) {
	this.value.push(...enums.value)
	return this
}

export function constEnumCopy(this: ConstEnumSpace) {
	return ConstEnum(this.value.length)
}

export function constEnumMap(this: ConstEnumSpace, mapped: Mappable<{}>) {
	return this.value.map(mapped)
}

export function incrementEnumAdd(this: IncrementEnum, size: number) {
	this.size += size
	return this
}

export function incrementEnumJoin(this: IncrementEnum, enums: EnumSpace) {
	this.size += enums.size
	return this
}

export function incrementEnumCopy(this: IncrementEnum) {
	return IncrementEnumConstructor(this.size)
}

export function incrementEnumMap(this: IncrementEnum, mapped: Mappable<number>) {
	const final: unknown[] = []
	for (let i = 0; i < this.size; ++i) final.push(mapped(i, i))
	return final
}
