import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as LimitedStream from "../../../../../../dist/src/Stream/LimitedStream/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("effectiveLimitedStream")(
			...namesCapitalized("isStart", "prev", "initialize", "isEnd", "prod", "next")
		)
	)
)("LimitedStream", LimitedStream)
