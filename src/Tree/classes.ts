import type { Pattern } from "../Pattern/interfaces.js"
import type {
	IChildrenTree,
	InTree,
	IParentTree,
	TreeConstructor,
	TreeConverter
} from "./interfaces.js"

import type { WalkableTree } from "./TreeWalker/interfaces.js"

import { isParentTree as uisParentTree } from "./utils.js"
import { value } from "../Pattern/utils.js"
import { lastIndex } from "../utils.js"
import { parameterWaster } from "src/refactor.js"
import { isGoodIndex } from "src/utils.js"
import { mapper, sequentialIndex } from "./utils.js"

import { functional, array, inplace } from "@hgargg-0710/one"
const { trivialCompose } = functional
const { last } = array
const { insert, out } = inplace

export class ChildrenTree<Type = any, T extends WalkableTree<Type> = WalkableTree<Type>>
	implements WalkableTree<Type>, IChildrenTree<Type, T>
{
	children: InTree<Type, T>[]

	get lastChild() {
		return lastIndex(this.children)
	}

	index(multind: number[]) {
		return multind.reduce(
			(prev, curr) => prev.children[curr],
			this as IChildrenTree<Type>
		) as InTree<Type, WalkableTree<Type>>
	}

	write(multind: number[], value: InTree<Type>) {
		const writtenTo = this.index(multind.slice(0, -1))
		return (writtenTo[last(multind)] = value)
	}

	append(value: InTree<Type, T>) {
		return this.children.push(value) - 1
	}

	insert(index: number, value: InTree<Type>) {
		return lastIndex(insert(this.children, index, value))
	}

	remove(index: number) {
		return lastIndex(out(this.children, index))
	}

	findUnwalkedChildren(endIndex: number[]) {
		const parents = sequentialIndex(this, endIndex) as WalkableTree<Type>[]
		let result = lastIndex(parents)
		while (isGoodIndex(result) && parents[result].lastChild <= endIndex[result])
			--result
		return result
	}

	backtrack(positions: number, currInd: number[]): InTree<Type, WalkableTree<Type>> {
		return this.index(currInd.slice(0, -positions))
	}

	constructor(value?: any, converter?: TreeConverter<Type, T>) {
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
		return curr as WalkableTree<Type>
	}

	findUnwalkedChildren(endInd: number[]) {
		let result = lastIndex(endInd)
		let currTree = this as IParentTree<Type>
		while ((currTree = currTree.parent!) && currTree.lastChild <= endInd[result])
			--result
		return result
	}

	constructor(
		value?: any,
		converter?: TreeConverter<Type, IParentTree<Type>>,
		isParentTree: (x: any) => x is ParentTree<Type> = uisParentTree
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

export function ChildlessTree<Type = any>(treeConstructor: TreeConstructor<Type>) {
	return parameterWaster(treeConstructor)
}

export function SingleTree<Type = any>(treeConstructor: TreeConstructor<Type>) {
	return function (fromTree: Pattern<Type>, converter: TreeConverter<Type>) {
		return new treeConstructor(fromTree, trivialCompose(converter, value))
	}
}

export function MultTree<Type = any>(treeConstructor: TreeConstructor<Type>) {
	return function (fromTree: Pattern<Type[]>, converter: TreeConverter<Type>) {
		return new treeConstructor(fromTree, trivialCompose(mapper(converter), value))
	}
}

export * from "./TreeWalker/classes.js"
