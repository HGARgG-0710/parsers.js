import { functionImports, importTest, objectImports } from "imports/lib/imports.js"

import * as Collection from "../../../../../dist/src/Collection/methods.js"

importTest(functionImports("collectionIterator").concat(objectImports("Buffer")))(
	"Collection",
	Collection
)
