import type { Summat } from "@hgargg-0710/summat.ts"
import { object } from "@hgargg-0710/one"
const { structCheck } = object

export interface Currable<Type = any> extends Summat {
	curr: Type
}

export const isCurrable = structCheck<Currable>(["curr"])
