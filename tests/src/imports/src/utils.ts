import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as utils from "../../../../dist/src/utils.js"

importTest(
	functionImports(
		"isHex",
		"next",
		"previous",
		"current",
		"wrapped",
		"is",
		"isEnd",
		"isStart",
		"destroy",
		"preserve",
		"eq",
		"inSet",
		"backtrack",
		"length",
		"size",
		"calledDelegate",
		"delegate",
		"thisReturningDelegate",
		"delegateProperty",
		"classWrapper",
		"AssignmentClass",
		"SelfAssignmentClass",
		"getSetDescriptor",
		"state",
		"buffer"
	).concat(objectImports())
)("utils", utils)
