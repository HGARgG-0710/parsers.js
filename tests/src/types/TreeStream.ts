import { ArrayTree, TreeStream } from "../../../dist/src/types.js"

const ts = TreeStream(
	ArrayTree([
		0,
		1,
		[
			2,
			[
				3,
				[4, [5, 6, 7], [8, [9, 10, [11, 12, 13], 14], 15], 16],
				[17, [18, 19, 20]],
				21
			],
			22,
			[23, [24, 25, [26, 27, 28, 29]], 30],
			31,
			32,
			[33, 34, [35, 36, 37]],
			38,
			39
		],
		[[[40, 41, 42]]],
		43
	])
)

while (!ts.isEnd()) {
	console.log(ts.curr())
	ts.next()
}

console.log(ts.next())
console.log(ts.next())
console.log(ts.curr())

console.log("\n\n\n")

console.log(ts.prev())
console.log(ts.prev())

// * 'prev' siblings
console.log(ts.prev())
console.log(ts.prev())
console.log(ts.prev())

// * 'prev'-'next' siblings
console.log(ts.next())
console.log(ts.prev())

// * 'prev' levels
console.log(ts.prev())
console.log(ts.prev())
console.log(ts.prev())
console.log(ts.curr())

// * 'prev'-'next' levels
console.log(ts.next())
console.log(ts.prev())
console.log(ts.prev())
console.log(ts.prev())
console.log(ts.curr())

// * 'until the first "complete surfacing"'
console.log()
while (ts.curr() != 0) console.log(ts.prev())
console.log(ts.prev())
console.log(ts.prev())
console.log(ts.prev())

console.log("\n\n\n")

// * 'rewind'
while (!ts.isEnd()) ts.next()
ts.rewind?.()
console.log(ts.curr())
