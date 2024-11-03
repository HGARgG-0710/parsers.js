import type {
	SimpleTokenType as SimpleTokenTypeType,
	TokenInstanceClass
} from "../Token/interfaces.js"

import { SimpleTokenType, TokenInstance } from "../Token/classes.js"

import type { ConstEnumSpace, EnumSpace, Mappable } from "./interfaces.js"
import { constEnumAdd, constEnumCopy, constEnumJoin, constEnumMap } from "./methods.js"

export class ConstEnum implements ConstEnumSpace {
	size: number
	value: {}[]

	add: (n: number) => ConstEnumSpace
	join: (enums: EnumSpace) => EnumSpace<{}>
	copy: () => EnumSpace<{}>
	map: (f?: Mappable<{}>) => {}[]

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

export const [TokenInstanceEnum, SimpleTokenTypeEnum] = [
	TokenInstance,
	SimpleTokenType
].map((f) => (enums: EnumSpace) => enums.map(f)) as [
	(enums: EnumSpace) => TokenInstanceClass[],
	(enums: EnumSpace) => SimpleTokenTypeType[]
]
