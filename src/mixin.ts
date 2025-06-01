import { object } from "@hgargg-0710/one"

const { mixin: _mixin, withoutConstructor } = object.classes
const { ConstDescriptor } = object.descriptor
const { propsDefine, propertyDescriptors, propDefine } = object

export type IConstructorType<T = any, Args extends any[] = any[]> =
	| IVoidConstructor
	| INonVoidConstructor<T, Args>

export type IVoidConstructor = undefined | Function

export type INonVoidConstructor<T = any, Args extends any[] = any[]> = (
	...args: Args
) => T | void

export interface IMixinShape<T = any, Args extends any[] = any[]> {
	readonly name: string
	readonly properties: object
	readonly constructor?: ((...args: Args) => T | void) | Function
}

export class mixin<T = any, Args extends any[] = any[]> {
	private _class: new (...args: Args) => T

	private get defaultConstructor(): IConstructorType<T, Args> {
		return this.mixinShape.constructor
	}

	private set class(newClass: new (...args: Args) => T) {
		this._class = newClass
	}

	private get class() {
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
		this.super[forClass.name] = forClass
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

	private fromMixins(mixins: mixin[]) {
		this.fromClasses(mixins.map((x) => x.class))
	}

	private fromProperties() {
		if (this.properties) this.fromObject(this.properties)
	}

	private isNonVoid(
		constructor: IConstructorType<T, Args>
	): constructor is INonVoidConstructor<T, Args> {
		return !!constructor && constructor !== Object
	}

	private ensureConstructorNonVoid(constructor: IConstructorType<T, Args>) {
		return this.isNonVoid(constructor) ? constructor : function () {}
	}

	private assignName(constructor: INonVoidConstructor<T, Args>) {
		propDefine(constructor, "name", ConstDescriptor(this.mixinShape.name))
	}

	private setConstructor(constructor: INonVoidConstructor<T, Args>) {
		this.class = constructor as unknown as new (...args: Args) => T
	}

	private initSuper() {
		this.super = {}
	}

	private defineNonVoidConstructor(
		constructor: INonVoidConstructor<T, Args>
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

	toClass() {
		return this.class
	}

	constructor(
		private readonly mixinShape: IMixinShape<T, Args>,
		mixins: mixin[] = [],
		classes: (new (...args: any[]) => any)[] = []
	) {
		this.defineClass()
		this.fromClasses(classes)
		this.fromMixins(mixins)
		this.fromProperties()
	}
}
