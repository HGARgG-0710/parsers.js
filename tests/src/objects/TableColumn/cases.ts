import { TableColumn } from "../../../dist/src/classes.js"
import { TestCounter } from "../lib.js"
import { tableColumnTest } from "./lib.js"

const tableColumnTestCounter = new TestCounter(
	([categoryCount]: number[]) => `TableColumn (#${categoryCount})`
)

tableColumnTestCounter.test(
	[],
	() =>
		tableColumnTest<string>().withInstance(
			new TableColumn(),
			function (test) {
				test.copy()
				test.size(0)
				test.get([])
				test.insert(0, "A")
				test.reverse([])
				test.map([], [])
				test.push("BACDEF")
				test.indexOf("K", -1)
				test.indexOf("A", -1)
				test.reset(["A", "B", "C", "D"])
			}
		),
	true
)

tableColumnTestCounter.test(
	[],
	() =>
		tableColumnTest<number>().withInstance(
			new TableColumn([1, 2, 3, 4, 5]),
			function (test) {
				test.copy()
				test.size(5)
				test.get([1, 2, 3, 4, 5])

				test.set(4, 11)
				test.set(3, 45)
				test.set(2, 5)
				test.set(1, 11)
				test.set(0, 3)

				test.insert(2, 3)
				test.insert(5, -1)
				test.insert(0, 11)

				test.reverse([5, 4, 3, 2, 1])

				test.swap(0, 3)
				test.swap(1, 2)
				test.swap(4, 1)

				test.map([0, 1, 2], [1, 2, 3])
				test.map([], [])
				test.map([4, 2, 0], [5, 3, 1])

				test.push([11])
				test.push([16, -3, -1, -5, 6])

				test.indexOf(5, 4)
				test.indexOf(4, 3)
				test.indexOf(3, 2)
				test.indexOf(2, 1)
				test.indexOf(1, 0)

				test.indexOf(0, -1)
				test.indexOf(-1, -1)
				test.indexOf(-2, -1)

				test.delete(3)
				test.delete(0)

				test.delete(3, 2)
				test.delete(1, 4)
				test.delete(0, 5)

				test.delete(3, 5)
				test.delete(0, 7)

				test.reset([6, 7, 8, 9])

				test.read(0, 5, [1, 2, 3, 4, 5])
				test.read(1, 3, [2, 3])
				test.read(3, 4, [4])
			}
		),
	true
)
