import { classWrapper } from "src/utils.js"
import { SimpleTokenType, TokenInstance } from "../Token/classes.js"
import type { ConstEnumSpace, EnumSpace, Mappable } from "./interfaces.js"

import { constEnumAdd, constEnumCopy, constEnumJoin, constEnumMap } from "./methods.js"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

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

const composeTokenInstance = trivialCompose(classWrapper, TokenInstance)
const composeTokenType = trivialCompose(classWrapper, SimpleTokenType)

export const [TokenInstanceEnum, SimpleTokenTypeEnum] = [
	composeTokenInstance,
	composeTokenType
].map((f) => (enums: EnumSpace) => enums.map(f))
