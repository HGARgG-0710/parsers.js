import type { Summat } from "main.js"
export type Indexed<Type = any> =
	| string
	| (Summat & {
			[x: number]: Type
			length: number
	  })
