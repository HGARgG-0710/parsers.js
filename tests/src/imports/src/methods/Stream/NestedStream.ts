import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"
import * as NestedStream from "../../../../../../dist/src/Stream/NestedStream/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("effectiveNestedStream")(
			...namesCapitalized("initCurr", "next", "isEnd", "initialize")
		)
	)
)(NestedStream)
