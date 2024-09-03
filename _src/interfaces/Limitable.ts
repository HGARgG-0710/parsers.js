import type { Summat } from "@hgargg-0710/summat.ts"
import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Limitable<Type = any, LimitType = any> extends Summat {
	limit(limitPositions: LimitType): Type
}

export const isLimitable = structCheck<Limitable>({ limit: isFunction })
