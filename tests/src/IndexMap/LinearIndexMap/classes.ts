import { LinearMapClassTest } from "./lib/classes.js"
import {
	BasicMap,
	PredicateMap,
	RegExpMap,
	SetMap,
	OptimizedLinearMap
} from "../../../../dist/src/IndexMap/LinearIndexMap/classes.js"

import { typeof as _typeof } from "@hgargg-0710/one"
import type { Pairs } from "../../../../dist/src/IndexMap/interfaces.js"
const { isNumber, isString, isObject, isNull } = _typeof

// * LinearPredicateMap

// TODO [how to construct tables]:
// * 1. Make one test for a full table;
// * 2. Check for overlapping of values ("missed" values);
// * 3. The rest is "as usual";

// * 4. after the "main" (full-table) test is done, ONLY check the '.extension' property, MEANING

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
] as Pairs<Function, any>

const predicateTableDefault = true

LinearMapClassTest("PredicateMap", PredicateMap, [
	{
		instance: [predicateTableEntries, predcateTableDefault],
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
		]
	}
])

// * LinearRegExpMap

LinearMapClassTest("RegExpMap", RegExpMap, [])

// * LinearSetMap

LinearMapClassTest("SetMap", SetMap, [])

// * LinearBasicMap

LinearMapClassTest("BasicMap", BasicMap, [])

// * OptimizedLinearMap

LinearMapClassTest("OptimizedLinearMap", OptimizedLinearMap, [])
