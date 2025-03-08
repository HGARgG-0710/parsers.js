import type { Summat } from "@hgargg-0710/summat.ts"
import type { WalkableTree } from "./TreeWalker/interfaces.js"

export type InTree<Type = any, T extends ReadonlyTree<Type> = ReadonlyTree<Type>> =
	| Type
	| T

export interface ReadonlyTree<Type = any> {
	readonly lastChild: number
	index: (multindex: number[]) => InTree<Type, any>
}

export interface WriteTree<Type = any> {
	write: (multindex: number[], value: InTree<Type>) => InTree<Type>
	append: (value: InTree<Type>) => number
	insert: (index: number, value: InTree<Type>) => number
	remove: (index: number) => number
}

export type Tree<Type = any> = ReadonlyTree<Type> & WriteTree<Type>

export interface IParentTree<Type = any> extends WalkableTree<Type> {
	parent: IParentTree<Type> | null
}

export interface IChildrenTree<
	Type = any,
	T extends ReadonlyTree<Type> = ReadonlyTree<Type>
> extends ReadonlyTree<Type> {
	children: InTree<Type, T>[]
}

export type TreeConstructor<
	Type = any,
	T extends ReadonlyTree<Type> = ReadonlyTree<Type>
> = new (value?: Summat, converter?: TreeConverter<Type, T>) => IChildrenTree<Type, T>

export type TreeConverter<
	Type = any,
	T extends ReadonlyTree<Type> = ReadonlyTree<Type>
> = (x: any) => InTree<Type, T>[]

export type * from "./TreeWalker/interfaces.js"
