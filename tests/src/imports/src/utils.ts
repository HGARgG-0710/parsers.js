import { functionImports, importTest, objectImports } from "imports/lib/imports.js"
import * as utils from "../../../../dist/src/utils.js"

importTest(
	functionImports(
		"isHex",
		"next",
		"previous",
		"current",
		"output",
		"input",
		"wrapper",
		"is",
		"isEnd",
		"isStart",
		"destroy",
		"forward",
		"skipArg",
		"preserve",
		"miss",
		"firstStream",
		"eq",
		"inSet",
		"backtrack",
		"calledDelegate",
		"delegate",
		"thisReturningDelegate",
		"delegateProperty",
		"classWrapper",
		"AssignmentClass",
		"SelfAssignmentClass"
	).concat(objectImports())
)(utils)
