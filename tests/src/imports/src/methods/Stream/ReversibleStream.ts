import { functionImports, importTest } from "imports/lib/imports.js"
import * as ReversibleStream from "../../../../../../dist/src/Stream/ReversibleStream/methods.js"
importTest(functionImports("reversedStreamInitialize"))(
	"ReversibleStream",
	ReversibleStream
)
