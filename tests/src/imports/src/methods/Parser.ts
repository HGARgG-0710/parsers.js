import { importTest, objectImports } from "imports/lib/imports.js"
import * as Parser from "../../../../../dist/src/Parser/methods.js"
importTest(objectImports("LayeredParser"))("Parser", Parser)
