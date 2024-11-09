import { functionImports, importTest } from "imports/lib/imports.js"
import * as LayeredParser from "../../../../../../dist/src/Parser/LayeredParser/methods.js"
importTest(functionImports("layersGet", "layersSet"))("LayeredParser", LayeredParser)
