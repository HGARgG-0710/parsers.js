import type { ValidationOutput } from "../../../../dist/src/Pattern/ValidatablePattern/interfaces.js"

import { arraysSame } from "lib/lib.js"
import { ValidatableStringPattern } from "../../../../dist/src/Pattern/ValidatablePattern/classes.js"
import { ValidatablePatternClassTest } from "./lib/classes.js"

// * ValidatableStringPattern

function adjacentPush(array: any[][], pushed: any[]) {
	array = structuredClone(array)
	for (let i = 0; i < pushed.length; ++i) array[i].push(pushed[i])
	return array
}

const validationRules = [
	[
		/B.*B/g,
		function (input: string) {
			let size = input.length
			if (size && !(size % 2)) return false
			while (size--)
				if (Math.floor(input[size].charCodeAt(0) / 10) % 2) return false
			return true
		}
	],
	[
		/EE./g,
		function (input: string) {
			if (!["D", "L", "K"].includes(input[2])) return false
			return true
		}
	]
] as [RegExp, (input: string) => boolean, ValidationOutput<string>?][]

const validationCompare = (x: ValidationOutput, y: ValidationOutput) =>
	x[0] === y[0] && arraysSame(x[1], y[1])

ValidatablePatternClassTest("ValidatableStringPattern", ValidatableStringPattern, [
	{
		input: "BABBBEEDEELEEKBAERB",
		flushResult: [false, []],
		validationInput: adjacentPush(validationRules, [
			[true, ["EEDEELEEK"]],
			[true, []]
		]) as [RegExp, (input: string) => boolean, ValidationOutput<string>][],
		resultCompare: validationCompare
	},
	{
		input: "BARBEED",
		flushResult: [false, []],
		validationInput: adjacentPush(
			[validationRules[0]],
			[[false, [[false, "BARB"], "EED"]]]
		) as [RegExp, (input: string) => boolean, ValidationOutput<string>][],
		resultCompare: validationCompare
	},
	{
		input: "BEROBEELEENEES",
		flushResult: [false, []],
		validationInput: adjacentPush(validationRules, [
			[true, ["EELEENEES"]],
			[false, [true, [false, "EEN"], [false, "EES"]]]
		]) as [RegExp, (input: string) => boolean, ValidationOutput<string>][],
		resultCompare: validationCompare
	}
])
