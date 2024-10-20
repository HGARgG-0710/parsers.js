import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"
import * as StreamLocator from "../../../../../../dist/src/Parser/StreamLocator/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("streamLocator")(
			...namesCapitalized("finished", "changed")
		)
	)
)(StreamLocator)
