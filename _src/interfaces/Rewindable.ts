import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Rewindable<Type = any> extends Summat {
	rewind(): Type
}

export const isRewindable = structCheck<Rewindable>({ rewind: isFunction })
