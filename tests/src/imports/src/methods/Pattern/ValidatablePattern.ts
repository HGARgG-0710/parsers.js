import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"
import * as ValidatablePattern from "../../.../../../../../../dist/src/Pattern/ValidatablePattern/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("validatableStringPattern")(
			...namesCapitalized("flush", "validate")
		)
	)
)(ValidatablePattern)
