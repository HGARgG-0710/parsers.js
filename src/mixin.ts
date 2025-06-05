import { object } from "@hgargg-0710/one"

const { mixin: _mixin, withoutConstructor } = object.classes
const { ConstDescriptor } = object.descriptor
const { propsDefine, propertyDescriptors, propDefine } = object

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

class sealed_mixin<T = any, Args extends any[] = any[]> {
	private _class: _IOutClass<T, Args>

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

	private set super(newSuper) {
		this.proto.super = newSuper
	}

	private get super() {
		return this.proto.super
	}

	private get properties() {
		return this.mixinShape.properties
	}

	private provideSuper(forClass: new (...args: any[]) => any) {
		this.super[forClass.name] = forClass.prototype
	}

	private fromConstructors(constructors: ((...args: any[]) => any)[]) {
		this.fromClasses(
			constructors as unknown as (new (...args: any[]) => any)[]
		)
	}

	private fromClasses(classes: (new (...args: any[]) => any)[]) {
		_mixin(this.class, classes)
		classes.forEach((currClass) => this.provideSuper(currClass))
	}

	private fromObject(properties: object) {
		propsDefine(
			this.proto,
			withoutConstructor(
				propertyDescriptors(properties)
			) as PropertyDescriptorMap
		)
	}

	private fromMixins(mixins: sealed_mixin[]) {
		this.fromClasses(mixins.map((x) => x.class))
	}

	private fromProperties() {
		this.fromObject(this.properties)
	}

	private isNonVoid(
		constructor: _IConstructorType<T, Args>
	): constructor is _INonVoidConstructor<T, Args> {
		return !!constructor && constructor !== Object
	}

	private ensureConstructorNonVoid(constructor: _IConstructorType<T, Args>) {
		return this.isNonVoid(constructor) ? constructor : function () {}
	}

	private assignName(constructor: _INonVoidConstructor<T, Args>) {
		propDefine(constructor, "name", ConstDescriptor(this.mixinShape.name))
	}

	private setConstructor(constructor: _INonVoidConstructor<T, Args>) {
		this.class = constructor as unknown as _IOutClass<T, Args>
	}

	private initSuper() {
		this.super = {}
	}

	private defineNonVoidConstructor(
		constructor: _INonVoidConstructor<T, Args>
	) {
		this.assignName(constructor)
		this.setConstructor(constructor)
		this.initSuper()
	}

	private defineClass() {
		this.defineNonVoidConstructor(
			this.ensureConstructorNonVoid(this.defaultConstructor)
		)
	}

	get name() {
		return this.class.name
	}

	constructor(
		private readonly mixinShape: _IMixinShape<T, Args>,
		mixins: sealed_mixin[] = [],
		classes: ((...args: any[]) => any)[] = []
	) {
		this.defineClass()
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
