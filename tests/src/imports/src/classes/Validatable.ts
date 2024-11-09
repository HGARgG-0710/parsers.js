import { functionImports, importTest } from "imports/lib/imports.js"
import * as Validatable from "../../../../../dist/src/Validatable/classes.js"
importTest(functionImports("ValidatableString", "DelegateValidatable"))(
	"Validatable",
	Validatable
)
