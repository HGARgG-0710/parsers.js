import { regexCurriedTest, regexTest } from "./lib.js"

import { regex } from "../../../../dist/main.js"

const { capture, non_capture, named_capture, backref, named_backref } =
	regex.groups

export const [capture_test, non_capture_test] = [
	["capture", capture],
	["non_capture", non_capture]
].map(([name, util]) => regexTest(name as string, util as Function))

export const [named_capture_test, bref_test, named_bref_test] = [
	["named_capture", named_capture, 1],
	["bref", backref, 1],
	["named_bref", named_backref, 1]
].map(([name, util, arity]) =>
	regexCurriedTest(name as string, util as Function, arity as number)
)
