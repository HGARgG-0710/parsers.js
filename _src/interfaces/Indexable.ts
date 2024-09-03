import type { Summat } from "@hgargg-0710/summat.ts"
import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Indexable<OutType = any> extends Summat {
	index(x: any): OutType
}

export const isIndexable = structCheck<Indexable>({ index: isFunction })
