import { functionImports, importTest } from "imports/lib/imports.js"
import * as Buffer from "../../../../../../dist/src/Collection/Buffer/utils.js"

importTest(
	functionImports(
		"isFreezableBuffer",
		"isBufferized",
		"assignBuffer",
		"lastIndex",
		"readLast",
		"readFirst",
		"bufferFreeze",
		"bufferPush"
	)
)("Buffer", Buffer)
