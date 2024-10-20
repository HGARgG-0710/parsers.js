import { functionImports, importTest } from "imports/lib/imports.js"
import * as TokenizablePattern from "../../../../../../dist/src/Pattern/TokenizablePattern/utils.js"
importTest(functionImports("tokenizeString", "tokenizeMatched"))(TokenizablePattern)
