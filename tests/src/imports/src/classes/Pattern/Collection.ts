import { functionImports, importTest } from "imports/lib/imports.js"
import * as Collection from "../../../../../../dist/src/Pattern/Collection/classes.js"
importTest(
	functionImports(
		"StringCollection",
		"ArrayCollection",
		"AccumulatingPatternCollection"
	)
)(Collection)
