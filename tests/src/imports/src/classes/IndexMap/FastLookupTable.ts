import { functionImports, importTest } from "imports/lib/imports.js"
import * as FastLookupTable from "../../../../../../dist/src/IndexMap/FastLookupTable/classes.js"
importTest(
	functionImports(
		"PersistentIndexFastLookupTable",
		"HashTable",
		"BasicHashTable",
		"StreamHashTable"
	)
)("FastLookupTable", FastLookupTable)
