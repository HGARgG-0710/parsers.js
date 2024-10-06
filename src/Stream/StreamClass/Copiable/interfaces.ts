import type { Summat } from "@hgargg-0710/summat.ts"

export interface Copiable<Type = any> extends Summat {
	copy: () => Type
}
