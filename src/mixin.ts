import { object } from "@hgargg-0710/one"

const { mixin: _mixin, withoutConstructor } = object.classes
const { ConstDescriptor } = object.descriptor
const { propsDefine, propertyDescriptors, propDefine, keys } = object

type _IConstructorType<T = any, Args extends any[] = any[]> =
	| _IVoidConstructor
	| _INonVoidConstructor<T, Args>

type _IVoidConstructor = undefined | Function

type _INonVoidConstructor<T = any, Args extends any[] = any[]> = (
	...args: Args
) => T | void

type _IOutClass<T = any, Args extends any[] = any[]> = new (...args: Args) => T

interface _IMixinShape<T = any, Args extends any[] = any[]> {
	readonly name: string
	readonly properties: object
	readonly constructor?: _IConstructorType<T, Args>
}

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
	fromClasses(
		targetClass: object.Constructor,
		classes: (new (...args: any[]) => any)[]
	) {
		_mixin(targetClass, classes)
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

	private set class(newClass: _IOutClass<T, Args>) {
		this._class = newClass
	}

	protected get class() {
		return this._class
	}

	private get proto() {
		return this.class.prototype
	}

	private set super(newSuper: object) {
		this.proto.super = newSuper
	}

	private get super() {
		return this.proto.super
	}

	private get properties() {
		return this.mixinShape.properties
	}

	private defineClass() {
		this.defineNonVoidConstructor(
			this.constructorCreator.ensureConstructorNonVoid(
				this.defaultConstructor
			)
		)
	}

	private initSuper() {
		this.super = {}
	}

	private fromConstructors(constructors: ((...args: any[]) => any)[]) {
		this.fromClasses(
			constructors as unknown as (new (...args: any[]) => any)[]
		)
	}

	private fromMixins(mixins: sealed_mixin[]) {
		this.fromClasses(mixins.map((x) => x.class))
	}

	private fromProperties() {
		this.prototypeFiller.fromObject(this.proto, this.properties)
	}

	private fromClasses(classes: (new (...args: any[]) => any)[]) {
		this.prototypeFiller.fromClasses(this.class, classes)
		this.superFromClasses(classes)
	}

	private superFromClasses(classes: (new (...args: any[]) => any)[]) {
		classes.forEach((currClass) => this.provideSuper(currClass))
	}

	private provideSuper(forClass: new (...args: any[]) => any) {
		this.super[forClass.name] = this.superCreator.toSuper(
			propertyDescriptors(forClass.prototype)
		)
	}

	private defineNonVoidConstructor(
		constructor: _INonVoidConstructor<T, Args>
	) {
		this.constructorCreator.assignName(constructor, this.name)
		this.setConstructor(constructor)
	}

	private setConstructor(constructor: _INonVoidConstructor<T, Args>) {
		this.class = constructor as unknown as _IOutClass<T, Args>
	}

	get name() {
		return this.mixinShape.name
	}

	constructor(
		private readonly mixinShape: _IMixinShape<T, Args>,
		mixins: sealed_mixin[] = [],
		classes: ((...args: any[]) => any)[] = []
	) {
		this.defineClass()
		this.initSuper()
		this.fromConstructors(classes)
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
	export const sealed = sealed_mixin

	export type IMixinShape<T = any, Args extends any[] = any[]> = _IMixinShape<
		T,
		Args
	>

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
