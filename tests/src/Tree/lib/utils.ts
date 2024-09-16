import { it } from "node:test"
import type { Tree } from "../../../../dist/src/Tree/interfaces.js"

import {
	isTree,
	recursiveTreeCopy,
	sequentialIndex
} from "../../../../dist/src/Tree/utils.js"
import { arraysSame } from "lib/lib.js"
import assert from "node:assert"

export function sequentialIndexTest(
	tree: Tree,
	index: number[],
	values: any[],
	lowCompare: (x: any, y: any) => boolean
) {
	it(`util: sequentialIndex (${index})`, () =>
		assert(arraysSame(sequentialIndex(tree, index), values, lowCompare)))
}

function recursiveTreeCompare(x: any, y: any, pred: (x: any, y: any) => boolean) {
	if (isTree(x) && isTree(y)) {
		if (x.lastChild !== y.lastChild) return false
		let lastChild = x.lastChild + 1
		while (lastChild--)
			if (!recursiveTreeCompare(x.index([lastChild]), y.index([lastChild]), pred))
				return false
		return true
	}
	return pred(x, y)
}

export function recursiveTreeCopyTest(x: Tree, propName: string) {
	it(`util: recursiveTreeCopy (${propName})`, () =>
		assert(
			recursiveTreeCompare(
				x,
				recursiveTreeCopy(propName)(x),
				propName ? (x, y) => x[propName] === y[propName] : (x, y) => x === y
			)
		))
}
