import type { Summat } from "@hgargg-0710/summat.ts"
import type { Stateful } from "./interfaces.js"

export function Stateful(thing: Summat, state: object): Stateful {
	thing.state = state
	return thing as Stateful
}
