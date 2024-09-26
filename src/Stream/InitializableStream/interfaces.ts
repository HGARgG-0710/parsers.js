import type { Summat } from "@hgargg-0710/summat.ts"

export interface Initializable<Type = any> extends Summat {
	init(...x: any[]): Type
}