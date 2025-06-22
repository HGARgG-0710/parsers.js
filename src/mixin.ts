import { object, type } from "@hgargg-0710/one"

const { withoutConstructor } = object.classes
const { ConstDescriptor } = object.descriptor
const { isNullary } = type
const {
	propsDefine,
	propertyDescriptors,
	propDefine,
	keys,
	withoutProperties,
	extendPrototype
} = object

type _IConstructorType<T = any, Args extends any[] = any[]> =
	| _IVoidConstructor
	| _INonVoidConstructor<T, Args>

type _IVoidConstructor = undefined | null | Function

type _INonVoidConstructor<T = any, Args extends any[] = any[]> = (
	...args: Args
) => T | void

type _IOutClass<T = any, Args extends any[] = any[]> =
	| (new (...args: Args) => T)
	| (abstract new (...args: Args) => T)
	| ((...args: Args) => T & { prototype: T })

interface _IMixinShape<T = any, Args extends any[] = any[]> {
	readonly name: string
	readonly properties: object
	readonly constructor?: _IConstructorType<T, Args>
}

const withoutSuper = withoutProperties("super")

class ConstructorCreator<T = any, Args extends any[] = any[]> {
	private isNonVoid(
		constructor: _IConstructorType<T, Args>
	): constructor is _INonVoidConstructor<T, Args> {
		return !!constructor && constructor !== Object
	}

	assignName(constructor: _INonVoidConstructor<T, Args>, name: string) {
		propDefine(constructor, "name", ConstDescriptor(name))
	}

	ensureConstructorNonVoid(constructor: _IConstructorType<T, Args>) {
		return this.isNonVoid(constructor) ? constructor : function () {}
	}

	ensureNonNullPrototype(constructor: _INonVoidConstructor<T, Args>) {
		if (isNullary(constructor.prototype))
			return function (...args: Args) {
				return constructor.call(this, ...args)
			}
		return constructor
	}
}

class SuperCreator {
	toSuper(prototype: object) {
		const superProto = {}
		for (const key of keys(prototype))
			this.defineSuperProperty(superProto, key, prototype[key])
		return superProto
	}

	private defineSuperProperty(
		superProto: object,
		key: object.ObjectKey,
		descriptor: PropertyDescriptor
	) {
		if (this.hasGetterSetter(descriptor))
			this.defineSuperProtoGetSet(superProto, key, descriptor)
		else this.copyToSuper(superProto, key, descriptor)
	}

	private hasGetterSetter(descriptor: PropertyDescriptor) {
		return "get" in descriptor || "set" in descriptor
	}

	private defineSuperProtoGetSet(
		superProto: object,
		key: object.ObjectKey,
		descriptor: PropertyDescriptor
	) {
		superProto[key] = {}
		superProto[key].get = descriptor.get
		superProto[key].set = descriptor.set
	}

	private copyToSuper(
		superProto: object,
		key: object.ObjectKey,
		descriptor: PropertyDescriptor
	) {
		superProto[key] = descriptor.value
	}
}

class PrototypeFiller {
	fromClasses(targetClass: object.Constructor, classes: _IOutClass[]) {
		classes.forEach((currClass) =>
			extendPrototype(
				targetClass,
				withoutSuper(
					withoutConstructor(propertyDescriptors(currClass.prototype))
				) as PropertyDescriptorMap
			)
		)
	}

	fromObject(targetPrototype: object, properties: object) {
		propsDefine(
			targetPrototype,
			withoutConstructor(
				propertyDescriptors(properties)
			) as PropertyDescriptorMap
		)
	}
}

class sealed_mixin<T = any, Args extends any[] = any[]> {
	private _class: _IOutClass<T, Args>
	private readonly superCreator = new SuperCreator()
	private readonly prototypeFiller = new PrototypeFiller()
	private readonly constructorCreator = new ConstructorCreator<T, Args>()

	private get defaultConstructor(): _IConstructorType<T, Args> {
		return this.mixinShape.constructor
	}

	private get defaultName() {
		return this.mixinShape.name
	}

