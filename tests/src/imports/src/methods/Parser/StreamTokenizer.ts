import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as StreamTokenizer from "../../../../../../dist/src/Parser/StreamTokenizer/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("streamTokenizer")(
			...namesCapitalized("next", "initialize")
		)
	)
)(StreamTokenizer)
