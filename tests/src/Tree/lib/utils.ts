import { sequentialIndex } from "../../../../dist/src/Tree/utils.js"

import { tripleUtilTest } from "lib/lib.js"

import { array } from "@hgargg-0710/one"

export const sequentialIndexTest = tripleUtilTest(
	sequentialIndex,
	"sequentialIndex",
	array.same
)
