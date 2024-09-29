import type { Summat } from "@hgargg-0710/summat.ts"
import type { Position } from "../PositionalStream/Position/interfaces.js"

export interface Navigable<Type = any> extends Summat {
	navigate: (position: Position) => Type
}
