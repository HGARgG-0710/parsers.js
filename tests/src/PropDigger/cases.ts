import { boolean } from "@hgargg-0710/one"
import { PropDigger } from "../../../dist/src/classes.js"
import { TestCounter } from "../lib.js"
import { propDiggerTest } from "./lib.js"

const { T } = boolean

const propDiggerTestCounter = new TestCounter(
	([categoryCount]: [number]) => `PropDigger (#${categoryCount})`
)

propDiggerTestCounter.test(
	[],
	() =>
		propDiggerTest.withInstance(new PropDigger("a"), function (test) {
			test.copy()
			test.with(["b"])
			test.with(["b", "c", "d"])
			test.properties(["a"])

			const inner1 = { a: 19 }
			const inner2 = { b: null }

			test.digFinite({ a: 7 }, 1, 7)
			test.digFinite({ a: { a: { a: inner1 } } }, 3, inner1)
			test.digFinite({ a: { a: true } }, 7, true)

			test.digPredicate({ a: { a: { a: { a: 17 } } } }, T, 17)
			test.digPredicate(
				{ a: { a: { a: inner2, b: true }, b: false } },
				(x) => !("b" in x) || x.b !== null,
				inner2
			)
		}),
	true
)

propDiggerTestCounter.test(
	[],
	() =>
		propDiggerTest.withInstance(
			new PropDigger("a", "b", "c"),
			function (test) {
				test.copy()
				test.with(["d", "e", "f"])
				test.with(["d", "e", "f", "g", "h"])
				test.properties(["a", "b", "c"])

				const inner1 = { a: { b: { c: 999 } } }

				test.digFinite({ a: { b: { c: 5 } } }, 1, 5)
				test.digFinite({ a: { b: { c: { a: false } } } }, 2, false)
				test.digFinite(
					{
						a: {
							b: {
								c: {
									a: { b: { c: { a: { b: { c: inner1 } } } } }
								}
							}
						}
					},
					3,
					inner1
				)

				const inner2 = { a: 9, b: 10, c: 11 }

				test.digPredicate(
					{ a: { b: { c: { a: { b: "?" } } } } },
					T,
					"?"
				)

				test.digPredicate(
					{ a: { a: {}, b: { c: { a: inner2 } } } },
					(x) =>
						["a", "b", "c"].map((y) => y in x).filter((x) => x)
							.length <= 2,
					inner2
				)
			}
		),
	true
)
