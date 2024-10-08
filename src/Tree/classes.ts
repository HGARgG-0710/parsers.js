import type { Summat } from "@hgargg-0710/summat.ts"
import type { Tree, ChildrenTree, MultChildrenTree } from "./interfaces.js"
import type { Pattern } from "../Pattern/interfaces.js"

import { childrenCount, childIndex } from "./methods.js"

import { function as _f } from "@hgargg-0710/one"
const { id } = _f

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
		converter: (x: Type) => any = id
	): MultChildrenTree & Pattern<Type> {
		tree[propName] = [converter(tree.value)]
		return tree
	}
}

export function MultTree(propName: string = "children") {
	return function <Type = any>(
		tree: Tree & Pattern<Type[]>,
		converter: (x: Type) => Type = id
	): MultChildrenTree & Pattern<Type[]> {
		tree[propName] = tree.value.map(converter)
		return tree
	}
}
