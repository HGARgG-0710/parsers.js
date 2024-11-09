import {  importTest, objectImports } from "imports/lib/imports.js"
import * as Position from "../../../../../dist/src/Position/methods.js"
importTest(objectImports("MultiIndex"))("Position", Position)
