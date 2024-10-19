import { functionImports, importTest } from "imports/lib/imports.js"
import * as LinearIndexMap from "../../../../../../dist/src/IndexMap/LinearIndexMap/classes.js"

importTest(
	functionImports(
		"LinearMapClass",
		"OptimizedLinearMap",
		"LinearPredicateMap",
		"LinearRegExpMap",
		"LinearSetMap",
		"LinearBasicMap"
	)
)(LinearIndexMap)
