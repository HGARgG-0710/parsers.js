import test from "node:test"
import { MixinTest } from "./lib/classes.js"

test("mixin (#1)", () => {
	const constructor = function () {}
	new MixinTest({ name: "Test1", properties: {}, constructor }).toClass({
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
// ! -2. - NEW TEST: for `mixin.toClass()`-results' instances. A new class - AnonymousClassTest - accepts an anonymous class and some (basic) formats for testing behaviours.
// 		^ USE IT with the `mixin` tests. Each `mixinTested = new mixin(...)` call also should
// 		^ spawn a `anonTest = new AnonymousClassTest(...)` call.
// 		^ And `anonTest` will run against an INSTANCE of `mixinTested.toClass()`
// ! -1. - NEW TEST: one that DOES NOT use a `.constructor` [PureMixinTest]:
// 		* 1. assigns the `.constructor` to be THE SAME on the resulting `expectedPrototypeDescriptors` [ignores it for that check, basically]
// 		* 2. SAME algorithm as with `MixinTest`
// 		* 3. CHECKING that the "String(.constructor)" is THE SAME as "function () {}" [hard-coding the verification, since it's supposed to hold for all];
// * 0 non-empty .constructor [no .properties]
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
