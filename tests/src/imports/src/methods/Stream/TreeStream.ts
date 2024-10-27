import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as TreeStream from "../../../../../../dist/src/Stream/TreeStream/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("effectiveTreeStream")(
			...namesCapitalized(
				"next",
				"rewind",
				"navigate",
				"prev",
				"currGetter",
				"isEnd",
				"isStart",
				"initialize",
				"inputGetter",
				"inputSetter"
			)
		)
	)
)(TreeStream)
