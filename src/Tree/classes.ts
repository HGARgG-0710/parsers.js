import type { Pattern } from "../Pattern/interfaces.js"
import type {
	ChildrenTree as ChildrenTreeType,
	InTreeType,
	ParentTree as ParentTreeType,
	TreeConstructor,
	TreeConverter,
	WalkableInTreeType
} from "./interfaces.js"

import type { WalkableTree } from "./TreeWalker/interfaces.js"

import {
	childrenCount,
	childIndex,
	parentTreeBacktrack,
	parentTreeFindUnwalkedChildren,
	childrenGetter,
	childrenSetter,
	trivialFindUnwalkedChildren,
	trivialBacktrack
} from "./methods.js"

import { BasicPattern } from "src/Pattern/abstract.js"
import { value } from "../Pattern/utils.js"
import { extendPrototype, parameterWaster } from "../utils.js"
import { mapper } from "./utils.js"

import { functional } from "@hgargg-0710/one"
const { trivialCompose } = functional

export abstract class BasicTree<Type = any> extends BasicPattern<Type[]> {
	constructor(value: Type[]) {
		super(value)
	}
}

export class ChildrenTree<Type = any>
	extends BasicTree<InTreeType<Type>>
	implements ChildrenTreeType<Type>
{
	children: InTreeType<Type>[]
	lastChild: number
	index: (multindex: number[]) => InTreeType<Type>

	constructor(value?: any, converter?: TreeConverter<Type>) {
		super(value ? converter!(value) : [])
	}
}

extendPrototype(ChildrenTree, {
	lastChild: {
		get: childrenCount
	},
	index: { value: childIndex },
	children: {
		set: childrenSetter,
		get: childrenGetter
	}
})

export class ParentTree<Type = any>
	extends ChildrenTree<Type>
	implements ParentTreeType<Type>
{
	index: (multindex: number[]) => WalkableInTreeType<Type>
	backtrack: (positions: number, currInd: number[]) => WalkableTree<Type>
	findUnwalkedChildren: (startInd: number[]) => number
	parent: ParentTreeType<Type> | null

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

extendPrototype(ParentTree, {
	backtrack: { value: parentTreeBacktrack },
	findUnwalkedChildren: { value: parentTreeFindUnwalkedChildren }
})

export class TrivialWalkableTree<Type = any>
	extends ChildrenTree<Type>
	implements WalkableTree<Type>
{
	index: (multindex: number[]) => WalkableInTreeType<Type>
	backtrack: (positions: number, currInd?: number[]) => WalkableTree<Type>
	findUnwalkedChildren: (startIndex: number[]) => number
}

extendPrototype(TrivialWalkableTree, {
	backtrack: { value: trivialBacktrack },
	findUnwalkedChildren: { value: trivialFindUnwalkedChildren }
})

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
