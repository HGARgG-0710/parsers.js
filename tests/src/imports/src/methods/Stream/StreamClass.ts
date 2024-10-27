import { functionImports, importTest } from "imports/lib/imports.js"
import * as StreamClass from "../../../../../../dist/src/Stream/StreamClass/methods.js"

importTest(
	functionImports(
		"posNextHandler",
		"posPrevHandler",
		"nextHandler",
		"prevHandler",
		"currSetter",
		"baseCurr",
		"trivialInitialize",
		"posInitialize",
		"preInitPosInitialize",
		"preInitInitialize",
		"baseStreamInitialize",
		"finish",
		"streamIterator",
		"navigate",
		"rewind",
		"inputDelegate",
		"inputPropDelegate",
		"inputPrev",
		"inputNext",
		"inputIsEnd",
		"inputIsStart",
		"inputRewind",
		"inputFinish",
		"inputCurr",
		"inputDefaultIsEnd",
		"inputDefaultIsStart"
	)
)(StreamClass)