	private get properties() {
		return this.mixinShape.properties
	}

	private get proto() {
		return this.class.prototype
	}

	private set class(newClass: _IOutClass<T, Args>) {
		this._class = newClass
	}

	protected get class() {
		return this._class
	}

	private set super(newSuper: object) {
		this.proto.super = newSuper
	}

	private get super() {
		return this.proto.super
	}

	private defineClass() {
		this.defineNonVoidConstructor(
			this.constructorCreator.ensureNonNullPrototype(
				this.constructorCreator.ensureConstructorNonVoid(
					this.defaultConstructor
				)
			)
		)
	}

	private initSuper() {
		this.super = {}
	}

	private fromMixins(mixins: sealed_mixin[]) {
		this.fromClasses(mixins.map((x) => x.class))
	}

	private fromProperties() {
		this.prototypeFiller.fromObject(this.proto, this.properties)
	}

	private fromClasses(classes: _IOutClass[]) {
		this.prototypeFiller.fromClasses(this.class, classes)
		this.superFromClasses(classes)
	}

	private superFromClasses(classes: _IOutClass[]) {
		classes.forEach((currClass) => this.provideSuper(currClass))
	}

	private provideSuper(forClass: _IOutClass) {
		this.super[forClass.name] = this.superCreator.toSuper(
			propertyDescriptors(forClass.prototype)
		)
	}

	private defineNonVoidConstructor(
		constructor: _INonVoidConstructor<T, Args>
	) {
		this.constructorCreator.assignName(constructor, this.defaultName)
		this.setConstructor(constructor)
	}

	private setConstructor(constructor: _INonVoidConstructor<T, Args>) {
		this.class = constructor as unknown as _IOutClass<T, Args>
	}

	get name() {
		return this.class.name
	}

	constructor(
		private readonly mixinShape: _IMixinShape<T, Args>,
		mixins: sealed_mixin[] = [],
		classes: _IOutClass[] = []
	) {
		this.defineClass()
		this.initSuper()
		this.fromClasses(classes)
		this.fromMixins(mixins)
		this.fromProperties()
	}
}

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
 * `classes: mixin.IOutClass<T, Args>[]` parameters, used for
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
export class mixin<T = any, Args extends any[] = any[]> extends sealed_mixin<
	T,
	Args
> {
	toClass() {
		return this.class
	}
}

export namespace mixin {
	/**
	 * This is a variation on the `mixin` class, with the
	 * sole difference being that it does not have the `.toClass()`
	 * method, and can, therefore, be only used for inheritance.
	 *
	 * [This is, one could say, an "abstract" mixin]
	 */
	export class sealed<
		T = any,
		Args extends any[] = any[]
	> extends sealed_mixin<T, Args> {}

	/**
	 * This is a type for representing own
	 * property inputs to the `mixin`
	 * constructor.
	 */
	export type IMixinShape<T = any, Args extends any[] = any[]> = _IMixinShape<
		T,
		Args
	>

	/**
	 * This is a class for representing possible
	 * results of `mixin.prototype.toClass()`,
	 * as well as inputs for mixin class parents.
	 */
	export type IOutClass<T = any, Args extends any[] = any[]> = _IOutClass<
		T,
		Args
	>

	/**
	 * This is a type for representing a guaranteedly
	 * non-absent `.constructor` property on an
	 * `IMixinShape<T, Args>` object.
	 */
	export type INonVoidConstructor<
		T = any,
		Args extends any[] = any[]
	> = _INonVoidConstructor<T, Args>

	/**
	 * This is a type for representing a guaranteedly
	 * absent `.constructor` property on an
	 * `IMixinShape<T, Args>` object.
	 */
	export type IVoidConstructor = _IVoidConstructor

	/**
	 * This is a type for representing a
	 * (potentially) absent `.constructor`
	 * property on an `IMixinShape<T, Args>`.
	 */
	export type IConstructorType<
		T = any,
		Args extends any[] = any[]
	> = _IConstructorType<T, Args>
}
