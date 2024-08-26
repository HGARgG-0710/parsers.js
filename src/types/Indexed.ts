import type { Summat } from "./Summat.js"
export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })
