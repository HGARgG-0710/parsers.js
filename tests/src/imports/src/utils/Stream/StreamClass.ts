import { functionImports, importTest } from "imports/lib/imports.js"
import * as StreamClass from "../../../../../../dist/src/Stream/StreamClass/utils.js"

importTest(
	functionImports(
		"superDelegate",
		"superInit",
		"isFinishable",
		"isNavigable",
		"isRewindable",
		"uniFinish",
		"fastFinish",
		"uniNavigate",
		"fastNavigate",
		"uniRewind",
		"fastRewind",
		"initCurr",
		"isCurrUnintialized",
		"start",
		"deStart",
		"end",
		"deEnd",
		"preInit",
		"createState",
		"realCurr",
		"getNext",
		"readBuffer",
		"getPrev"
	)
)("StreamClass", StreamClass)
