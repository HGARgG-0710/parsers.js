import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"
import * as Pattern from "../../../../../dist/src/Pattern/classes.js"
importTest(
	specificChildImports.Pattern.concat(
		functionImports("BasicPattern", "FlushablePattern")
	)
)("Pattern", Pattern)
