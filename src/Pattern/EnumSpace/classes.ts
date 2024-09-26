import { SimpleTokenType, TokenInstance } from "../Token/classes.js"
import type {
	ConstEnumSpace,
	EnumSpace,
	IncrementEnum as IncrementEnumType,
	Mappable
} from "./interfaces.js"

import {
	constEnumAdd,
	constEnumCopy,
	constEnumJoin,
	constEnumMap,
	incrementEnumAdd,
	incrementEnumCopy,
	incrementEnumJoin,
	incrementEnumMap
} from "./methods.js"

export class IncrementEnum implements IncrementEnumType {
	size: number

	add: (n: number) => IncrementEnumType
	join: (enums: EnumSpace) => EnumSpace<number>
	copy: () => IncrementEnumType
	map: () => number[]

	constructor(size: number) {
		this.size = size
	}
}

Object.defineProperties(IncrementEnum.prototype, {
	add: { value: incrementEnumAdd },
	join: { value: incrementEnumJoin },
	copy: { value: incrementEnumCopy },
	map: { value: incrementEnumMap }
})

export class ConstEnum implements ConstEnumSpace {
	size: number
	value: {}[]

	add: (n: number) => ConstEnumSpace
	join: (enums: EnumSpace) => EnumSpace<{}>
	copy: () => EnumSpace<{}>
	map: (f: Mappable<{}>) => {}[]

	constructor(size: number) {
		this.value = []
		this.size = size
		this.add(size)
	}
}

Object.defineProperties(ConstEnum.prototype, {
	add: { value: constEnumAdd },
	join: { value: constEnumJoin },
	copy: { value: constEnumCopy },
	map: { value: constEnumMap }
})

export const TokenInstanceEnum = (enums: EnumSpace) =>
	enums.map((x) => {
		const cachedClass = TokenInstance(x)
		return () => new cachedClass()
	})

export const SimpleTokenTypeEnum = (enums: EnumSpace) =>
	enums.map((x) => {
		const cachedClass = SimpleTokenType(x)
		return (y: any) => new cachedClass(y)
	})
