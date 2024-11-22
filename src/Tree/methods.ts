import type { ChildrenTree, MultChildrenTree } from "./interfaces.js"
import { lastIndex } from "../utils.js"

export function baseChildIndex<Type = any>(this: ChildrenTree<Type>, multind: number[]) {
	return multind.reduce((prev, curr) => prev[curr], this)
}

export function baseChildrenCount(this: ChildrenTree) {
	return lastIndex(this)
}

export function childIndex(propName: string = "children") {
	return propName
		? function <Type = any>(this: MultChildrenTree<Type>, multind: number[]) {
				return multind.reduce(
					(prev, curr) => (prev[propName] as MultChildrenTree<Type>[])[curr],
					this
				)
		  }
		: baseChildIndex
}

export function childrenCount(propName: string = "children") {
	return propName
		? function (this: MultChildrenTree): number {
				return lastIndex(this[propName])
		  }
		: baseChildrenCount
}

export * as TreeWalker from "./TreeWalker/methods.js"
