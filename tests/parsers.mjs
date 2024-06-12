// * tests related to parsers;

// % This test implements a simple 4-element grammar. It is the following:
// * 'COL' for 'Collection'
// * 'CEL' for 'collection-element';
// * 'OP' for operator;
// * 'E' is the end of a collection;

import {
	BasicMap,
	InputStream,
	RegExpMap,
	StringPattern,
	Token,
	TokenMap,
	RecursiveArrayToken,
	StringSource,
	TreeStream,
	ArrayTree
} from "../src/types.mjs"
import {
	StreamTokenizer,
	PatternTokenizer,
	StreamParser,
	delimited,
	eliminate,
	skip
} from "../src/parsers.mjs"
import { PatternValidator, StreamValidator } from "../src/validate.mjs"

import { SourceGenerator } from "../src/reverse.mjs"

const [collection, element, operator, end] = [
	"collection",
	"element",
	"operator",
	"end"
].map((x) => () => Token(x, null))

// % For Stream-tokenization;
const streamTokens = BasicMap(
	new Map([
		[
			"C",
			function (input) {
				input.next()
				if (input.curr() === "O") {
					input.next()
					return collection()
				}
				input.next()
				return element()
			}
		],
		["O", operator],
		["E", end]
	])
)

// % for Pattern-tokenization;
const regexTokens = RegExpMap(
	new Map([
		[/COL/g, collection],
		[/CEL/g, element],
		[/OP/g, operator],
		[/E/g, end]
	])
)

// % For Stream-Parsing...;
const parserMap = TokenMap(BasicMap)(
	new Map([
		[
			"collection",
			function (input, parser) {
				return [
					Token(
						"collection",
						delimited(
							[1, (input, i) => input.curr().type !== "end"],
							() => false
						)(input, parser)
					)
				]
			}
		],
		["element", (input) => [input.curr()]],
		["operator", (input) => [input.curr()]],
		["end", (input) => [input.curr()]]
	])
)

// % For Stream-validation...;
function streamValidationMap() {
	let depth = 0
	return BasicMap(
		new Map([
			[
				"C",
				function (input) {
					input.next()
					const isCollection =
						input.curr() === "O" ? true : input.curr() === "E" ? false : null
					if (isCollection === null) return false
					input.next()
					const r = input.curr() === "L"
					if (r && isCollection) depth++
					return r
				}
			],
			[
				"O",
				function (input) {
					input.next()
					return input.curr() === "P"
				}
			],
			[
				"E",
				function () {
					if (depth <= 0) return false
					depth--
					return true
				}
			]
		])
	)
}

// % for pattern validation - NOTE: this ONLY checks for correctness token-wise (unlike the 'streamValidator' above, which checks for complete correctness);
const patternValidationMap = RegExpMap(
	new Map([
		[/COL/g, () => true],
		[/CEL/g, () => true],
		[/OP/g, () => true],
		[/E/g, () => true]
	])
)

const generationMap = TokenMap(BasicMap)(
	new Map([
		[
			"collection",
			function (input, generator) {
				const collection = input.next()
				let result = StringSource("COL")
				for (const _x of collection) {
					result = result.concat(generator(input))
					input.next()
				}
				return result.concat(StringSource("E"))
			}
		],
		["element", () => StringSource("CEL")],
		["operator", () => StringSource("OP")]
	])
)

const tests = [
	"CELOPOPCELOPCELCOLCELOPCELCOLCELEE",
	"ECELCOLE",
	"COLEIAMSYNTACTICALLYINCORRECT!"
]

const streamTokenizer = StreamTokenizer(streamTokens)
const patternTokenizer = PatternTokenizer(regexTokens)
const streamParser = StreamParser(parserMap)
const streamValidator = StreamValidator(streamValidationMap())
const patternValidator = PatternValidator(patternValidationMap)
const sourceGenerator = SourceGenerator(generationMap)

tests.forEach((x) => console.log(streamValidator(InputStream(x))))
console.log()

tests.forEach((x) => console.log(patternValidator(StringPattern(x))))
console.log()

tests.forEach((x) => console.log(streamParser(streamTokenizer(InputStream(x)))))
console.log()

tests.forEach((x) => console.log(patternTokenizer(StringPattern(x))))
console.log()

const outTest = streamParser(streamTokenizer(InputStream(tests[0]))).map(
	RecursiveArrayToken
)
console.log(sourceGenerator(TreeStream(ArrayTree(outTest)), StringSource()).value)
console.log()

console.log(
	eliminate(["K", /x|y/g, "SIEGBRAU!"])(
		StringPattern("17171KKxyKyKxKKxKKLOGOGOGOSIEGBRAU!")
	)
)
console.log()

const skipString = "LAR012340124015016a97a27a54a99K"
const skipTest = InputStream(skipString)
console.log(skipString)
console.log(skip(skipTest)(4))
console.log(skipTest.curr())
console.log(skip(skipTest)((input, i) => input.curr().charCodeAt(0) < 97))
console.log(skipTest.curr())
console.log(skip(skipTest)((input, i) => input.curr().charCodeAt(0) <= 97))
console.log(skipTest.isEnd())

console.log()

// ! TEST THE 'delimited' (properly...);
const delimString = "SKAR,Rag;LUFF;MURR\nTORK\n;DORK;SIEG"
const delimTest = InputStream(delimString)
console.log(
	delimited(
		[(input, i) => input.curr() !== "M", (input, i) => input.curr() !== "D"],
		(input, i) => {
			console.log("Inside 'isdelim'!")
			console.log(input.curr())
			console.log(i)
			console.log()
			return [",", ";", "\n"].includes(input.curr())
		}
	)(delimTest, (input, i) => {
		console.log("Inside 'handler'!")
		console.log(input.curr())
		console.log(i)
		console.log()
		return [input.curr()]
	})
)
console.log(delimTest.curr())
