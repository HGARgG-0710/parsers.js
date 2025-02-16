import type { Summat } from "@hgargg-0710/summat.ts"
import type { WalkableTree } from "./TreeWalker/interfaces.js"

export type InTree<Type = any, T extends Tree<Type> = Tree<Type>> = Type | T

export interface ReadonlyTree<Type = any> {
	readonly lastChild: number
	index: (multindex: number[]) => InTree<Type>
}

export interface WriteTree<Type = any> {
	write: (multindex: number[], value: InTree<Type>) => InTree<Type>
}

export interface DynamicTree<Type = any> {
	append: (value: InTree<Type>) => number
	insert: (index: number, value: InTree<Type>) => number
	remove: (index: number) => number
}

export type Tree<Type = any> = ReadonlyTree<Type> & WriteTree<Type>

export interface ParentTree<Type = any> extends WalkableTree<Type> {
	parent: ParentTree<Type> | null
}

export interface ChildrenTree<Type = any, T extends Tree<Type> = Tree<Type>>
	extends Tree<Type> {
	children: InTree<Type, T>[]
}

export type TreeConstructor<Type = any, T extends Tree<Type> = Tree<Type>> = new (
	value?: Summat,
	converter?: TreeConverter<Type, T>
) => ChildrenTree<Type, T>

export type TreeConverter<Type = any, T extends Tree<Type> = Tree<Type>> = (
	x: any
) => InTree<Type, T>[]

export type * as TreeWalker from "./TreeWalker/interfaces.js"
