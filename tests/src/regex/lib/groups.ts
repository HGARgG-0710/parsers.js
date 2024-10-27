import { utilTest } from "lib/lib.js"
import { regex } from "../../../../dist/main.js"
import { elementaryRegexTest } from "./lib.js"
const { bracket, non_bracket, capture, non_capture, named_capture, bref, named_bref } =
	regex.groups

export const [bracket_test, non_bracket_test] = [
	["bracket", bracket],
	["non_bracket", non_bracket]
].map(([name, util]) => utilTest(util as Function, name as string))

export const [capture_test, non_capture_test, named_capture_test, bref_test] = [
	["capture", capture],
	["non_capture", non_capture],
	["named_capture", named_capture],
	["bref", bref],
	["named_bref", named_bref]
].map(([name, util]) => elementaryRegexTest(name as string, util as Function))
