import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"
import * as TokenizablePattern from "../../../../../../dist/src/Pattern/TokenizablePattern/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("tokenizableStringPattern")(
			...namesCapitalized("tokenize", "flush")
		)
	)
)(TokenizablePattern)
