import { functionImports, importTest } from "imports/lib/imports.js"
import * as LayeredFunction from "../../../../../../dist/src/Parser/LayeredFunction/methods.js"
importTest(functionImports("layersGet", "layersSet"))("LayeredFunction", LayeredFunction)
