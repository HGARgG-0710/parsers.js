import { utilTest } from "lib/lib.js"
import { regexCurriedTest, regexTest } from "./lib.js"

import { regex } from "../../../../dist/main.js"
const { bracket, non_bracket, capture, non_capture, named_capture, bref, named_bref } =
	regex.groups

export const [bracket_test, non_bracket_test] = [
	["bracket", bracket],
	["non_bracket", non_bracket]
].map(([name, util]) => utilTest(util as Function, name as string))

export const [capture_test, non_capture_test] = [
	["capture", capture],
	["non_capture", non_capture]
].map(([name, util]) => regexTest(name as string, util as Function))

export const [named_capture_test, bref_test, named_bref_test] = [
	["named_capture", named_capture, 1],
	["bref", bref, 1],
	["named_bref", named_bref, 1]
].map(([name, util, arity]) =>
	regexCurriedTest(name as string, util as Function, arity as number)
)
