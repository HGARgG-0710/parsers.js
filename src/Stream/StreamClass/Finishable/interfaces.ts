import type { Summat } from "@hgargg-0710/summat.ts"

export interface Finishable<Type = any> extends Summat {
	finish: () => Type
}
