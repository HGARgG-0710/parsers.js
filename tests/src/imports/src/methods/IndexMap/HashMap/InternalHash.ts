import { functionImports, importTest } from "imports/lib/imports.js"
import * as InternalHash from "../../../../../../../dist/src/IndexMap/HashMap/InternalHash/methods.js"

importTest(
	functionImports(
		"mapInternalHashGet",
		"mapInternalHashReplaceKey",
		"objectInternalHashGet",
		"objectInternalHashSet",
		"objectInternalHashDelete",
		"objectInternalHashReplaceKey"
	)
)("InternalHash", InternalHash)
