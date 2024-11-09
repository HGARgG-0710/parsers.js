import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

importTest(
	functionImports(
		...prefixedImportNames("constEnum")(
			...namesCapitalized("add", "join", "copy", "map")
		)
	)
)
