import { functionImports, importTest } from "imports/lib/imports.js"
import * as InputStream from "../../../../../../dist/src/Stream/InputStream/utils.js"
importTest(functionImports("toInputStream"))(InputStream)
