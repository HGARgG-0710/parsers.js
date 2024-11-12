import { EliminableClassTest } from "./lib/classes.js"
import { EliminableString } from "../../../dist/src/Eliminable/classes.js"

import { boolean } from "@hgargg-0710/one"
const { equals } = boolean

// * EliminableString

const origInput = "A, B, CADRRADDKIRAD, AABADIRKI"
EliminableClassTest("EliminableString", EliminableString, [
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
