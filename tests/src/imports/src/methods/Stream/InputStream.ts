import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as InputStream from "../../../../../../dist/src/Stream/InputStream/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("inputStream")(
			...namesCapitalized(
				"isEnd",
				"next",
				"iterator",
				"finish",
				"curr",
				"isStart",
				"prev",
				"defaultIsEnd"
			)
		).concat(
			prefixedImportNames("effectiveInputStream")(
				...namesCapitalized("initialize", "navigate", "rewind")
			)
		)
	)
)("InputStream", InputStream)
