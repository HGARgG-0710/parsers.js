import { array, function as f } from "@hgargg-0710/one"
import type { Summat } from "./Summat.js"
import type { Token } from "./Token.js"
import { isArray } from "../misc.js"

const { trivialCompose } = f
const { propPreserve } = array

// ? later, generalize the 'multiindex' to a separate type (not just 'number[]');
export interface Tree<Type = any> extends Summat {
	lastChild: number
	index: (multindex: number[]) => Tree<Type> | Type
}

export interface ChildrentTree<Type = any> extends Tree<Tree<Type>> {
	children: (Type | Tree<Type>)[]
}

const mapPropsPreserve = (
	f: (x?: any, i?: number, arr?: any[]) => any
): ((x: any[] & Summat) => any[] & Summat) => propPreserve((array: any[]) => array.map(f))
const arrayTreePreserve = mapPropsPreserve(RecursiveArrayTree)

export function sequentialIndex<Type = any>(
	tree: Tree<Type>,
	multind: number[]
): (Tree<Type> | Type)[] {
	const result: (Tree<Type> | Type)[] = [tree]
	let current = tree
	for (const index of multind) result.push(current.index([index]))
	return result
}

export function childIndex<Type = any>(this: ChildrentTree<Type>, multind: number[]) {
	return multind.reduce(
		(prev, curr) => (prev.children as ChildrentTree<Type>[])[curr],
		this
	)
}
export function childrenCount(this: ChildrentTree): number {
	return this.children.length - 1
}

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
