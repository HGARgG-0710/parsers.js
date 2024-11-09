import { functionImports, importTest } from "imports/lib/imports.js"
import * as Position from "../../../../../dist/src/Position/classes.js"
importTest(functionImports("MultiIndex", "MultiIndexModifier"))("Position", Position)
