import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Finishable<Type = any> extends Summat {
	finish(): Type
}

export const isFinishable = structCheck<Finishable>({ finish: isFunction })
