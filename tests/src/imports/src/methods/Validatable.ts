import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as Validatable from "../../.../../../../../dist/src/Validatable/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("validatableString")(
			...namesCapitalized("flush", "validate")
		)
	)
)("Validatable", Validatable)
