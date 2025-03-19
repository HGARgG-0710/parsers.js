import type { IPattern } from "../Pattern/interfaces.js"
import type {
	IChildrenTree,
	IInTree,
	IParentTree,
	ITreeConstructor,
	ITreeConverter
} from "./interfaces.js"

import type { IWalkableTree } from "./TreeWalker/interfaces.js"

import { value } from "../Pattern/utils.js"
import { parameterWaster } from "../refactor.js"
import { isGoodIndex } from "../utils.js"

import {
	mapper,
	sequentialIndex,
	isParentTree as uisParentTree
} from "./utils.js"

import { functional, array, inplace } from "@hgargg-0710/one"
const { trivialCompose } = functional
const { last, lastIndex } = array
const { insert, out } = inplace

export class ChildrenTree<
	Type = any,
	T extends IWalkableTree<Type> = IWalkableTree<Type>
> implements IWalkableTree<Type>, IChildrenTree<Type, T>
{
	children: IInTree<Type, T>[]

	get lastChild() {
		return lastIndex(this.children)
	}

	index(multind: number[]) {
		return multind.reduce(
			(prev, curr) => prev.children[curr],
			this as IChildrenTree<Type>
		) as IInTree<Type, IWalkableTree<Type>>
	}

	write(multind: number[], value: IInTree<Type>) {
		const writtenTo = this.index(multind.slice(0, -1))
		return (writtenTo[last(multind)] = value)
	}

	append(value: IInTree<Type, T>) {
		return this.children.push(value) - 1
	}

	insert(index: number, value: IInTree<Type>) {
		return lastIndex(insert(this.children, index, value))
	}

	remove(index: number) {
		return lastIndex(out(this.children, index))
	}

	findUnwalkedChildren(endIndex: number[]) {
		const parents = sequentialIndex(this, endIndex) as IWalkableTree<Type>[]
		let result = lastIndex(parents)
		while (
			isGoodIndex(result) &&
			parents[result].lastChild <= endIndex[result]
		)
			--result
		return result
	}

	backtrack(
		positions: number,
		currInd: number[]
	): IInTree<Type, IWalkableTree<Type>> {
		return this.index(currInd.slice(0, -positions))
	}

	constructor(value?: any, converter?: ITreeConverter<Type, T>) {
		this.children = value ? converter!(value) : []
	}
}

export class ParentTree<Type = any>
	extends ChildrenTree<Type, IParentTree<Type>>
	implements IParentTree<Type>
{
	parent: IParentTree<Type> | null

	backtrack(positions: number) {
		let curr = this as IParentTree<Type> | null
		while (--positions) curr = curr!.parent
		return curr as IWalkableTree<Type>
	}

	findUnwalkedChildren(endInd: number[]) {
		let result = lastIndex(endInd)
		let currTree = this as IParentTree<Type>
		while (
			(currTree = currTree.parent!) &&
			currTree.lastChild <= endInd[result]
		)
			--result
		return result
	}

	constructor(
		value?: any,
		converter?: ITreeConverter<Type, IParentTree<Type>>,
		isParentTree: (x: any) => x is IParentTree<Type> = uisParentTree
	) {
		super(value, converter)
		this.parent = null

		const { children, lastChild } = this
		let i = lastChild
		while (i >= 0) {
			const child = children[i--]
			if (isParentTree(child)) child.parent = this
		}
	}
}

export function ChildlessTree<Type = any>(
	treeConstructor: ITreeConstructor<Type>
) {
	return parameterWaster(treeConstructor)
}

export function SingleTree<Type = any>(
	treeConstructor: ITreeConstructor<Type>
) {
	return function (
		fromTree: IPattern<Type>,
		converter: ITreeConverter<Type>
	) {
		return new treeConstructor(fromTree, trivialCompose(converter, value))
	}
}

export function MultTree<Type = any>(treeConstructor: ITreeConstructor<Type>) {
	return function (
		fromTree: IPattern<Type[]>,
		converter: ITreeConverter<Type>
	) {
		return new treeConstructor(
			fromTree,
			trivialCompose(mapper(converter), value)
		)
	}
}

export * from "./TreeWalker/classes.js"
