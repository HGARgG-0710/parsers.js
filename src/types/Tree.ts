import { array } from "@hgargg-0710/one"
import type { Summat } from "./Summat.js"
const { propPreserve } = array

// ? later, generalize the 'multiindex' to a separate type (not just 'number[]');
export interface Tree<Type = any> extends Summat {
	lastChild: () => number
	index: (multindex: number[]) => Type
}

export type RecursiveTree<Type = any> = Tree<Type | RecursiveTree<Type>>

const mapPropsPreserve = (f: (x?: any, i?: number, arr?: any[]) => any) =>
	propPreserve((array: any[]) => array.map(f))
const arrayTreePreserve = mapPropsPreserve(ArrayTree)

export function childIndex(multind: number[]) {
	return multind.reduce((prev, curr) => prev.children()[curr], this)
}
export function childrenCount(): number {
	return this.children().length - 1
}

export type ExtendableArray<Type = any> = Type[] & RecursiveTree<Type>
export function ArrayTree<Type = any>(arrtree: any): RecursiveTree<Type> {
	function ArrTreeLevel(level: ExtendableArray<Type>): RecursiveTree<Type> {
		level.lastChild = childrenCount
		level.index = childIndex
		level.children = function () {
			return this
		}
		return level
	}
	return arrtree instanceof Array ? ArrTreeLevel(arrayTreePreserve(arrtree)) : arrtree
}
