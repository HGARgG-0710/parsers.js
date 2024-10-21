import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"
import * as MultiIndex from "../../../../../../dist/src/Position/MultiIndex/classes.js"
importTest(functionImports("MultiIndex").concat(specificChildImports.MultiIndex))(
	MultiIndex
)
