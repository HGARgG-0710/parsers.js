import { object } from "@hgargg-0710/one"

const { mixin: _mixin, withoutConstructor } = object.classes
const { extendPrototype, propertyDescriptors } = object

export interface IMixinShape<T = any, Args extends any[] = any[]> {
	readonly properties?: object
	readonly constructor: (...args: Args) => T | void
}

export class mixin<T = any, Args extends any[] = any[]> {
	private get class() {
		return this.mixinShape.constructor as unknown as new (
			...args: Args
		) => T
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
		extendPrototype(
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

	toClass() {
		return this.class
	}

	constructor(
		private readonly mixinShape: IMixinShape<T, Args>,
		mixins: mixin[] = [],
		classes: (new (...args: any[]) => any)[] = []
	) {
		this.super = {}
		this.fromClasses(classes)
		this.fromMixins(mixins)
		this.fromProperties()
	}
}
