import type { Summat } from "@hgargg-0710/summat.ts"
import type { WalkableTree } from "./TreeWalker/interfaces.js"

export type InTreeType<Type = any> = Type | Tree<Type>
export type WalkableInTreeType<Type = any> = Type | WalkableTree<Type>

export interface Tree<Type = any> {
	readonly lastChild: number
	index: (multindex: number[]) => InTreeType<Type>
}

export interface ParentTree<Type = any> extends WalkableTree<Type> {
	parent: ParentTree<Type> | null
}

export interface ChildrenTree<Type = any> extends Tree<Type> {
	children: InTreeType<Type>[]
}

export type TreeConstructor<Type = any> = new (
	value?: Summat,
	converter?: TreeConverter
) => ChildrenTree<Type>

export type TreeConverter<Type = any> = (x: any) => InTreeType<Type>[]

export type * as TreeWalker from "./TreeWalker/interfaces.js"
