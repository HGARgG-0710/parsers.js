import { TokenInstance } from "../Token/classes.js"
import type { ConstEnumSpace, EnumSpace, IncrementEnum } from "./interfaces.js"

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

export function IncrementEnum(size: number): IncrementEnum {
	return {
		size,
		add: incrementEnumAdd,
		join: incrementEnumJoin,
		copy: incrementEnumCopy,
		map: incrementEnumMap
	}
}

export function ConstEnum(size: number): ConstEnumSpace {
	const result: ConstEnumSpace = {
		value: [],
		size,
		add: constEnumAdd,
		join: constEnumJoin,
		copy: constEnumCopy,
		map: constEnumMap
	}
	result.add(size)
	return result
}

export const CachedTokenEnum = (enums: EnumSpace) =>
	enums.map((x) => TokenInstance(x, true))
