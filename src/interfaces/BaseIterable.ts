import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export type BaseIterable<Type = any> = BaseNextable<Type> | BasePrevable<Type>

export interface BaseNextable<Type = any> extends Summat {
	baseNext(): Type
}

export interface BasePrevable<Type = any> extends Summat {
	basePrev(): Type
}

export const isBaseNextable = structCheck<Nextable>({ baseNext: isFunction })
export const isBasePrevable = structCheck<Prevable>({ basePrev: isFunction })

export interface Nextable<Type = any> extends Summat {
	next(): Type
}

export interface Prevable<Type = any> extends Summat {
	prev(): Type
}

export const isNextable = structCheck<Nextable>({ next: isFunction })
export const isPrevable = structCheck<Prevable>({ prev: isFunction })
