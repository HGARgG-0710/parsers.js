import { RecursiveArrayTree } from "../../../dist/main.js"

const tree = RecursiveArrayTree([
	8890,
	[[1123, true, [99009, []]], "Ceal", "Meril", [998]],
	[8889068, "SAel.?", [[[[[false]], ["???"]]]]]
])

console.log(tree)
console.log(tree.index([2, 2, 0, 0]))
console.log(tree.index([1, 3, 0]))
console.log(tree.index([0]))
console.log(tree.index([1, 3, 1]))
