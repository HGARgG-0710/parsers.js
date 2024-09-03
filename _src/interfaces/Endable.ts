import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isBoolean } = type

export interface Endable extends Summat {
	isEnd: boolean
}

export const isEndable = structCheck<Endable>({ isEnd: isBoolean })
