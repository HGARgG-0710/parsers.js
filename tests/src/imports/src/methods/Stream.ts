import { importTest, specificChildImports } from "imports/lib/imports.js"
import * as Stream from "../../../../../dist/src/Stream/methods.js"
importTest(specificChildImports.Stream)(Stream)
