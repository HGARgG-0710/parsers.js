import type { ChildrenTree, MultChildrenTree } from "./interfaces.js"

export function baseChildIndex<Type = any>(this: ChildrenTree<Type>, multind: number[]) {
	return multind.reduce((prev, curr) => prev[curr], this)
}

export function baseChildrenCount(this: ChildrenTree) {
	return this.length - 1
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
				return this[propName].length - 1
		  }
		: baseChildrenCount
}

export * as TreeWalker from "./TreeWalker/methods.js"
