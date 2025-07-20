import { number, type } from "@hgargg-0710/one"
import assert from "assert"

const { min, max } = number
const { isNumber, isArray } = type

/**
 * A class encapsulating the ability
 * to dynamically increase the length
 * of a given `T[]` array.
 */
class DynamicSize<T = any> {
	incBy(elements: number) {
		this.items.length += elements
	}

	get() {
		return this.items.length
	}

	constructor(private readonly items: T[]) {}
}

/**
 * This class represents a heuristic for expansion of the
 * size of the `T[]` array. Intended to encapsulate the
 * logic for said increase, and isolate it from the
 * remainder of the code for working with the said
 * array.
 *
 * Instead of using the actual number of elements by which
 * it is asked to increase the array size, one uses the
 * maximum of the said amount and the current size (i.e.
 * doubling). This enables exponential growth of the
 * buffer, specifically, 'n'th increase will cause it
 * to be `2 ** n * x` elements, where `x` is their original
 * number.
 *
 * This, in particular, is intended to serve as a safeguard
 * against excessive resizing by small amounts (such as 1),
 * which is a fairly common danger when it comes to
 * lookaheads.
 */
class SizeAllocationHeuristic<T = any> {
	private heuristic(n: number) {
		return max(n, this.dynamicSize.get())
	}

	incBy(elements: number) {
		this.dynamicSize.incBy(this.heuristic(elements))
	}

	constructor(private readonly dynamicSize: DynamicSize<T>) {}
}

/**
 * Represents the class for handling
 * the size-related data/methods of
 * `RotationBuffer`.
 */
class BufferSize<T = any> {
	private readonly heuristic: SizeAllocationHeuristic<T>
	private readonly dynamicSize: DynamicSize<T>

	private get size() {
		return this.dynamicSize.get()
	}

	incBy(elements: number) {
		this.heuristic.incBy(elements)
	}

	get() {
		return this.size
	}

	lastPos() {
		return this.size - 1
	}

	wrapped(n: number) {
		return n % this.size
	}

	constructor(items: T[]) {
		this.dynamicSize = new DynamicSize(items)
		this.heuristic = new SizeAllocationHeuristic(this.dynamicSize)
	}
}

/**
 * A class representing the last-read index inside a
 * `RotationBuffer` instance.
 */
class LastIndex<T = any> {
	private lastIndex: number = -1

	private endShift(i: number) {
		return this.sizeObj.wrapped(i + this.lastIndex)
	}

	moveForward(by: number) {
		this.lastIndex = this.endShift(by)
	}

	reset() {
		this.lastIndex = this.sizeObj.lastPos()
	}

	unset() {
		this.lastIndex = -1
	}

	get() {
		return this.lastIndex
	}

	constructor(private readonly sizeObj: BufferSize<T>) {}
}

/**
 * A class encapsulating operations on `RotationBuffer`
 * related to keeping track of its state of (supposed)
 * "emptiness/fullness". It is employed as an optimization
 * to avoid spending time on getting rid of items, and
 * instead storing a flag to not do it.
 */
class EmptinessTracker {
	private isKnowablyEmpty: boolean = true

	markNot() {
		this.isKnowablyEmpty = false
	}

	markIs() {
		this.isKnowablyEmpty = true
	}

	is() {
		return this.isKnowablyEmpty
	}
}

/**
 * A class keeping track of index-rotation-related
 * data and operations on `RotationBuffer`. The
 * first-read index of the `RotationBuffer` is
 * offset by a certain (continuously manipulated)
 * number, which this class encapsulates.
 */
class IndexRotation<T = any> {
	private rotation: number = 0

	reset() {
		this.rotation = 0
	}

	isPresent() {
		return this.rotation > 0
	}

	shifted(index: number) {
		return this.sizeObj.wrapped(index + this.rotation)
	}

	forward(n: number) {
		this.rotation = this.shifted(n)
	}

	backward() {
		this.forward(this.sizeObj.lastPos())
	}

	get() {
		return this.rotation
	}

	constructor(private readonly sizeObj: BufferSize<T>) {}
}

/**
 * This is a class for calculating the "filled size" of the
 * `RotationBuffer` - the (non-negative) difference between
 * its last read-index and its rotation index (used to avoid
 * repeatedly calling `.unshift()`).
 */
class FilledSpaceCalculator<T = any> {
	private baseSize() {
		return this.lastIndex.get() - this.rotation.get()
	}

	private ensureNonNegative(offsetSize: number) {
		return offsetSize <= 0 ? offsetSize + this.sizeObj.get() : offsetSize
	}

	get() {
		return this.ensureNonNegative(this.baseSize())
	}

