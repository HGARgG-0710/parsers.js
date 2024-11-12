import { TokenizableClassTest } from "./lib/classes.js"
import { TokenizableString } from "../../../dist/src/Tokenizable/classes.js"
import { arraysSame } from "lib/lib.js"

import { classWrapper } from "../../../dist/src/utils.js"
import { SimpleTokenType } from "../../../dist/src/Token/classes.js"

import { isToken } from "../../../dist/src/Token/utils.js"

import { ConstEnum, TokenInstanceEnum } from "../../../dist/src/EnumSpace/classes.js"

import { typeof as type } from "@hgargg-0710/one"
const { isString } = type

// * TokenizableString

const [A, B, DC, Miss] = ["A", "B", "DC", "Miss"].map((name) =>
	classWrapper(SimpleTokenType<string, string>(name))
)

const [AI, KI, BI, COMMA] = TokenInstanceEnum(new ConstEnum(4)).map(classWrapper)

const finalTokenized = [
	A("A, "),
	B("BBB, "),
	DC("C, DCD, D, "),
	A("A, "),
	DC("D, C, "),
	B("B, "),
	A("A, A, A, A")
]

const tokenizedComparison = (x: any, y: any) =>
	arraysSame(
		x,
		y,
		(x: any, y: any) =>
			(isString(x) && isString(y) && x === y) ||
			(isToken(x) && isToken(y) && x.type === y.type && x.value === y.value)
	)

TokenizableClassTest("TokenizableString", TokenizableString, [
	{
		input: "A, BBB, C, DCD, D, A, D, C, B, A, A, A, A",
		tableEntries: [
			[
				/A(, A)*/g,
				A,
				[A("A, "), "BBB, C, D, D,", A("A, "), "D, C, B, ", A("A, A, A, A")]
			],
			[
				/(B(, )?)+/g,
				B,
				[
					A("A, "),
					B("BBB, "),
					"C, D, D, ",
					A("A, "),
					"D, C, ",
					B("B, "),
					A("A, A, A, A")
				]
			],
			[/((D|C)(, )?)+/g, DC, finalTokenized],
			[/Missing/g, Miss, finalTokenized]
		],
		resultCompare: tokenizedComparison,
		flushResult: []
	},
	{
		input: "AER, KAEL, BOOR",
		tableEntries: [
			["AER", AI, [AI(), ", KAEL, BOOR"]],
			[/K.*L/g, KI, [AI(), ", ", KI(), ", BOOR"]],
			[/BOOR/g, BI, [AI(), ", ", KI(), ", ", BI()]],
			[/, ?/g, COMMA, [AI(), COMMA(), KI(), COMMA(), BI()]]
		],
		flushResult: [],
		resultCompare: tokenizedComparison
	}
])
