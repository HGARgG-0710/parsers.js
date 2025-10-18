import { array, boolean, type } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IPosition,
	IPredicatePosition,
	IResourcefulStream,
	IStream
} from "../interfaces.js"
import type {
	IPathCallback,
	IPathFollower,
	IPropertyPath
} from "../interfaces/PropertyPath.js"
import { AutoMap } from "../internal/AutoMap.js"

const { isStruct, isNumber } = type
const { T } = boolean
const { clear } = array

export class SimplePath<I = any> implements IPropertyPath<I> {
	private callback: IPathCallback<I> | null = null

	private indexAt(input: any, i: number) {
		return input[this.property]
	}

	private newCurr(input: I, current: any, i: number) {
		this.callback?.(input, current)
		return this.indexAt(current, i)
	}

	atIndex(input: I, position: number): [number, any] {
		let current: any = input
		let i = 0
		for (; isStruct(current) && i < position; ++i)
			current = this.newCurr(input, current, i)
		return [i, current]
	}

	atPredicate(input: I, position: IPredicatePosition<I>): [number, any] {
		let current: any = input
		let i = 0
		for (; isStruct(current) && position(current, i); ++i)
			current = this.newCurr(input, current, i)
		return [i, current]
	}

	setCallback(callback: IPathCallback<I>): void {
		this.callback = callback
	}

	copy() {
		return this
	}

	constructor(private readonly property: string) {}
}

export class CachePath<I = any> implements IPropertyPath<I> {
	private ["constructor"]: new () => this

	private cache: any[]

	atIndex(input: I, position: number): [number, any] {
		position = Math.min(position, this.cache.length - 1)
		return [position, this.cache[position]]
	}

	atPredicate(input: I, position: IPredicatePosition<I>): [number, any] {
		let current = this.cache[0]
		let i = 0
		while (i < this.cache.length && position(current, i))
			current = this.cache[++i]
		return [i, current]
	}

	init(cache: any[]) {
		this.cache = cache
	}

	setCallback(callback: IPathCallback<I>): void {}

	copy(): this {
		const copy = new this.constructor()
		copy.init(array.copy(this.cache))
		return copy
	}
}

export class PathFollower<I = any, T = any> implements IPathFollower<I, T> {
	private ["constructor"]: new (path: IPropertyPath) => this

	private pickIteration(input: I, position: IPosition<I>) {
		return isNumber(position)
			? this.path.atIndex(input, position)
			: this.path.atPredicate(input, position)
	}

	setCallback(callback: IPathCallback<I>) {
		this.path.setCallback(callback)
	}

	follow(input: I, position: IPosition<I> = T): T | undefined {
		return this.pickIteration(input, position)[1]
	}

	length(input: I, position: IPosition<I>): number {
		return this.pickIteration(input, position)[0]
	}

	copy() {
		return new this.constructor(this.path.copy())
	}

	constructor(private readonly path: IPropertyPath) {}
}

export class CachingFollower<I = any, T = any> implements IPathFollower<I, T> {
	private readonly cacheMap: AutoMap<I, any[]> = new AutoMap(() => [])
	private readonly isEmptyMap: AutoMap<I, boolean> = new AutoMap(() => true)
	private readonly cachePath = new CachePath()
	private readonly cacheFollower = new PathFollower(this.cachePath)

	setCallback(callback: IPathCallback<I>): void {}

	private isEmptyCache(input: I) {
		return this.isEmptyMap.get(input)
	}

	private markEmpty(input: I) {
		this.isEmptyMap.set(input, true)
	}

	private markNonEmpty(input: I) {
		this.isEmptyMap.set(input, false)
	}

	private setCache(input: I) {
		this.cachePath.init(this.cacheMap.get(input))
	}

	private followUncached(input: I, position: IPosition<I>) {
		const result = this.delegate.follow(input, position)
		this.markNonEmpty(input)
		return result
	}

	private followCached(input: I, position: IPosition<I>) {
		this.setCache(input)
		return this.cacheFollower.follow(input, position)
	}

	private lengthUncached(input: I, position: IPosition<I>) {
		return this.delegate.length(input, position)
	}

	private lengthCached(input: I, position: IPosition<I>) {
		this.setCache(input)
		return this.cacheFollower.length(input, position)
	}

	clear(input: I) {
		clear(this.cacheMap.get(input))
		this.markEmpty(input)
	}

	follow(input: I, position: IPosition<I> = T): T | undefined {
		return this.isEmptyCache(input)
			? this.followUncached(input, position)
			: this.followCached(input, position)
	}

	length(input: I, position: IPosition<I> = T): number {
		return this.isEmptyCache(input)
			? this.lengthUncached(input, position)
			: this.lengthCached(input, position)
	}

	constructor(private readonly delegate: IPathFollower<I, T>) {
		delegate.setCallback((input: I, x: any) =>
			this.cacheMap.get(input).push(x)
		)
	}
}

/**
 * A `PropDigger` over the `.resource` property.
 */
export class ResourceFollower extends PathFollower<
	IResourcefulStream,
	IStream
> {
	static caching() {
		return new CachingFollower(new ResourceFollower())
	}

	constructor() {
		super(new SimplePath("resource"))
	}
}

/**
 * A `PropDigger` over the `.owner` property.
 */
export class OwnerFollower extends PathFollower<IOwnedStream, IStream> {
	static caching() {
		return new CachingFollower(new OwnerFollower())
	}

	constructor() {
		super(new SimplePath("owner"))
	}
}
