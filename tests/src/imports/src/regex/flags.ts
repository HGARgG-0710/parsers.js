import { functionImports, importTest } from "imports/lib/imports.js"
import * as flags from "../../../../../dist/src/regex/flags.js"
importTest(functionImports("with_flags", "g", "u", "d", "i", "m", "v", "s", "y"))(flags)
