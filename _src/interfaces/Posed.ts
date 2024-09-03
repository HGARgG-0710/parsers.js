import type { Summat } from "@hgargg-0710/summat.ts"
import { object } from "@hgargg-0710/one"
const { structCheck } = object

export interface Posed<Type = any> extends Summat {
	pos: Type
}

export const isPosed = structCheck<Posed>(["pos"])
