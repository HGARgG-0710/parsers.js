import { isNumber } from "@hgargg-0710/one/dist/src/typeof/typeof.js"
import type { EnumSpace } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isEnumSpace = structCheck<EnumSpace>({
	add: isFunction,
	join: isFunction,
	copy: isFunction,
	map: isFunction,
	size: isNumber
})
