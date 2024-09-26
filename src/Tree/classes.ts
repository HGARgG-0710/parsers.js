import type { Summat } from "@hgargg-0710/summat.ts"
import { childrenCount, childIndex } from "./methods.js"
import type { Tree, ChildrenTree, MultChildrenTree } from "./interfaces.js"

import { inplace } from "@hgargg-0710/one"
import type { Pattern } from "../Pattern/interfaces.js"

const { mutate } = inplace

/**
 * Initializes a new `ChildrenTree` without the `[propName]` (default: `"children"`) value (expected to be set by the user).
 *
 * The `.lastChild` is defined as `this.children.length - 1` [via a getter]
 *
 * The `.index` is defined as `childIndex`
 */
export function ChildrenTree(propName: string = "children") {
	const countGetter = childrenCount(propName)
	const indexator = childIndex(propName)
	return function (tree: Summat): Tree {
		Object.defineProperty(tree, "lastChild", {
			enumerable: true,
			get: countGetter
		})
		tree.index = indexator
		return tree as Tree
	}
}

export function ChildlessTree(propName: string = "children") {
	return function (tree: Tree): MultChildrenTree {
		tree[propName] = []
		return tree as MultChildrenTree
	}
}

export function SingleTree(propName: string = "children") {
	return function <Type = any>(
		tree: Pattern<Type>,
		converter: (x: Type) => Type = (x) => x
	): MultChildrenTree & Pattern<Type> {
		tree[propName] = [converter(tree.value)]
		return tree
	}
}

export function BaseMultTree<Type = any>(
	tree: Tree & Pattern<Type[]>,
	converter: (x: Type) => Type = (x) => x
): MultChildrenTree & Pattern<Type[]> {
	mutate(tree.value, converter)
	return tree
}

export function MultTree(propName: string = "children") {
	return propName === "value"
		? BaseMultTree
		: function <Type = any>(
				tree: Tree & Pattern<Type[]>,
				converter: (x: Type) => Type = (x) => x
		  ): MultChildrenTree & Pattern<Type[]> {
				tree[propName] = tree.value.map(converter)
				return tree
		  }
}
