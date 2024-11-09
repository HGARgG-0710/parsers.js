import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"
import * as Stream from "../../../../../dist/src/Stream/classes.js"

importTest(
	functionImports(
		...specificChildImports.Stream.concat([
			"StreamParser",
			"BasicParser",
			"LocatorStream",
			"PositionalValidator",
			"StreamValidator",
			"TreeStream"
		])
	)
)("Stream", Stream)
