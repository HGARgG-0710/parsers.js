import { ArrayTree } from "../src/types.mjs"

const checkA = (x) => "index" in x && "children" in x
const checkB = (x) => x.children()
const checkC = (x, ind) => x.index(ind)

const testCases = [
	["x", "y", ["z", [true, false, null, [11, []]], 177]],
	[],
	["X", "Y", "Z"]
].map(ArrayTree)

const indexes = [[2, 1, 3, 0], [3], [2]]

testCases.forEach((x) => console.log(x))
console.log()

testCases.forEach((x) => console.log(checkA(x)))
console.log()

testCases.forEach((x) => console.log(checkB(x)))
console.log()

testCases.forEach((x, i) => console.log(checkC(x, indexes[i])))
console.log()
