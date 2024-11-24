import type { TokenType } from "../../../dist/src/Token/interfaces.js"

import {
	CurrentMap,
	Pairs,
	Pointer,
	TypeMap,
	TypeofMap,
	ValueMap
} from "../../../dist/src/IndexMap/classes.js"

import {
	BasicMap,
	PredicateMap
} from "../../../dist/src/IndexMap/LinearIndexMap/classes.js"

import { SimpleTokenType } from "../../../dist/src/Token/classes.js"
import { linearIndexMapEmptyTest } from "./lib/classes.js"
import { LinearMapClassTest } from "./LinearIndexMap/lib/classes.js"

// * TypeofMap, ValueMap

const object = {}

LinearMapClassTest("TypeofMap(ValueMap(BasicMap))", TypeofMap(ValueMap(BasicMap)), [
	{
		instance: [
			Pairs<string, any>(
				["string", 990],
				["number", -11],
				["boolean", null],
				["object", object]
			),
			70
		],
		indexTest: [
			[Pointer(29), -11],
			[Pointer(true), null],
			[Pointer("Sesame"), 990],
			[Pointer(function () {}), 70],
			[Pointer({ x: 99 }), object]
		],
		...linearIndexMapEmptyTest
	}
])

// * CurrentMap, TypeMap

const [A, B, C, D] = ["a", "b", "c", "d"].map(SimpleTokenType)
const withCurr = (curr: any) => ({ curr })

LinearMapClassTest(
	"TypeMap(CurrentMap(PredicateMap))",
	TypeMap(CurrentMap(PredicateMap)),
	[
		{
			instance: [Pairs<TokenType, any>([A, 10], [B, 20], [C, 30]), null],
			indexTest: [
				[withCurr(new B("?")), 20],
				[withCurr(new A(200)), 10],
				[withCurr(new D(null)), null],
				[withCurr(new C(true)), 30]
			],
			...linearIndexMapEmptyTest
		}
	]
)
