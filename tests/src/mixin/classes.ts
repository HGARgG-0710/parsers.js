import test from "node:test"
import { MixinTest, PureMixinTest } from "./lib/classes.js"

test("mixin (#0)", () =>
	new PureMixinTest({ name: "Test0", properties: {} }).toClass({
		super: {
			value: {},
			writable: true,
			enumerable: true,
			configurable: true
		}
	}))

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

// ! enumeration order of tests [for TestCounter]: 
// * a.b.c
// a = has constructor [0] vs. no-constructor [1]
// b = no no parents [0] vs. has class-parents [1] vs. has mixin-parents [2] vs. has both mixin- and class-parents [3]
// c = just the test number in the given category
// ! CREATE constants for this [in mixin/lib/classes.ts]

// TODO [any order]:
// ! -2. - NEW TEST: for `mixin.toClass()`-results' instances. A new class - AnonymousClassTest - accepts an anonymous class and some (basic) formats for testing behaviours.
// 		^ USE IT with the `mixin` tests. Each `mixinTested = new mixin(...)` call also should
// 		^ spawn a `anonTest = new AnonymousClassTest(...)` call.
// 		^ And `anonTest` will run against an INSTANCE of `mixinTested.toClass()`
// ! -1. ADD the TESTS for `mixin`s WITHOUT constructors:
// 		* 1. with .properties:
// 			1. getters-only
// 			2. setters-only
// 			3. methods-only
// 			4. state-variables-only
// 			5. getters + setters + methods + state-variables
// 		* 2. with parents:
// 			* 1. with classes:
// 				1. getters-only
// 				2. setters-only
// 				3. methods-only
// 				4. state-variables-only
// 				5. getters + setters + methods + state-variables
// 			* 2. with other mixins:
// 				1. getters-only
// 				2. setters-only
// 				3. methods-only
// 				4. state-variables-only
// 				5. getters + setters + methods + state-variables
// 				6. with classes [also]:
// 					1. getters-only
// 					2. setters-only
// 					3. methods-only
// 					4. state-variables-only
// 					5. getters + setters + methods + state-variables
// [MixinTest]
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
