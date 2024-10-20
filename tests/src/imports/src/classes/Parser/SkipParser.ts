import { functionImports, importTest } from "imports/lib/imports.js"
import * as SkipParser from "../../../../../../dist/src/Parser/SkipParser/classes.js"
importTest(functionImports("SkipParser", "FixedSkipParser", "StreamParser"))(SkipParser)
