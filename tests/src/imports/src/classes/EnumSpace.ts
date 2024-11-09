import { functionImports, importTest } from "imports/lib/imports.js"
import * as EnumSpace from "../../../../../dist/src/EnumSpace/classes.js"
importTest(functionImports("ConstEnum", "TokenInstanceEnum", "SimpleTokenTypeEnum"))(
	"EnumSpace",
	EnumSpace
)
