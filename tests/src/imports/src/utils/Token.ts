import { functionImports, importTest } from "imports/lib/imports.js"
import * as Token from "../../../../../dist/src/Token/utils.js"
importTest(functionImports("isType", "isToken", "type"))("Token", Token)
