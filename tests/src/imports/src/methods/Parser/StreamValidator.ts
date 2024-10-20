import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

importTest(
	functionImports(
		...prefixedImportNames("streamValidator")(
			...namesCapitalized("change", "finished")
		)
	)
)
