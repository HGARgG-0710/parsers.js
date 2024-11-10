import { functionImports, importTest } from "imports/lib/imports.js"
import * as Position from "../../../../../dist/src/Position/utils.js"

importTest(
	functionImports(
		"isPositionObject",
		"isPosition",
		"positionConvert",
		"positionNegate",
		"positionSame",
		"positionEqual",
		"directionCompare",
		"isBackward",
		"pickDirection",
		"preserveDirection",
		"positionStopPoint", 
		"positionNull", 
		"positionIncrement", 
		"positionDecrement"
	)
)("Position", Position)
