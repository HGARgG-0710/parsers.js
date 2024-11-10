import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as ProlongedStream from "../../../../../../dist/src/Stream/ProlongedStream/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("effectiveProlongedStream")(
			...namesCapitalized("isEnd", "next")
		).concat(
			prefixedImportNames("prolongedStream")(
				...namesCapitalized("curr", "initialize", "defaultIsEnd")
			)
		)
	)
)("ProlongedStream", ProlongedStream)
