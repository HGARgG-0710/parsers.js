import { SourceBuilder } from "../../../dist/src/classes.js"
import { TestCounter } from "../lib.js"
import { TestTypes, sourceBuilderTest } from "./lib.js"

const sourceBuilderTestCounter = new TestCounter(
	([isFrozen, categoryCounter]: [number, number]) =>
		`SourceBuilder (#${isFrozen}.${categoryCounter})`
)

sourceBuilderTestCounter.test(
	[TestTypes.NON_FROZEN],
	() =>
		sourceBuilderTest.withInstance(new SourceBuilder(), function (test) {
			test.copy()
			test.get("")
			test.push(["abc", "def", "meow"], "abcdefmeow")
			test.freeze()
			test.isFrozen(false)
			test.clear()
		}),
	true
)

sourceBuilderTestCounter.test(
	[TestTypes.NON_FROZEN],
	() =>
		sourceBuilderTest.withInstance(
			new SourceBuilder("abcd"),
			function (test) {
				test.copy()
				test.clear()
				test.push(["efg", "hij"], "abcdefghij")
				test.isFrozen(false)
			}
		),
	true
)

sourceBuilderTestCounter.test(
	[TestTypes.FROZEN],
	() =>
		sourceBuilderTest.withInstance(
			new SourceBuilder("abcde").freeze(),
			function (test) {
				test.copy()
				test.push(["some", "more", "stuff"], "abcde")
				test.unfreeze()
				test.isFrozen(true)
				test.clear()
			}
		),
	true
)
