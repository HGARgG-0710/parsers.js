import { array } from "@hgargg-0710/one"
import type { Summat } from "./Summat.js"
import { isArray } from "../misc.js"
const { propPreserve } = array

// ? later, generalize the 'multiindex' to a separate type (not just 'number[]');
export interface Tree<Type = any> extends Summat {
	lastChild: () => number
	index: (multindex: number[]) => Tree<Type> | Type
}

const mapPropsPreserve = (
	f: (x?: any, i?: number, arr?: any[]) => any
): ((x: any[] & Summat) => any[] & Summat) => propPreserve((array: any[]) => array.map(f))
const arrayTreePreserve = mapPropsPreserve(RecursiveArrayTree)

export function childIndex(multind: number[]) {
	return multind.reduce((prev, curr) => prev.children[curr], this)
}
export function childrenCount(): number {
	return this.children.length - 1
}

export function ChildrenTree(tree: Summat): Tree {
	tree.lastChild = childrenCount
	tree.index = childIndex
	return tree as Tree
}

export function ChildlessTree(tree: Tree): Tree {
	tree.children = []
	return tree
}

export function SingleValueTree(tree: Tree, converter: (x: any) => any): Tree {
	tree.value = converter(tree.value)
	tree.children = [tree.value]
	return tree
}

export function MultValueTree(tree: Tree, converter: (x: any) => any): Tree {
	tree.value = tree.value.map(converter)
	tree.children = tree.value
	return tree
}

export function ThisTree(level: Summat): Summat {
	level.children = level
	return level
}

export function ArrayTree(level: Summat): Tree {
	ChildrenTree(level)
	ThisTree(level)
	return level as Tree
}

export function RecursiveArrayTree(arrtree: any): Tree {
	return isArray(arrtree) ? ArrayTree(arrayTreePreserve(arrtree)) : arrtree
}