	constructor(
		public readonly sizeObj: BufferSize<T>,
		private readonly lastIndex: LastIndex<T>,
		private readonly rotation: IndexRotation<T>
	) {}
}

/**
 * Class for keeping track of filled and free space inside of
 * `RotationBuffer` instances. Takes account of the `EmptinessTracker`
 * flag instance employed.
 */
class SpaceData<T = any> {
	private readonly filledCalc: FilledSpaceCalculator<T>

	static builder<T = any>() {
		return new SpaceDataBuilder<T>()
	}

	free() {
		return this.sizeObj.get() - this.filled()
	}

	filled() {
		return this.empty.is() ? 0 : this.filledCalc.get()
	}

	isFull() {
		return this.free() === 0
	}

	constructor(
		private readonly sizeObj: BufferSize<T>,
		lastIndex: LastIndex<T>,
		rotation: IndexRotation<T>,
		readonly empty: EmptinessTracker
	) {
		this.filledCalc = new FilledSpaceCalculator(
			sizeObj,
			lastIndex,
			rotation
		)
	}
}

/**
 * A Builder class for the `SpaceData`,
 * configured with the given
 * `lastIndex: LastIndex<T>` and
 * `rotation: IndexRotation<T>`
 */
class SpaceDataBuilder<T = any> {
	private _lastIndex?: LastIndex<T>
	private _rotation?: IndexRotation<T>

	lastIndex(lastIndex: LastIndex<T>) {
		this._lastIndex = lastIndex
		return this
	}

	rotation(rotation: IndexRotation<T>) {
		this._rotation = rotation
		return this
	}

	build(sizeObj: BufferSize<T>, empty: EmptinessTracker) {
		assert(this._lastIndex)
		assert(this._rotation)
		return new SpaceData(sizeObj, this._lastIndex, this._rotation, empty)
	}
}

/**
 * This is a class encapsulating methods necessary to perform
 * space allocation operations on `RotationBuffer` data, signaling,
 * in the process, necessary changes to the other responsible objects
 * (most notably - one responsible for the keeping of the buffer's size).
 */
class SpaceAllocator<T = any> {
	private get sizeObj() {
		return this.rawItems.sizeObj
	}

	private get rotation() {
		return this.rawItems.rotation
	}

	private get empty() {
		return this.space.empty
	}

	/**
	 * Performs a re-ordering of items of the owning `RotationBuffer` (if necessary).
	 * Accomplishes this by removing all rotation (if present), shifing items on the
	 * right to the left, and the items on the left to the right, to produce traditional
	 * layout of the underlying array's elements.
	 */
	private reOrder() {
		if (this.rotation.isPresent() && !this.empty.is()) {
			const left = this.rawItems.left()
			const rightSize = this.rawItems.rightSize()
			this.rawItems.shiftLeftward(rightSize)
			this.rawItems.fill(rightSize, left)
			this.reset()
		}
	}

	/**
	 * Makes sure that the internal array of the `RotationBuffer` is
	 * no longer rotated (includes both its offset and max-read index).
	 * Does not, however, render present items invalid (expects re-ordering of
	 * items to be handled elsewhere).
	 */
	reset() {
		this.rotation.reset()
		this.lastIndex.reset()
	}

	/**
	 * Allocates `space` new items, by reordering (internally) the data of `RotationBuffer`,
	 * and signaling an increased in size across all the composite objects that permit it to
	 * function.
	 */
	alloc(space: number) {
		if (space > 0) {
			this.reOrder()
			this.sizeObj.incBy(space)
		}
	}

	constructor(
		public readonly rawItems: RawItems<T>,
		public readonly space: SpaceData<T>,
		public readonly lastIndex: LastIndex<T>
	) {}
}

/**
 * A class representing the boundries
 * of space used by the `Space` sub-object
 * of `RotationBuffer`.
 */
class Space<T = any> {
	private get rotation() {
		return this.rawItems.rotation
	}

	private get empty() {
		return this.space.empty
	}

	private get rawItems() {
		return this.allocator.rawItems
	}

	private get space() {
		return this.allocator.space
	}

	private get lastIndex() {
		return this.allocator.lastIndex
	}

	/**
	 * Maximum presently allowed movement-space for
	 * the last-index relative to `n`.
	 */
	private maxLastIndexIncrease(n: number) {
		return min(this.space.free(), n)
	}

	/**
	 * Moves the last index the maximum possible number of
	 * positions in respect to `n`, before returning that
	 * number back to the caller.
	 */
	private moveEnd(n: number) {
		const maxIncrease = this.maxLastIndexIncrease(n)
		this.lastIndex.moveForward(maxIncrease)
		return maxIncrease
	}

