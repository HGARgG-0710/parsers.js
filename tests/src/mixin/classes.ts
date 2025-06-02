import { TestCounter } from "../lib/lib.js"
import {
	HAS_CONSTRUCTOR,
	MixinPrototypeTest,
	NO_CONSTRUCTOR,
	NO_PARENTS,
	PureMixinPrototypeTest
} from "./lib/classes.js"

const mixinTestCounter = new TestCounter(
	([hasConstructor, parentCode, categoryCount]: [number, number, number]) =>
		`mixin (#${hasConstructor}.${parentCode}.${categoryCount})`
)

mixinTestCounter.test([NO_CONSTRUCTOR, NO_PARENTS], () =>
	new PureMixinPrototypeTest({ name: "Test0", properties: {} }).toClass({
		super: {
			value: {},
			writable: true,
			enumerable: true,
			configurable: true
		}
	})
)

mixinTestCounter.test([HAS_CONSTRUCTOR, NO_PARENTS], () => {
	const constructor = function () {}
	new MixinPrototypeTest({
		name: "Test1",
		properties: {},
		constructor
	}).toClass({
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
// ! VITAL: add the 'MixinInstanceTest's TOGETHER with the `MixinPureTest`-s [ALWAYS - even when there are NO ]
// 		% reason: 
// 			1. [when no '.constructor'] mildly "tighter" tests - eliminates certain (less elaborate) cases of 'Proxy' usage for implementation [like when '.prototype' is being substituted by a Mock of sorts]; 
// 			2. [when IS '.consructor'] to test the behaviour of the '.constructor'
// TODO: shorten the list of tests - to be less tautological [currently - a bit too much...]; 
// ! -1. ADD the TESTS for `mixin`s WITHOUT constructors [MixinPureTest-s + MixinInstanceTest-s]:
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
// [MixinPrototypeTest + MixinInstanceTest]
// * 0 non-empty .constructor [still no .properties]
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
