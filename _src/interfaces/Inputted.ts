import type { Summat } from "@hgargg-0710/summat.ts"
import { object } from "@hgargg-0710/one"
const { structCheck } = object

export interface Inputted<Type = any> extends Summat {
	input: Type
}

export const isInputted = structCheck<Inputted>(["input"])
