import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as HashMap from "../../../../../../dist/src/IndexMap/HashMap/classes.js"

importTest(
	functionImports(
		"HashClass",
		"BasicHash",
		"LengthHash",
		"TokenHash",
		"TypeofHash"
	).concat(objectImports("InternalHash"))
)(HashMap)
