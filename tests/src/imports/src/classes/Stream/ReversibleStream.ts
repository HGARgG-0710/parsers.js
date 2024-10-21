import { functionImports, importTest } from "imports/lib/imports.js"
import * as ReversibleStream from "../../../../../../dist/src/Stream/ReversibleStream/classes.js"
importTest(functionImports("ReversedStream"))(ReversibleStream)
