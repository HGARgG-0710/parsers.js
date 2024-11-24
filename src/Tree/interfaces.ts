import type { Summat } from "@hgargg-0710/summat.ts"

export type InTreeType<Type = any> = Type | Tree<Type>

export interface Tree<Type = any> extends Summat {
	lastChild: number
	index: (multindex: number[]) => InTreeType<Type>
}

export type * as TreeWalker from "./TreeWalker/interfaces.js"
