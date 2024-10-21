import { importTest, objectImports } from "imports/lib/imports.js"
import * as Stream from "../../../../../dist/src/Stream/utils.js"
importTest(objectImports("InputStream", "StreamClass"))(Stream)
