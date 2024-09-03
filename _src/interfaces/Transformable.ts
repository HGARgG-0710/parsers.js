import type { Summat } from "@hgargg-0710/summat.ts"
import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface Transformable<InType = any, OutType = any> extends Summat {
	transform(f: InType): OutType
}

export const isTransformable = structCheck<Transformable>({ transform: isFunction })
