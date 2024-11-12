import { functionImports, importTest } from "imports/lib/imports.js"
import * as Eliminable from "../../../../../dist/src/Eliminable/methods.js"

importTest(functionImports("eliminableFlush", "eliminableStringEliminate"))(
	"Eliminable",
	Eliminable
)
