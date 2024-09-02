import type { Summat } from "@hgargg-0710/summat.ts"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Copiable<Type = any> extends Summat {
	copy(): Type
}

export const isCopiable = structCheck<Copiable>({ copy: isFunction })
