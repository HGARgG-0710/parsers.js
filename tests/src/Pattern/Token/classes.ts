import { TokenInstanceTest, TokenTest, TokenTypeTest } from "./lib/classes.js"

// * Token
TokenTest([
	["2009l", 9],
	[20, true],
	[{ X: 909 }, { G: { R: { B: 101 } } }]
])

// * SimpleTokenType
TokenTypeTest([
	["C", ["M", 0, { S: 9090 }]],
	[{ Tar: 1909 }, [null, "TEEA", true]]
])

// * TokenInstance

TokenInstanceTest([
	["Siegbrau", 20],
	[{ R: "90" }, 5]
])
