import type { Summat } from "@hgargg-0710/summat.ts"
import type { MultiIndex } from "../interfaces.js"

export interface MultiIndexModifier extends Summat {
	multind: MultiIndex
	nextLevel(): number[]
	prevLevel(): number[]
	resize(length: number): MultiIndex
	clear(): MultiIndex
	incLast(): number
	decLast(): number
	extend(subIndex: number[]): void
}
