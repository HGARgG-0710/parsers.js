import {
	LinearMapClassTest,
	type ReducedLinearMapClassTestSignature
} from "./lib/classes.js"

import {
	BasicMap,
	PredicateMap,
	RegExpMap,
	SetMap,
	OptimizedLinearMap
} from "../../../../dist/src/IndexMap/LinearIndexMap/classes.js"

import { linearIndexMapEmptyTest } from "../lib/classes.js"

import { type, array } from "@hgargg-0710/one"
const { isNumber, isString, isObject, isNull, isBoolean } = type

// * PredicateMap

const predicateTableEntries = [
	[(x: any) => isNumber(x) && x > 10, 8],
	[(x: any) => isString(x) && x.length > 9, "long"],
	[
		(x: any) =>
			((isObject(x) && "length" in x) || isString(x)) &&
			isNumber(x.length) &&
			(x.length > 11 || x.length < 4),
		"not-long"
	],
	[(x: any) => isNull(x), "BOO!"]
] as array.Pairs<Function, any>

const predicateTableDefault = true

const predicateTableAddTests = [
	[1, [(x: any) => isNumber(x) && x < 3, "S"]],
	[5, [(x: any) => isString(x) && x.length > 0, 990]],
	[6, predicateTableEntries[3]],
	[5, predicateTableEntries[1]]
] as [number, [Function, any]][]

const predicateTableSetArgs = [
	[predicateTableEntries[0][0], "X"],
	[predicateTableAddTests[1][1][0], true]
] as [Function, any][]

const predicateTableReplaceTests = [
	[2, [(x: any) => isBoolean(x), false]],
	[1, [(x: any) => !x || x === -90, 20]]
] as [number, [Function, any]][]

const predicateTableReplaceKeys = [
	[predicateTableAddTests[1][1][0], predicateTableEntries[2][0]],
	[predicateTableReplaceTests[0], predicateTableEntries[0][0]]
] as [Function, Function][]

const predicateTableTestSignature = {
	getIndexTest: [
		[10, -1],
		[null, 3],
		[11, 0],
		["This is a string considered long", 1],
		["JOE", 2],
		[true, -1],
		[{ length: 900 }, 2]
	],
	indexTest: [
		[10, true],
		[null, "BOO!"],
		[11, 8],
		["This is a string considered long", "long"],
		["JOE", "not-long"],
		[true, true],
		[{ length: 900 }, "not-long"]
	],
	byIndexTest: [
		[2, predicateTableEntries[2]],
		[1, predicateTableEntries[1]],
		[-4, predicateTableDefault],
		[-1, predicateTableDefault],
		[0, predicateTableEntries[0]],
		[3, predicateTableEntries[3]]
	],
	addTests: predicateTableAddTests,
	deleteInds: [3, 3, 1],
	setArgs: predicateTableSetArgs,
	uniqueTest: [
		predicateTableEntries[0],
		predicateTableEntries[1],
		predicateTableAddTests[1][1]
	],
	swapIndicies: [
		[0, 1],
		[0, 2],
		[1, 2]
	],
	replaceTests: predicateTableReplaceTests,
	replaceKeys: predicateTableReplaceKeys
} as ReducedLinearMapClassTestSignature<Function, any>

LinearMapClassTest("PredicateMap", PredicateMap, [
	{
		instance: [predicateTableEntries, predicateTableDefault],
		...predicateTableTestSignature,
		furtherSignature: {
			...predicateTableTestSignature,
			isCopyTest: false
		}
	}
])

// * RegExpMap

LinearMapClassTest("RegExpMap", RegExpMap, [
	{
		instance: [
			[
				[/201?0+/g, "Ro"],
				[/AZ*OR/g, "Ka"],
				[/201?0+b*/g, "Moo"]
			]
		],
		indexTest: [
			["200", "Ro"],
			["200b", "Moo"],
			["S", undefined],
			["AZZZZOR", "Ka"],
			["20100000bbbbbb", "Moo"],
			["20100000", "Ro"]
		],
		...linearIndexMapEmptyTest
	}
])

// * SetMap

LinearMapClassTest("SetMap", SetMap, [
	{
		instance: [
			[
				[new Set(["90", 23, true, false]), -11],
				[new Set(["442", "X", "boolean"]), 0],
				[new Set(["90", 23, true, null, "Cap"]), 20]
			],
			false
		],
		indexTest: [
			["X", 0],
			["90", -11],
			[null, 20],
			["R", false],
			["X", 0],
			[true, -11],
			["Cap", 20],
			["boolean", 0],
			["443", false]
		],
		...linearIndexMapEmptyTest
	}
])

// * BasicMap

const simpleMapTest = {
	instance: [
		[
			["R", 70],
			[true, 80],
			[false, -3],
			[null, true],
			["SKI", 20],
			["R", 20]
		]
	] as [array.Pairs<any, any>],

	indexTest: [
		["R", 70],
		["R", 70],
		[false, -3],
		["R", 70],
		[true, 80],
		["SKI", 20],
		[true, 80],
		["SKI", 20]
	] as array.Pairs<any, any>,

	...linearIndexMapEmptyTest
}

LinearMapClassTest("BasicMap", BasicMap, [simpleMapTest])

// * OptimizedLinearMap

LinearMapClassTest("OptimizedLinearMap", OptimizedLinearMap, [simpleMapTest])
