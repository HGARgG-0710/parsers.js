import {
	TokenType,
	Token,
	TokenInstance
} from "../../../dist/src/Token/classes.js"

import { isTokenTest, isTypeTest } from "./lib/utils.js"

// * isToken

isTokenTest(true, Token("S", 90))
isTokenTest(true, new (TokenType("R"))(false))

isTokenTest(false, new (TokenInstance("R"))())
isTokenTest(false, null)
isTokenTest(false, 20)
isTokenTest(false, "A")

// * isTypeTest

const object = {}

isTypeTest("Seal", Token("Seal", "lock"))
isTypeTest(object, Token(object, "something"))
