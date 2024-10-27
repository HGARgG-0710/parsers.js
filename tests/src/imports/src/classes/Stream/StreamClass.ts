import { functionImports, importTest } from "imports/lib/imports.js";
import * as StreamClass from "../../../../../../dist/src/Stream/StreamClass/classes.js"
importTest(functionImports("StreamClass", "Stateful", "Inputted"))(StreamClass)