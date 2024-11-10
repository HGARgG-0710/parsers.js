import { functionImports, importTest } from "imports/lib/imports.js"
import * as FastLookupTable from "../../../../../../dist/src/IndexMap/FastLookupTable/methods.js"

importTest(
	functionImports(
		"affirmOwnership",
		"persistentIndexFastLookupTableByOwned",
		"persistentIndexFastLookupTableDelete",
		"hashMapFastLookupTableByOwned"
	)
)("FastLookupTable", FastLookupTable)
