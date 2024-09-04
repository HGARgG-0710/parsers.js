import type { Summat } from "@hgargg-0710/summat.ts"
import { childrenCount, childIndex } from "./methods.js"
import type { Tree, ChildrentTree } from "./interfaces.js"
import type { Token } from "_src/types.js"
import { arrayTreePreserve } from "./utils.js"

import { function as f, typeof as type } from "@hgargg-0710/one"
const { trivialCompose } = f
const { isArray } = type

export function ChildrenTree(tree: Summat): ChildrentTree {
	Object.defineProperty(tree, "lastChild", {
		get: childrenCount
	})
	tree.index = childIndex
	return tree as ChildrentTree
}

export function ChildlessTree(tree: Tree): ChildrentTree {
	tree.children = []
	return tree as ChildrentTree
}
export function SingleValueTree(tree: Tree & Token, converter: (x: any) => any): Tree {
	tree.value = converter(tree.value)
	tree.children = [tree.value]
	return tree
}

export function MultValueTree(
	tree: ChildrentTree & Token<any, any[]>,
	converter: (x: any) => any
): Tree {
	tree.value = tree.value.map(converter)
	tree.children = tree.value
	return tree
}

export function ThisTree(level: Summat): Summat {
	level.children = level
	return level
}

export const ArrayTree: (x: any) => Tree = trivialCompose(ThisTree, ChildrenTree)

export function RecursiveArrayTree(arrtree: any): Tree {
	return isArray(arrtree) ? ArrayTree(arrayTreePreserve(arrtree)) : arrtree
}
