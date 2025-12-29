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

const withoutSuper = withoutProperties("super")

class ConstructorCreator {
	static instance = new ConstructorCreator()

	/**
	 * @private */
	isNonVoid(constructor) {
		return !!constructor && constructor !== Object
	}

	assignName(constructor, name) {
		propDefine(constructor, "name", ConstDescriptor(name))
	}

	ensureConstructorNonVoid(constructor) {
		return this.isNonVoid(constructor) ? constructor : function () {}
	}

	ensureNonNullPrototype(constructor) {
		if (isNullary(constructor.prototype))
			return function (...args) {
				return constructor.call(this, ...args)
			}
		return constructor
	}
}

class SuperCreator {
	static instance = new SuperCreator()

	toSuper(prototype) {
		const superProto = {}
		for (const key of keys(prototype))
			this.defineSuperProperty(superProto, key, prototype[key])
		return superProto
	}

	/**
	 * @private */
	defineSuperProperty(superProto, key, descriptor) {
		if (this.hasGetterSetter(descriptor))
			this.defineSuperProtoGetSet(superProto, key, descriptor)
		else this.copyToSuper(superProto, key, descriptor)
	}

	/**
	 * @private */
	hasGetterSetter(descriptor) {
		return "get" in descriptor || "set" in descriptor
	}

	/**
	 * @private */
	defineSuperProtoGetSet(superProto, key, descriptor) {
		superProto[key] = {}
		superProto[key].get = descriptor.get
		superProto[key].set = descriptor.set
	}

	/**
	 * @private */
	copyToSuper(superProto, key, descriptor) {
		superProto[key] = descriptor.value
	}
}

class PrototypeFiller {
	static instance = new PrototypeFiller()

	fromClasses(targetClass, classes) {
		classes.forEach((currClass) =>
			extendPrototype(
				targetClass,
				withoutSuper(
					withoutConstructor(propertyDescriptors(currClass.prototype))
				)
			)
		)
	}

	fromObject(targetPrototype, properties) {
		propsDefine(
			targetPrototype,
			withoutConstructor(propertyDescriptors(properties))
		)
	}
}

export class mixin {
	/**
	 * @private */
	get defaultConstructor() {
		return this.mixinShape.constructor
	}

	/**
	 * @private */
	get defaultName() {
		return this.mixinShape.name
	}

	/**
	 * @private */
	get static() {
		return this.mixinShape.static
	}

	/**
	 * @private */
	get properties() {
		return this.mixinShape.properties
	}

	/**
	 * @private */
	get proto() {
		return this.class.prototype
	}

	/**
	 * @private */
	set class(newClass) {
		this._class = newClass
	}

	/**
	 * @protected */
	get class() {
		return this._class
	}

	/**
	 * @private */
	set super(newSuper) {
		this.proto.super = newSuper
	}

	/**
	 * @private */
	get super() {
		return this.proto.super
	}

	/**
	 * @private */
	defineClass() {
		this.defineNonVoidConstructor(
			ConstructorCreator.instance.ensureNonNullPrototype(
				ConstructorCreator.instance.ensureConstructorNonVoid(
					this.defaultConstructor
				)
			)
		)
	}

	/**
	 * @private */
	setStaticMember(name, value) {
		this.class[name] = value
	}

	/**
	 * @private */
	defineStaticMember(name, propClosure) {
		this.setStaticMember(name, propClosure(this.class))
	}

	/**
	 * @private */
	inheritStatic(parent) {
		const staticNames = keys(parent)
		for (const propName of staticNames)
			this.setStaticMember(propName, parent[propName])
	}

	/**
	 * @private */
	inheritStaticMembers(parents) {
		for (const parent of parents) this.inheritStatic(parent)
	}

	/**
	 * @private */
	defineStaticMembers() {
		if (this.static)
			for (const k of keys(this.static))
				this.defineStaticMember(k, this.static[k])
	}

	/**
	 * @private */
	initSuper() {
		this.super = {}
	}

	/**
	 * @private */
	fromProperties() {
		PrototypeFiller.instance.fromObject(this.proto, this.properties)
	}

	/**
	 * @private */
	fromClasses(parents) {
		PrototypeFiller.instance.fromClasses(this.class, parents)
		this.superFromClasses(parents)
		this.inheritStaticMembers(parents)
	}

	/**
	 * @private */
	superFromClasses(classes) {
		classes.forEach((currClass) => this.provideSuper(currClass))
	}

	/**
	 * @private */
	provideSuper(forClass) {
		this.super[forClass.name] = SuperCreator.instance.toSuper(
			propertyDescriptors(forClass.prototype)
		)
	}

	/**
	 * @private */
	defineNonVoidConstructor(constructor) {
		this.constructorCreator.assignName(constructor, this.defaultName)
		this.setConstructor(constructor)
	}

	/**
	 * @private */
	setConstructor(constructor) {
		this.class = constructor
	}

	get name() {
		return this.class.name
	}

	toClass() {
		return this.class
	}

	constructor(mixinShape, classes = []) {
		this.mixinShape = mixinShape
		this.defineClass()
		this.initSuper()
		this.fromClasses(classes)
		this.defineStaticMembers()
		this.fromProperties()
	}
}
