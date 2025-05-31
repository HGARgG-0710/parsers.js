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

// TODO [any order]:
// * 0 non-empty .constructor
// * 1. [.properties] getter + setter test
// * 2. [.properties] getter-only test
// * 3. [.properties] setter-only test
// * 4. [.properties] method test
// * 5. [.properties] state variables (default props) test
// * 6. [.properties] state-vars + methods + getter(s) + setter(s) test
// * 7. [.properties] CONSTRUCTOR + state-vars + methods + getter(s) + setter(s) test
// * 8. class parent + [.properties] CONSTRUCTOR + state-vars + methods + getter(s) + setter(s) test
// * 9. mixin parent + [.properties] CONSTRUCTOR + state-vars + methods + getter(s) + setter(s) test
// * 10. class parent + mixin parent + [.properties] CONSTRUCTOR + state-vars + methods + getter(s) + setter(s) test