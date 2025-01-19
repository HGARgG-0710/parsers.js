import type { Summat } from "@hgargg-0710/summat.ts"
import type { WalkableTree } from "./TreeWalker/interfaces.js"

export type InTree<Type = any> = Type | Tree<Type>
export type WalkableInTreeType<Type = any> = Type | WalkableTree<Type>

export interface ReadonlyTree<Type = any> {
	readonly lastChild: number
	index: (multindex: number[]) => InTree<Type>
}

export interface WriteTree<Type = any> {
	write: (multindex: number[], value: InTree<Type>) => InTree<Type>
}

export type Tree<Type = any> = ReadonlyTree<Type> & WriteTree<Type>

export interface ParentTree<Type = any> extends WalkableTree<Type> {
	parent: ParentTree<Type> | null
}

export interface ChildrenTree<Type = any> extends Tree<Type> {
	children: InTree<Type>[]
}

export type TreeConstructor<Type = any> = new (
	value?: Summat,
	converter?: TreeConverter
) => ChildrenTree<Type>

export type TreeConverter<Type = any> = (x: any) => InTree<Type>[]

export type * as TreeWalker from "./TreeWalker/interfaces.js"
