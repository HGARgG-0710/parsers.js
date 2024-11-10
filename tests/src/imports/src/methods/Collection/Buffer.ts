import { functionImports, importTest } from "imports/lib/imports.js"
import * as Buffer from "../../../../../../dist/src/Collection/Buffer/methods.js"

importTest(
	functionImports(
		"freezableBufferFreeze",
		"unfreezableBufferUnfreeze",
		"freezableArrayPush",
		"freezableArrayRead",
		"unfreezableStringPush"
	)
)("Buffer", Buffer)
