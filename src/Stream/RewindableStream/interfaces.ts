import type { Summat } from "@hgargg-0710/summat.ts"

export interface Rewindable<Type = any> extends Summat {
	rewind: () => Type
}
