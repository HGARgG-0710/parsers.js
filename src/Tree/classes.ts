import type { Pattern } from "../Pattern/interfaces.js"
import type {
	ChildrenTree as IChildrenTree,
	InTree,
	ParentTree as ParentTreeType,
	TreeConstructor,
	TreeConverter,
	WalkableInTreeType
} from "./interfaces.js"

import type { WalkableTree } from "./TreeWalker/interfaces.js"

import { value } from "../Pattern/utils.js"
import { lastIndex } from "../utils.js"
import { parameterWaster } from "src/refactor.js"
import { isGoodIndex } from "src/utils.js"
import { mapper, sequentialIndex } from "./utils.js"

import { functional, array } from "@hgargg-0710/one"
const { trivialCompose } = functional
const { last } = array

export class ChildrenTree<Type = any> implements IChildrenTree<Type> {
	children: InTree<Type>[]

	get lastChild() {
		return lastIndex(this.children)
	}

	index(multind: number[]) {
		return multind.reduce(
			(prev, curr) => prev.children[curr],
			this as IChildrenTree<Type>
		)
	}

	write(multind: number[], value: InTree<Type>) {
		const writtenTo = this.index(multind.slice(0, -1))
		return (writtenTo[last(multind)] = value)
	}

	constructor(value?: any, converter?: TreeConverter<Type>) {
		this.children = value ? converter!(value) : []
	}
}

export class ParentTree<Type = any>
	extends ChildrenTree<Type>
	implements ParentTreeType<Type>
{
	index: (multindex: number[]) => WalkableInTreeType<Type>
	parent: ParentTreeType<Type> | null

	backtrack(positions: number) {
		let curr = this as ParentTreeType<Type> | null
		while (--positions) curr = curr!.parent
		return curr
	}

	findUnwalkedChildren(endInd: number[]) {
		let result = lastIndex(endInd)
		let currTree = this as ParentTreeType<Type>
		while ((currTree = currTree.parent!) && currTree.lastChild <= endInd[result])
			--result
		return result
	}

	constructor(value?: any, converter?: TreeConverter<Type>) {
		super(value, converter)
		this.parent = null

		const { children, lastChild } = this
		let i = lastChild
		while (i >= 0) {
			const child = children[i--]
			if (child instanceof ParentTree) child.parent = this
		}
	}
}

export class TrivialWalkableTree<Type = any>
	extends ChildrenTree<Type>
	implements WalkableTree<Type>
{
	index: (multindex: number[]) => WalkableInTreeType<Type>
	findUnwalkedChildren: (startIndex: number[]) => number

	findUnwalkeChildren(endIndex: number[]) {
		const parents = sequentialIndex(this, endIndex) as WalkableTree<Type>[]
		let result = lastIndex(parents)
		while (isGoodIndex(result) && parents[result].lastChild <= endIndex[result])
			--result
		return result
	}

	backtrack(positions: number, currInd: number[]) {
		return this.index(currInd.slice(0, -positions))
	}
}

export function ChildlessTree<Type = any>(treeConstructor: TreeConstructor<Type>) {
	return parameterWaster(treeConstructor)
}

export function SingleTree<Type = any>(treeConstructor: TreeConstructor<Type>) {
	return function (fromTree: Pattern<Type>, converter: TreeConverter<Type>) {
		return new treeConstructor(fromTree, (x: Pattern<Type>) => converter(x.value))
	}
}

export function MultTree<Type = any>(treeConstructor: TreeConstructor<Type>) {
	return function (fromTree: Pattern<Type[]>, converter: TreeConverter<Type>) {
		return new treeConstructor(fromTree, trivialCompose(mapper(converter), value))
	}
}

export * from "./TreeWalker/classes.js"
