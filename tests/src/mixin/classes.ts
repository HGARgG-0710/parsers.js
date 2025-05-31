import test from "node:test"
import { MixinTest } from "./lib/classes.js"

test("mixin (#1)", () => {
	const constructor = function () {}
	new MixinTest({ constructor }).toClass({
		constructor: {
			value: constructor,
			writable: true,
			enumerable: false,
			configurable: true
		},
		super: {
			value: {},
			writable: true,
			enumerable: true,
			configurable: true
		}
	})
})
