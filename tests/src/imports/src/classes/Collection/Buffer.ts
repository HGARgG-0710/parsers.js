import { functionImports, importTest } from "imports/lib/imports.js"
import * as Buffer from "../../../../../../dist/src/Collection/Buffer/classes.js"
importTest(functionImports("UnfreezableArray", "UnfreezableString"))("Buffer", Buffer)
