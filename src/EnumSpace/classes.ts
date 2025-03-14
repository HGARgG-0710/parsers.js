import type { ArrayEnum, EnumSpace } from "./interfaces.js"
import type { Mappable, Sizeable } from "../interfaces.js"

import { InitializablePattern } from "../Pattern/abstract.js"

import { functional, inplace, object, array } from "@hgargg-0710/one"
const { id } = functional
const { out } = inplace
const { empty } = object
const { mixin } = object.classes
const { copy, uniqueArr, numbers } = array

abstract class PreEnumSpace<Type = any> implements Sizeable {
	protected value: Type[] = []

	abstract add(size: number): void

	map<Out = any>(mapped: Mappable<Type, Out> = id<Type> as any) {
		return this.value.map(mapped)
	}

	set size(size: number) {
		const diff = this.size - size
		if (diff > 0) out(this.value, size, diff)
	}

	get size() {
		return this.value.length
	}

	join(space: ArrayEnum<Type>) {
		this.value.push(...space.get())
		this.ensureUnique()
		return this
	}

	protected ensureUnique() {
		this.value = uniqueArr(this.value!)
	}

	constructor(size: number = 0) {
		this.size = size
	}
}

const sizeSetter = Object.getOwnPropertyDescriptor(PreEnumSpace.prototype, "size")!.set!
const reduceSize = (x: PreEnumSpace, size: number) => sizeSetter.call(x, size)

export class ConstEnum extends PreEnumSpace<{}> implements ArrayEnum<{}> {
	set size(size: number) {
		const diff = size - this.size
		if (diff > 0) this.add(diff)
		else reduceSize(this, size)
	}

	add(size: number) {
		this.value.push(...Array.from({ length: size }, empty))
		return this
	}

	copy() {
		return new ConstEnum(this.size)
	}

	get() {
		return this.value as readonly {}[]
	}
}

export class FiniteEnum<Type = any>
	extends InitializablePattern<Type[]>
	implements ArrayEnum<Type>
{
	protected generator?: (i: number, ...x: any[]) => Type

	map: <Out = any>(f?: Mappable<Type, Out> | undefined) => Out[]
	join: (enums: EnumSpace<Type>) => this

	add(size: number): this {
		this.value!.push(
			...numbers(size).map((i: number) => this.generator!(this.size + i))
		)
		this.ensureUnique()
		return this
	}

	copy() {
		return new FiniteEnum(copy(this.value!), this.generator)
	}

	// * dummy methods (real ones contributed by `PreEnumSpace`)
	get size() {
		return 0
	}

	set size(v: number) {}

	protected ensureUnique(): void {}

	constructor(value: Type[] = [], generator?: (i?: number, ...x: any[]) => Type) {
		super(value)
		this.generator = generator?.bind(this)
	}
}

mixin(FiniteEnum, [PreEnumSpace])
