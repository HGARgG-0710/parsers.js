import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as StreamClass from "../../../../../../dist/src/Stream/StreamClass/methods.js"

importTest(
	functionImports("streamIterator").concat(
		objectImports("curr", "init", "next", "prev", "finish", "rewind", "navigate")
	)
)("StreamClass", StreamClass)
