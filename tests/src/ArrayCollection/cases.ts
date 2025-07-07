import { ArrayCollection } from "../../../dist/src/classes.js"
import { TestCounter } from "../lib.js"
import { arrayCollectionTest } from "./lib.js"

const arrayCollectionTestCounter = new TestCounter(
	([categoryCount]: number[]) => `ArrayCollection (#${categoryCount})`
)

arrayCollectionTestCounter.test(
	[],
	() =>
		arrayCollectionTest<number>().withInstance(
			new ArrayCollection(),
			function (test) {
				test.copy(2)
				test.iterator([])
				test.init([1, 2, 3])
				test.get([])
				test.write(0, 3)
				test.push([11, 12, 13])
				test.size(0)
			}
		),
	true
)

arrayCollectionTestCounter.test(
	[],
	() =>
		arrayCollectionTest<string>().withInstance(
			new ArrayCollection(["Aa", "Bb", "Cc", "Dd"]),
			function (test) {
				test.copy("Mm")
				test.iterator(["Aa", "Bb", "Cc", "Dd"])
				test.init(["One", "Two", "Three"])
				test.get(["Aa", "Bb", "Cc", "Dd"])

				test.write(3, "A")
				test.write(2, "Kk")
				test.write(1, "L")
				test.write(0, "Ss")

				test.read(1, 3, ["Bb", "Cc"])
				test.read(0, 4, ["Aa", "Bb", "Cc", "Dd"])
				test.read(2, 4, ["Cc", "Dd"])

				test.push(["Ee", "Ff", "Gg"])
				test.size(4)
			}
		),
	true
)
