import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as HashMap from "../../../../../../dist/src/IndexMap/HashMap/methods.js"

importTest(
	functionImports(
		"hashMapIndex",
		"hashMapSet",
		"hashMapDelete",
		"hashMapReplaceKey",
		"hashClassExtend"
	).concat(objectImports("InternalHash"))
)(HashMap)
