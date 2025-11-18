import type { object } from "@hgargg-0710/one"

/**
 * This is a class for representing a named, reusable constructor
 * with an attached collection of methods, getters, setters and default
 * properties for its instance objects, which can also form inheritance
 * hierarchies.
 *
 * The instances have a type of of `T`, and the constructor which
 * the `mixin<T, Args>` object in question is based off accepts
 * `...args: Args` as its arguments.
 *
 * The `mixin.IMixinShape<T, Args>` object given contains all the
 * things necessary to construct the mixin's own properties. The
 * constructor also accepts `mixins: mixin[]` and
 * `parents: mixin.IOutClass<T, Args>[]` parameters, used for
 * allowing a form of "weak" (i.e. prototype-based) inheritance.
 *
 * The `IMixinShape<T, Args>` object has the `name: string` property,
 * which contains the own name of the mixin in question. The name
 * should be unique across the application, although it doesn't
 * have to be. The `.properties` property is the object containing
 * the own items of `mixin`. They are to be enumerated in arbitrary
 * order. It could be a method, a getter/setter, or a common (default)
 * property shared across all the mixin instances (if there are any),
 * and existing on their `.prototype` (i.e. NOT on the instances
 * themselves).
 *
 * Creation of a mixin instance is possible via the `mixin.toClass()`
 * method, which returns the resulting mixin's constructor [it is
 * created only once - upon call to `new mixin`]. This way, it is
 * possible even for regular classes to employ mixins as parents.
 *
 * Mixins do not have to have their own instances, however. Instead,
 * they can also be employed as means for refactoring, and formation
 * of complex and elegant inheritance hierarchies. This is particularly
 * useful when the same method/piece-of-code gets to be reused many
 * times across many related classes which happen to have differing
 * parents.
 *
 * Inheritance works via copying of properties off prototypes of
 * parent classes or other mixins (provided in the constructor),
 * and the referencing of said prototypes on the child mixins'
 * instances' prototypes via the `.super` property.
 *
 * This way, for example, if you have a child mixin `A`, which inherits
 * from a parent mixin `B`, and wants to call its method `B.prototype.b`
 * from inside of `A.prototype.c`, then one could do access it
 * by calling `this.super.B.b.call(this)` inside of `A.prototype.c`.
 *
 * Likewise, if you want to access a getter/setter for a given accessor
 * property `m` on `B`, you would do it via `this.super.B.m.get/set`,
 * which would return the respective getter/setter methods.
 *
 * Default properties (example: `r`) are accessed as-are: `this.super.B.r`.
 *
 * Here, the name employed inside of `super` is the value of the
 * `.name: string` property given by the user in the definition of `B`.
 *
 * Child mixins also (by default) inherit all the default properties,
 * methods, getters and setters of all of their parents (both class
 * and mixin ones). The order (i.e. priority) of inheritance is
 * defined by the order of parents inside of the arrays to the
 * `mixin` constructor. Thus, inheritance is done in accordance
 * to rules:
 *
 * 1. Own `.properties` of a mixin always override the chosen parent's defaults
 * 2. Parents that come later inside an array have higher priority
 * 3. Mixin parents have precedence over class parents
 * 4. No parent is left out of `.super`, so all properties are still accessible
 */
export declare class mixin {
	readonly name: string
	toClass(): Function
	constructor(mixinShape: mixin.IMixinShape, parents?: Function[])
}

export namespace mixin {
	export type IStaticProperty = (classObj: Function) => any

	export interface IMixinShape {
		readonly name: string
		readonly properties: Record<object.ObjectKey, any>
		readonly static?: Record<object.ObjectKey, IStaticProperty>
		readonly constructor?: Function
	}
}
