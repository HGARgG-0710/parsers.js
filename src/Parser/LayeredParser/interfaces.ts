import type { SummatFunction } from "@hgargg-0710/summat.ts";


export interface LayeredParser extends SummatFunction {
	layers: Function[]
	parser: Function
}
