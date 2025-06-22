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

type _IVoidConstructor = undefined | Function

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

export class mixin<T = any, Args extends any[] = any[]> extends sealed_mixin<
	T,
	Args
> {
	toClass() {
		return this.class
	}
}

export namespace mixin {
	export class sealed<
		T = any,
		Args extends any[] = any[]
	> extends sealed_mixin<T, Args> {}

	export type IMixinShape<T = any, Args extends any[] = any[]> = _IMixinShape<
		T,
		Args
	>

	export type IAbstractClass<
		T = any,
		Args extends any[] = any[]
	> = abstract new (...args: Args) => T

	export type IOutClass<T = any, Args extends any[] = any[]> = _IOutClass<
		T,
		Args
	>

	export type INonVoidConstructor<
		T = any,
		Args extends any[] = any[]
	> = _INonVoidConstructor<T, Args>

	export type IVoidConstructor = _IVoidConstructor

	export type IConstructorType<
		T = any,
		Args extends any[] = any[]
	> = _IConstructorType<T, Args>
}
