import type { Summat } from "@hgargg-0710/summat.ts"
import type { Inputted } from "./interfaces.js"

export function Inputted<Type = any>(x: Summat, input: Type): Inputted<Type> {
	x.input = input
	return x as Inputted<Type>
}
