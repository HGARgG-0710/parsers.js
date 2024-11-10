import { functionImports, importTest } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/utils.js"
importTest(functionImports("skip", "nested", "array", "has"))("Parser", Parser)
