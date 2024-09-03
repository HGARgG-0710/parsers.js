import type { Summat } from "@hgargg-0710/summat.ts"
import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export type BoundCheckable = IsEndCurrable | IsStartCurrable

export interface IsEndCurrable extends Summat {
	isCurrEnd: () => boolean
}
export interface IsStartCurrable extends Summat {
	isCurrStart: () => boolean
}

export const hasIsCurrEnd = structCheck<IsEndCurrable>({ isCurrEnd: isFunction })
export const hasIsCurrStart = structCheck<IsStartCurrable>({ isCurrStart: isFunction })
