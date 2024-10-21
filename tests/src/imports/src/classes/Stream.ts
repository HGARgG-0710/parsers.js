import { importTest, specificChildImports } from "imports/lib/imports.js"
import * as Stream from "../../../../../dist/src/Stream/classes.js"
importTest(specificChildImports.Stream)(Stream)
