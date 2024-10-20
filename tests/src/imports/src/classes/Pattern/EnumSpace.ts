import { functionImports, importTest } from "imports/lib/imports.js"
import * as EnumSpace from "../../../../../../dist/src/Pattern/EnumSpace/classes.js"
importTest(functionImports("ConstEnum", "TokenInstanceEnum", "SimpleTokenTypeEnum"))(
	EnumSpace
)
