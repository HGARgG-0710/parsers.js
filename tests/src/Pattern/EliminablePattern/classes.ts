import { EliminablePatternClassTest } from "./lib/classes.js"
import { EliminableStringPattern } from "../../../../dist/src/Pattern/EliminablePattern/classes.js"

import { boolean } from "@hgargg-0710/one"
const { equals } = boolean

// * EliminableStringPattern

const origInput = "A, B, CADRRADDKIRAD, AABADIRKI"
EliminablePatternClassTest("EliminableStringPattern", EliminableStringPattern, [
	{
		input: origInput,
		toEliminate: [
			[", ", "ABCADRRADDKIRADAABADIRKI"],
			["AD", "ABCRRDKIRAABIRKIR"],
			["KIR", "ABCRRDAABIR"]
		],
		flushResult: origInput,
		resultCompare: equals
	}
])
