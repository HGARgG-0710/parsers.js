import { it } from "node:test"
import type { Tree } from "../../../../dist/src/Tree/interfaces.js"

import { recursiveTreeCopy, sequentialIndex } from "../../../../dist/src/Tree/utils.js"
import { isTree } from "./classes.js"
import { arraysSame, tripleUtilTest } from "lib/lib.js"
import assert from "node:assert"

export const sequentialIndexTest = tripleUtilTest(
	sequentialIndex,
	"sequentialIndex",
	arraysSame
)

function recursiveTreeCompare(x: any, y: any) {
	if (isTree(x) && isTree(y)) {
		if (x.lastChild !== y.lastChild) return false
		let lastChild = x.lastChild + 1
		while (lastChild--)
			if (!recursiveTreeCompare(x.index([lastChild]), y.index([lastChild])))
				return false
		return true
	}
	return x === y
}

export function recursiveTreeCopyTest(x: Tree, propName: string) {
	it(`util: recursiveTreeCopy (${propName})`, () =>
		assert(recursiveTreeCompare(x, recursiveTreeCopy(propName)(x))))
}
