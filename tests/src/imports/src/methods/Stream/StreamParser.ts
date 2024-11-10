import { functionImports, importTest } from "imports/lib/imports.js"
import * as StreamParser from "../../../../../../dist/src/Stream/StreamParser/methods.js"
importTest(functionImports("streamParserNext", "streamParserInitialize"))(
	"StreamParser",
	StreamParser
)
