import type {
	ConstEnumSpace,
	IncrementEnum
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
		add: constEnumAdd,
		join: constEnumJoin,
		copy: constEnumCopy,
		map: constEnumMap,
		size
	}
	result.add(size)
	return result
}
