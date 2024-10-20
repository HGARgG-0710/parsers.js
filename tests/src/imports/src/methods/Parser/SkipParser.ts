import { functionImports, importTest } from "imports/lib/imports.js"
import * as SkipParser from "../../../../../../dist/src/Parser/SkipParser/methods.js"
importTest(functionImports("skipParserChange", "fixedParserChange"))(SkipParser)
