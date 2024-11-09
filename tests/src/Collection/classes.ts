import type { Pattern } from "../../../dist/src/Pattern/interfaces.js"

import { CollectionClassTest } from "./lib/classes.js"
import {
	StringCollection,
	ArrayCollection,
	AccumulatingPatternCollection
} from "../../../dist/src/Pattern/Collection/classes.js"

import { arraysSame, stringSum } from "lib/lib.js"
import { Token } from "../../../dist/src/Pattern/Token/classes.js"

import { boolean, number, typeof as type } from "@hgargg-0710/one"
const { equals } = boolean
const { sum } = number
const { isObject } = type

// * StringCollection

const stringTestEndvalue = new Array(13)
	.fill(0)
	.map((_x, i) => String.fromCharCode(i + "A".charCodeAt(0)))
	.join("")

CollectionClassTest("StringCollection", StringCollection, [
	{
		input: "ABC",
		pushed: ["DEF", "GHIJ", "KLM"],
		expectedPushValue: stringTestEndvalue,
		pushCompare: equals,
		iteratedOver: stringTestEndvalue.split("")
	}
])

// * ArrayCollection

const arrayTestEndvalue = new Array(14).fill(0).map((_x, i) => i)

CollectionClassTest(
	"ArrayCollection",
	ArrayCollection,
	[
		{
			input: [1, 2, 3, 4],
			pushed: arrayTestEndvalue.slice(3),
			expectedPushValue: arrayTestEndvalue,
			pushCompare: arraysSame,
			iteratedOver: arrayTestEndvalue
		}
	],
	true
)

// * AccumulatingPatternCollection

const accumulatingPatternTestPushedNum = [1, 2, 3, 4]
const accumulatingPatternTestPushedStr = ["CDE", "FGHIJ", "KLMNOP"]
const patternCompare = <Type = any>(x: Pattern<Type>, y: Pattern<Type>) =>
	isObject<Pattern<number>>(y) && y.value === x.value
const valueCompare = <Type = any>(x: Pattern<Type>, y: Type) => x.value === y

CollectionClassTest("AccumulatingPatternCollection", AccumulatingPatternCollection, [
	{
		input: Token("COUNT", 0),
		pushed: accumulatingPatternTestPushedNum,
		expectedPushValue: sum(...accumulatingPatternTestPushedNum),
		pushCompare: valueCompare<number>,
		iteratedOver: [Token("COUNT", sum(...accumulatingPatternTestPushedNum))],
		iterationCompare: patternCompare<number>
	},
	{
		input: Token("STRVAL", "AB"),
		pushed: accumulatingPatternTestPushedStr,
		expectedPushValue: stringSum(...accumulatingPatternTestPushedStr),
		pushCompare: valueCompare<string>,
		iteratedOver: [
			Token("STRVAL", stringSum(...["AB"].concat(accumulatingPatternTestPushedStr)))
		],
		iterationCompare: patternCompare<string>
	}
])
