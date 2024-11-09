import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as Collection from "../../../../../dist/src/Collection/classes.js"
importTest(functionImports("ArrayCollection").concat(objectImports("Buffer")))(
	"Collection",
	Collection
)
