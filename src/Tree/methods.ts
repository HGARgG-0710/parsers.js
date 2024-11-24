import type { Summat } from "@hgargg-0710/summat.ts"
import type { Indexed } from "../Stream/interfaces.js"
import { lastIndex } from "../utils.js"

export function baseChildIndex(this: Summat, multind: number[]) {
	return multind.reduce((prev, curr) => prev[curr], this)
}

export function baseChildrenCount(this: Indexed) {
	return lastIndex(this)
}

export function childIndex(propName: string = "children") {
	return propName
		? function (this: Summat, multind: number[]) {
				return multind.reduce((prev, curr) => prev[propName][curr], this)
		  }
		: baseChildIndex
}

export function childrenCount(propName: string = "children") {
	return propName
		? function (this: Summat): number {
				return lastIndex(this[propName])
		  }
		: baseChildrenCount
}

export * as TreeWalker from "./TreeWalker/methods.js"