	private newItemsAllocated(maxAlloc: number) {
		const maxLastIndexInc = this.moveEnd(maxAlloc)
		return maxAlloc - maxLastIndexInc
	}

	reset() {
		this.allocator.reset()
	}

	renew() {
		this.rotation.reset()
		this.lastIndex.unset()
		this.empty.markIs()
	}

	/**
	 * Ensure that there is at least `by` positions free
	 * for writing (i.e. unreserved by existing elements)
	 * inside the internal array.
	 */
	reserveNew(positions: number) {
		this.allocator.alloc(this.newItemsAllocated(positions))
	}

	constructor(private readonly allocator: SpaceAllocator<T>) {}
}

/**
 * Represents a class responsible for the
 * low-level manipulation of the `items` of
 * the `RotationBuffer` instance.
 */
class RawItems<T = any> {
	shiftLeftward(rightSize: number) {
		for (let i = 0; i < rightSize; ++i)
			this.items[i] = this.items[i + rightSize]
	}

	rightSize() {
		return this.sizeObj.get() - this.rotation.get()
	}

	left() {
		return this.items.slice(0, this.rotation.get() + 1)
	}

	fill(from: number, items: T[]) {
		const size = this.sizeObj.get()
		for (let i = from; i < size; ++i) this.items[i] = items[i]
	}

	read(i: number) {
		return this.items[this.rotation.shifted(i)]
	}

	write(i: number, item: T) {
		this.items[this.rotation.shifted(i)] = item
	}

	readAll() {
		return [...this]
	}

	writeAll(after: number, items: readonly T[]) {
		for (let i = 0; i < items.length; ++i) this.write(after + i, items[i])
	}

	*[Symbol.iterator]() {
		const size = this.sizeObj.get()
		for (let i = 0; i < size; ++i) yield this.read(i)
	}

	constructor(
		private readonly items: T[],
		readonly sizeObj: BufferSize<T>,
		readonly rotation: IndexRotation<T>
	) {}
}

function isItemsConvertible<T = any>(maxSize: any): maxSize is number | T[] {
	return (isNumber(maxSize) && maxSize > 0) || isArray(maxSize)
}

function toItems<T = any>(maxSize: number | T[]) {
	return isNumber(maxSize) ? new Array(maxSize) : maxSize
}

/**
 * This is a buffer-like object employed by the `PeekStream`
 * for the purpose of efficiently keeping track of a finite
 * number of items of type `T`, while shifting-unshifting
 * new items from it, *without* the need to actually reallocate
 * the object itself (as is the case with `Array.prototype.shift/unshift`).
 *
 * This way, the `RotationBuffer` is allocated ONCE and is reallocated
 * never. Its usgae gives birth to less GC-intensive code.
 */
export class RotationBuffer<T = any> {
	private ["constructor"]: new (n: number | T[]) => this

	private readonly empty = new EmptinessTracker()

	private readonly lastIndex: LastIndex<T>
	private readonly rotation: IndexRotation<T>
	private readonly spaceData: SpaceData<T>
	private readonly rawItems: RawItems<T>
	private readonly space: Space<T>

	get size() {
		return this.spaceData.filled()
	}

	first() {
		return this.read(0)
	}

	last() {
		return this.read(this.lastIndex.get())
	}

	forward(n: number = 1) {
		this.rotation.forward(n)
	}

	backward() {
		if (this.spaceData.isFull()) this.space.renew()
		else this.rotation.backward()
		return this.empty.is()
	}

	read(i: number) {
		return this.rawItems.read(i)
	}

	push(items: readonly T[]) {
		this.space.reserveNew(items.length)
		this.rawItems.writeAll(this.size, items)
		if (this.empty.is()) this.empty.markNot()
		return this
	}

	clear() {
		this.space.reset()
		this.empty.markIs()
	}

	copy() {
		return new this.constructor(this.rawItems.readAll())
	}

	constructor(maxSize: number | T[]) {
		assert(isItemsConvertible(maxSize))
		const items = toItems(maxSize)
		const sizeObj = new BufferSize(items)

		this.lastIndex = new LastIndex(sizeObj)
		this.rotation = new IndexRotation(sizeObj)
		this.rawItems = new RawItems(items, sizeObj, this.rotation)

		this.spaceData = SpaceData.builder<T>()
			.lastIndex(this.lastIndex)
			.rotation(this.rotation)
			.build(sizeObj, this.empty)

		this.space = new Space(
			new SpaceAllocator(this.rawItems, this.spaceData, this.lastIndex)
		)
	}
}
