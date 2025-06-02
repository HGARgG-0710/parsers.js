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

// TODO: about 'parents' tests: 
// 		* 1. add 'mixins', 'classes' args onto `MixinPrototypeTest` and 'PureMixinPrototypeTest'
// 		* 2. SAVE the 'classes' + 'mixins', SO THAT '.super' could be tested INDEPENDENTLY - REMOVE 'super : {...}' from the prototype-tests; 

// TODO: tests left to do: 
// * 1. with .constructor [MixinPrototypeTest + MixinInstanceTest]: 
// 		1. no parents:
// 			1. getters + setters + methods + prototype-vars
// 		2. parents: 
// 			1. 2 classes +  getters + setters + methods + prototype-vars
// 			2. 2 mixins +  getters + setters + methods + prototype-vars
// 			3. 1 class + 2 mixins +  getters + setters + methods + prototype-vars
// * 2. without .constructor [PureMixinPrototypeTest + MixinInstanceTest]: 
// 		1. without parents: 
// 			1. .prototype-vars [default-state] + methods
// 			2. .prototype-vars [default-state] only 
// 			3. lone-getters and setters
// 			4. getters + setters + methods + prototype-vars
// 		2. with 'class' parents: 
// 			1. 1 parent + getters + setters + methods + prototype-vars
// 			2. 3 parents + getters + setters + methods + prototype-vars
// 		3. with 'mixin' parents: 
// 			1. 1 parent + getters + setters + methods + prototype-vars
// 			2. 3 parents + gettesr + setters + methods + prototype-vars
// 		4. with both 'class' and 'mixin' parents
// 			1. 1 'class' parent + 1 'mixin' parent + getters + setters + methods + prototype-vars
// 			2. 2 'class' parents + 3 'mixin' parents + gettesr + setters + methods + prototype-vars
