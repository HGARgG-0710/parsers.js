import type { Summat } from "@hgargg-0710/summat.ts"
import type { IWalkableTree } from "./TreeWalker/interfaces.js"

export type IInTree<Type = any, T extends IReadonlyTree<Type> = IReadonlyTree<Type>> =
	| Type
	| T

export interface IReadonlyTree<Type = any> {
	readonly lastChild: number
	index: (multindex: number[]) => IInTree<Type, any>
}

export interface IWriteTree<Type = any> {
	write: (multindex: number[], value: IInTree<Type>) => IInTree<Type>
	append: (value: IInTree<Type>) => number
	insert: (index: number, value: IInTree<Type>) => number
	remove: (index: number) => number
}

export type ITree<Type = any> = IReadonlyTree<Type> & IWriteTree<Type>

export interface IParentTree<Type = any> extends IWalkableTree<Type> {
	parent: IParentTree<Type> | null
}

export interface IChildrenTree<
	Type = any,
	T extends IReadonlyTree<Type> = IReadonlyTree<Type>
> extends IReadonlyTree<Type> {
	children: IInTree<Type, T>[]
}

export type ITreeConstructor<
	Type = any,
	T extends IReadonlyTree<Type> = IReadonlyTree<Type>
> = new (value?: Summat, converter?: ITreeConverter<Type, T>) => IChildrenTree<Type, T>

export type ITreeConverter<
	Type = any,
	T extends IReadonlyTree<Type> = IReadonlyTree<Type>
> = (x: any) => IInTree<Type, T>[]

export type * from "./TreeWalker/interfaces.js"
