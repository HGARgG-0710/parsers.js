import { importTest, objectImports, specificChildImports } from "imports/lib/imports.js"
import * as Stream from "../../../../../dist/src/Stream/methods.js"

importTest(
	objectImports(...specificChildImports.Stream.concat(["StreamParser", "TreeStream"]))
)("Stream", Stream)
