import {
	UnfreezableArray,
	UnfreezableString
} from "../../../../dist/src/Collection/Buffer/classes.js"

import { UnfreezableBufferClassTest } from "./lib/classes.js"

import { boolean } from "@hgargg-0710/one"
const { equals } = boolean

// * UnfreezableArray

UnfreezableBufferClassTest("UnfreezableArray", UnfreezableArray, [
	{
		input: ["A", "B", "C", "D"],
		readTests: [
			[1, "B"],
			[3, "D"],
			[2, "C"],
			[0, "A"]
		],
		pushed: ["K", "R", "L"],
		expectedPushValue: ["A", "B", "C", "D", "K", "R", "L"],
		pushCompare: equals,
		iteratedOver: ["A", "B", "C", "D", "K", "R", "L"]
	}
])

// * UnfreezableString

UnfreezableBufferClassTest("UnfreezableString", UnfreezableString, [
	{
		input: "Loss",
		readTests: [
			[0, "L"],
			[1, "o"],
			[2, "s"],
			[3, "s"]
		],
		pushed: [" ", "of", " ", "___"],
		expectedPushValue: "Loss of ___",
		pushCompare: equals,
		iteratedOver: ["L", "o", "s", "s", " ", "o", "f", " ", "_", "_", "_"]
	}
])
