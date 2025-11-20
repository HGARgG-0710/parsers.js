import { array, boolean, type } from "@hgargg-0710/one"
import type {
	IOwnedStream,
	IResourcefulStream,
	IStream
} from "../interfaces.js"
import type {
	IPathCallback,
	IPathFollower,
	IPathPredicate,
	IPathStep,
	IPropertyPath
} from "../interfaces/PropertyPath.js"
import { AutoMap } from "./AutoMap.js"

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

	atIndex(input: I, index: number): [number, any] {
		let current: any = input
		let i = 0
		for (; isStruct(current) && i < index; ++i)
			current = this.newCurr(input, current, i)
		return [i, current]
	}

	atPredicate(input: I, predicate: IPathPredicate<I>): [number, any] {
		let current: any = input
		let i = 0
		for (; isStruct(current) && predicate(current, i); ++i)
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

	atIndex(input: I, index: number): [number, any] {
		index = Math.min(index, this.cache.length - 1)
		return [index, this.cache[index]]
	}

	atPredicate(input: I, predicate: IPathPredicate<I>): [number, any] {
		let current = this.cache[0]
		let i = 0
		while (i < this.cache.length && predicate(current, i))
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

	private pickIteration(input: I, step: IPathStep<I>) {
		return isNumber(step)
			? this.path.atIndex(input, step)
			: this.path.atPredicate(input, step)
	}

	setCallback(callback: IPathCallback<I>) {
		this.path.setCallback(callback)
	}

	follow(input: I, step: IPathStep<I> = T): T | undefined {
		return this.pickIteration(input, step)[1]
	}

	length(input: I, step: IPathStep<I>): number {
		return this.pickIteration(input, step)[0]
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

	private followUncached(input: I, step: IPathStep<I>) {
		const result = this.delegate.follow(input, step)
		this.markNonEmpty(input)
		return result
	}

	private followCached(input: I, step: IPathStep<I>) {
		this.setCache(input)
		return this.cacheFollower.follow(input, step)
	}

	private lengthUncached(input: I, step: IPathStep<I>) {
		return this.delegate.length(input, step)
	}

	private lengthCached(input: I, step: IPathStep<I>) {
		this.setCache(input)
		return this.cacheFollower.length(input, step)
	}

	clear(input: I) {
		clear(this.cacheMap.get(input))
		this.markEmpty(input)
	}

	follow(input: I, step: IPathStep<I> = T): T | undefined {
		return this.isEmptyCache(input)
			? this.followUncached(input, step)
			: this.followCached(input, step)
	}

	length(input: I, step: IPathStep<I> = T): number {
		return this.isEmptyCache(input)
			? this.lengthUncached(input, step)
			: this.lengthCached(input, step)
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
