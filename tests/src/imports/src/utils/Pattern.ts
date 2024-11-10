import { functionImports, importTest } from "imports/lib/imports.js"
import * as Pattern from "../../../../../dist/src/Pattern/utils.js"
importTest(functionImports("value", "setValue", "optionalValue"))("Pattern", Pattern)
