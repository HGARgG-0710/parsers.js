import type { Summat } from "@hgargg-0710/summat.ts"

export type InTreeType<Type = any> = Type | Tree<Type>
export type InMultTreeType<Type = any> = Type | MultChildrenTree<Type>
export type InChildrenTree<Type = any> = Type | ChildrenTree<Type>

export interface Tree<Type = any> extends Summat {
	lastChild: number
	index: (multindex: number[]) => InTreeType<Type>
}

export type ChildrenTree<Type = any> = InChildrenTree<Type>[]
export interface MultChildrenTree<Type = any> extends Summat<InMultTreeType<Type>[]> {}
