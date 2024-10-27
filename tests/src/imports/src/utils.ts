import { functionImports, importTest, specificChildImports } from "imports/lib/imports.js"
import * as utils from "../../../../dist/src/utils.js"

importTest(
	specificChildImports.toplevel.concat(
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
		)
	)
)(utils)
