import type { Summat } from "@hgargg-0710/summat.ts"
import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Navigable<Type = any, PosType = any> extends Summat {
	navigate(position: PosType): Type
}

export const isNaviable = structCheck<Navigable>({ navigate: isFunction })
