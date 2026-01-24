import { array, inplace, type } from "@hgargg-0710/one"
import { type IDepthMark, Pools } from "../../../main.js"
import { MissingArgument } from "../../constants.js"
import type {
	IDepthMarked,
	IFreeable,
	IInitializable,
	IPoolable
} from "../../interfaces.js"
import type { IArray } from "../../interfaces/Array.js"
import { Initializable } from "../../objects/Initializable.js"
import { ObjectPool } from "../../objects/ObjectPool.js"

const { insert, mutate, out } = inplace
const { first, clear } = array
const { isUndefined } = type

type IDerivedPipe<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> = RecursivePipe.Poolable<T, Recursive, InitType>

type IRecursivelySwitchable<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> = Terminal<T, Recursive, InitType> | Switch<T, Recursive, InitType>

type IRecursiveItems<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> = IRecursivelySwitchable<T, Recursive, InitType>[]

type IPreRecursiveItems<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> = (IRecursivelySwitchable<T, Recursive, InitType> | T | Recursive)[]

export interface ITerminalAcceptable
	extends IInitializable, IFreeable, Partial<IDepthMarked> {}

function isSwitch<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
>(x: any): x is Switch<T, Recursive, InitType> {
	return x instanceof Switch
}

/**
 * This is a class for representing entities
 * that are capable of keeping their
 * `itemIndex: number` - a property describing
 * their position inside their `.parentArray`-`WrapArray`,
 * crucial for the item-renewal algorithm.
 */
abstract class ItemIndexHaving {
	private _itemIndex: number

	private set itemIndex(index: number) {
		this._itemIndex = index
	}

	get itemIndex() {
		return this._itemIndex
	}

	setItemIndex(itemIndex: number): void {
		this.itemIndex = itemIndex
	}
}

/**
 * This is a class for keeping track of recursion points
 * in the pipe. Specifically, a `Switch` represents a
 * point for introduction of a sub-array of connected items,
 * which can be renewed upon the non-revivable "final death"
 * of at least one of the items inside the array.
 */
export class Switch<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
>
	extends ItemIndexHaving
	implements IPoolable<[Recursive]>
{
	static wrap<
		T extends ITerminalAcceptable = any,
		Recursive = any,
		InitType = any
	>(recursive: Recursive): Switch<T, Recursive, InitType> {
		return Switch.pool.create(recursive)
	}

	private static readonly pool = Pools.Internal.add(
		new ObjectPool<Switch, [any]>(Switch)
	)

	private _recursive: Recursive | null = null
	private _pipe: IDerivedPipe<T, Recursive, InitType> | null = null
	private renewer: RecursivePipe.Renewer<T, Recursive, InitType>

	private set recursive(newRecursive: Recursive) {
		this._recursive = newRecursive
	}

	private set pipe(x: IDerivedPipe<T, Recursive, InitType>) {
		this._pipe = x
	}

	get recursive() {
		return this._recursive!
	}

	get pipe() {
		return this._pipe!
	}

	get poolId() {
		return Switch.pool.id
	}

	postFree(): void {
		this._pipe = null
		this._recursive = null
	}

	expand(appliedUpon: T | InitType) {
		this.pipe = this.renewer.evaluate(this.recursive, appliedUpon)
	}

	init(recursive?: Recursive) {
		if (!isUndefined(recursive)) this.recursive = recursive
		return this
	}

	recycleSubs() {
		this.pipe.recycle()
	}

	recycle() {
		this.recycleSubs()
		Switch.pool.free(this)
	}

	constructor(recursive?: Recursive) {
		super()
		this.init(recursive)
	}
}

/**
 * This is a wrapper-class around a terminal
 * `T extends ITerminalAcceptable`. It can
 * be contrasted with a `Switch` via `.isSwitch: boolean`.
 * Besides this, it is embedded with functionality to
 * implement individual renewal algorithm (`.itemIndex`, `.parentArray`)
 */
class Terminal<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
>
	extends ItemIndexHaving
	implements IPoolable<[T]>
{
	static wrap<
		T extends ITerminalAcceptable = any,
		Recursive = any,
		InitType = any
	>(terminal: T): Terminal<T, Recursive, InitType> {
		return Terminal.pool.create(terminal)
	}

	private static readonly pool = Pools.Internal.add(
		new ObjectPool<Terminal, [any]>(Terminal)
	)

	private _terminal: T | null = null
	private _parentArray: WrapArray<T, Recursive, InitType> | null = null

	private set terminal(terminal: T) {
		this._terminal = terminal
	}

	private set parentArray(array: WrapArray<T, Recursive, InitType>) {
		this._parentArray = array
	}

	get terminal() {
		return this._terminal!
	}

	get parentArray() {
		return this._parentArray!
	}

	setParentArray(parentArray: WrapArray<T, Recursive, InitType>): void {
		this.parentArray = parentArray
	}

	init(terminal?: T) {
		if (terminal) this.terminal = terminal
		return this
	}

	recycle() {
		this.terminal.free()
		Terminal.pool.free(this)
	}

	postFree(): void {
		this._parentArray = null
		this._terminal = null
	}

	get poolId() {
		return Terminal.pool.id
	}

	constructor(terminal?: T) {
		super()
		this.init(terminal)
	}
}

function unwrap<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
>(wrapped: IRecursivelySwitchable<T, Recursive, InitType>) {
	return isSwitch(wrapped) ? wrapped.recursive : wrapped.terminal
}

interface IItemsSettable {
	setItems(items: any[]): void
}

interface IRenewerSettable {
	setRenewer(renewer: RecursivePipe.Renewer): void
}

interface IDeepTerminalMapSettable<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> {
	setDeepTerminalMap(
		deepTerminalMap: DeepTerminalMap<T, Recursive, InitType>
	): void
}

interface IDepthMapSettable {
	setDepthMap(map: GlobalDepthMap): void
}

type IRecursivePipeLike = IRenewerSettable &
	IItemsSettable &
	IDeepTerminalMapSettable &
	IDepthMapSettable

const depthMapInitializer = {
	init(target: IDepthMapSettable, map?: GlobalDepthMap) {
		if (map) target.setDepthMap(map)
	}
}

const deepTerminalMapInitializer = {
	init(target: IDeepTerminalMapSettable, deepTerminalMap?: DeepTerminalMap) {
		if (deepTerminalMap) target.setDeepTerminalMap(deepTerminalMap)
	}
}

const renewerInitializer = {
	init(target: IRenewerSettable, renewer?: RecursivePipe.Renewer) {
		if (renewer) target.setRenewer(renewer)
	}
}

const itemsInitializer = {
	init(target: IItemsSettable, items?: any[]) {
		if (items) target.setItems(items)
	}
}

const baseEvaluablePipeInitializer = {
	init(
		target: IRenewerSettable & IDepthMapSettable,
		renewer?: RecursivePipe.Renewer,
		depthMap?: GlobalDepthMap
	) {
		depthMapInitializer.init(target, depthMap)
		renewerInitializer.init(target, renewer)
	}
}

const recursivePipeInitializer = {
	init(target: IRecursivePipeLike, args: RecursivePipeArgs) {
		const { renewer, items, deepTerminalMap, depthMap } = args
		depthMapInitializer.init(target, depthMap)
		deepTerminalMapInitializer.init(target, deepTerminalMap)
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

/**
 * This is a general abstract class for all
 * entities that require a presence of a
 * dependency-inversion-based
 * `renewer: RecursivePipe.Renewer<T, Recursive, InitType>`
 * reference. It provides accordingi `initializer`,
 * as well as extending `Initializable<[RecursivePipe.Renewer<T, Recursive, InitType>]`.
 */
abstract class RenewerHaving<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any,
	Args extends any[] = []
>
	extends Initializable<
		[RecursivePipe.Renewer<T, Recursive, InitType>, ...Args]
	>
	implements IRenewerSettable
{
	private _renewer: RecursivePipe.Renewer<T, Recursive, InitType>

	private set renewer(
		newRenewer: RecursivePipe.Renewer<T, Recursive, InitType>
	) {
		this._renewer = newRenewer
	}

	get renewer() {
		return this._renewer
	}

	setRenewer(renewer: RecursivePipe.Renewer<T, Recursive, InitType>): void {
		this.renewer = renewer
	}

	protected get initializer() {
		return renewerInitializer
	}
}

/**
 * This is a class for representing a renewer extension capable
 * of interpreting `IRecursivelySwitchable<T, Recursive, InitType>`
 * as a live `T` instance that is attached to the `Terminal/Switch`
 * in question. The `T` in question is either `switchable.terminal`
 * for a `switchable: Terminal` and `switchable.pipe.firstItemDeep()`
 * for the `switchable: Switch` (i.e. first non-recursive item of
 * the pipe).
 */
class UniversalRenewer<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends RenewerHaving<T, Recursive, InitType> {
	private asTerminal(
		switchable: IRecursivelySwitchable<T, Recursive, InitType>
	) {
		return isSwitch(switchable)
			? switchable.pipe.firstItemDeep()
			: switchable.terminal
	}

	isOld(switchable: IRecursivelySwitchable<T, Recursive, InitType>) {
		return this.renewer.isOld(this.asTerminal(switchable))
	}
}

/**
 * The class for encapsulating the shared state of
 * `.lastInitialized: T | null`. The purpose is to
 * ensure that the three different "Pipe" classes
 * all have the same version of the variable,
 * and can modify/access it as-necessary.
 */
class LastInitialized<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> {
	private lastInitialized: T | null = null

	get() {
		return this.lastInitialized
	}

	linkEvaluatedSubpipe(subpipe: RecursivePipe<T, Recursive, InitType>) {
		this.linkNew(subpipe.firstItemDeep())
	}

	linkNew(hasBeenLastInitialized: T) {
		this.lastInitialized = hasBeenLastInitialized
	}

	unlinkOld() {
		this.lastInitialized = null
	}
}

/**
 * An abstract class encapsulating the basic internal operations
 * on "recursive pipes" - ability to evaluate a given item, with
 * a given "something: T | InitType", capability of being enabled with a
 * `protected readonly renewer: RecursivePipe.Renewer<T, Recursive, InitType>`,
 * as well as the `.init` method that expects a `RecursivePipe.Renewer`.
 */
abstract class BaseEvaluablePipe<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends RenewerHaving<T, Recursive, InitType, [GlobalDepthMap<T>]> {
	private depthMap: GlobalDepthMap<T>

	private markDepth(terminal: T) {
		this.depthMap.incFor(terminal)
	}

	private expandEvaluated(
		fillable: Switch<T, Recursive, InitType>,
		evaledWith: T | InitType
	) {
		fillable.recycleSubs()
		fillable.expand(evaledWith)
	}

	protected fillSwitch(
		fillable: Switch<T, Recursive, InitType>,
		evaledWith: T | InitType
	) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateSubpipe(fillable.pipe, evaledWith)
	}

	protected override get initializer() {
		return baseEvaluablePipeInitializer
	}

	protected initTerminal(toInitialize: T, initParam: T | InitType) {
		this.markDepth(toInitialize)
		toInitialize.init(initParam)
	}

	protected evaluateSubpipe(
		subpipe: RecursivePipe<T, Recursive, InitType>,
		evaledWith: T | InitType
	) {
		subpipe.evaluate(evaledWith)
	}

	setDepthMap(map: GlobalDepthMap) {
		this.depthMap = map
	}
}

/**
 * The base class for `RenewablePipe` and `EvaluablePipe`,
 * enabling tracking of the last item evaluated, which is
 * essential for the two algorithms in question.
 */
abstract class EvaluablePipeWithLastItem<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends BaseEvaluablePipe<T, Recursive, InitType> {
	protected pickLastItem(evalWith: T | InitType) {
		return this.lastInitialized.get() || evalWith
	}

	protected override evaluateSubpipe(
		subpipe: RecursivePipe<T, Recursive, InitType>,
		evaledWith: T | InitType
	) {
		super.evaluateSubpipe(subpipe, evaledWith)
		this.lastInitialized.linkEvaluatedSubpipe(subpipe)
	}

	protected override initTerminal(toInitialize: T, initParam: T | InitType) {
		super.initTerminal(toInitialize, initParam)
		this.lastInitialized.linkNew(toInitialize)
	}

	constructor(
		protected readonly lastInitialized: LastInitialized<
			T,
			Recursive,
			InitType
		>,
		protected readonly items: WrapArray<T, Recursive, InitType>
	) {
		super()
	}
}

/**
 * This is an add-on `BaseEvaluablePipe<T, Recursive, InitType>` class,
 * whose objects are capable of being used for introducing the `initSwitchable`
 * into `BaseEvaluablePipe`-deriving classes via delegation in cases,
 * where it would (otherwise) would have been difficult/impossible.
 */
class SwitchableEvaluator<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends BaseEvaluablePipe<T, Recursive, InitType> {
	evalSwitchable(
		toInitialize: IRecursivelySwitchable<T, Recursive, InitType>,
		initParam: T | InitType
	) {
		if (isSwitch<T, Recursive, InitType>(toInitialize))
			this.fillSwitch(toInitialize, initParam)
		else this.initTerminal(toInitialize.terminal, initParam)
	}
}

/**
 * This is an object for encapsulating the `foundSwitch: boolean` flag
 * of `RenewablePipe`.
 */
class FoundSwitchFlag {
	private foundSwitch: boolean = false

	get() {
		return this.foundSwitch
	}

	found() {
		this.foundSwitch = true
	}

	forget() {
		this.foundSwitch = false
	}
}

/**
 * The `.renew` method is the one where the `CompositeStream`
 * spends most of its time in. More specifically, it is the place
 * where the given `.items: WrapArray` gets re-checked for being
 * no longer acceptable [i.e. that there is, now, a "terminal" which `.isOld`].
 * In such an eventuality, the further attempts to re-evalute the
 * `.items` are no longer pursued, at which point, one simply
 * quits and returns `false`.
 */
class RenewablePipe<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends EvaluablePipeWithLastItem<T, Recursive, InitType> {
	private readonly foundSwitch = new FoundSwitchFlag()

	private refillSubpipeIn(
		currSwitch: Switch<T, Recursive, InitType>,
		lastItem: T | InitType
	) {
		const subpipe = currSwitch.pipe
		if (!subpipe.renewAll(lastItem)) this.fillSwitch(currSwitch, lastItem)
		else this.lastInitialized.linkEvaluatedSubpipe(subpipe)
	}

	/**
	 * Attempts to renew the `.isOld()` terminal `old`,
	 * with `last`, and returns `false` in an event that
	 * this was not possible to achieve (i.e. either no
	 * "living" `Switch` has been found, or, the current item
	 * itself is unrenewable). In case the operation is successful,
	 * `true` is returned.
	 */
	private tryRenewOldTerminal(old: T, last: T | InitType) {
		if (!this.foundSwitch.get()) return false
		this.initTerminal(old, last)
		return this.renewer.isOld(old)
	}

	private refillSwitch(
		currSwitch: Switch<T, Recursive, InitType>,
		lastItem: T | InitType
	) {
		this.foundSwitch.found()
		this.refillSubpipeIn(currSwitch, lastItem)
		return true
	}

	private linkNonOldTerminal(currTerminal: T) {
		this.lastInitialized.linkNew(currTerminal)
		return true
	}

	private maybeReinitTerminal(currTerminal: T, lastTerminal: T | InitType) {
		return this.renewer.isOld(currTerminal)
			? this.tryRenewOldTerminal(currTerminal, lastTerminal)
			: this.linkNonOldTerminal(currTerminal)
	}

	private maybeReinitSwitchable(
		currItem: IRecursivelySwitchable<T, Recursive, InitType>,
		lastItem: T | InitType
	) {
		return isSwitch<T, Recursive, InitType>(currItem)
			? this.refillSwitch(currItem, lastItem)
			: this.maybeReinitTerminal(currItem.terminal, lastItem)
	}

	private renewEach(evalWith: T | InitType) {
		for (const curr of this.items)
			if (!this.maybeReinitSwitchable(curr, this.pickLastItem(evalWith)))
				return false
		return true
	}

	renew(evaledWith: T | InitType) {
		this.foundSwitch.forget()
		this.lastInitialized.unlinkOld()
		return this.renewEach(evaledWith)
	}
}

/**
 * The `.evaluate()` is the first call that
 * properly evaluates the `.items: WrapArray`.
 * However, it is only called on re-initialization
 * of `CompositeStream`. Any further work on the
 * internal `.items` is handled by the `.renew`
 */
class EvaluablePipe<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends EvaluablePipeWithLastItem<T, Recursive, InitType> {
	private readonly evaluator = new SwitchableEvaluator<
		T,
		Recursive,
		InitType
	>()

	override setRenewer(
		renewer: RecursivePipe.Renewer<T, Recursive, InitType>
	): void {
		super.setRenewer(renewer)
		this.evaluator.setRenewer(renewer)
	}

	override setDepthMap(map: GlobalDepthMap): void {
		super.setDepthMap(map)
		this.evaluator.setDepthMap(map)
	}

	private evaluateEach(origTerm: T | InitType) {
		for (const curr of this.items)
			this.evaluator.evalSwitchable(curr, this.pickLastItem(origTerm))
	}

	evaluate(origTerm: T | InitType) {
		this.lastInitialized.unlinkOld()
		this.evaluateEach(origTerm)
	}
}

/**
 * This is a map-like view of the `items: WrapArray<T, Recursive, InitType>`
 * intended to provide one with a way to obtain the current
 * `IRecursiveSwitchable<T, Recursive, InitType>`-representation of a given `T`
 * via the `.getBy` method, as well as to perform bookkeeping
 * operations via the `.register/.unregister` calls on a given
 * `IRecursiveSwitchable` instance.
 *
 * The `.getBy` method, in particular, is the one that makes the
 * `RecursivePipe.prototype.renewItem` method implementation feasible.
 */
export class DeepTerminalMap<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> {
	private readonly byTerminals: Map<
		T,
		[WrapArray<T, Recursive, InitType>, number]
	> = new Map()

	private findTerminal(terminal: T) {
		return this.byTerminals.get(terminal)!
	}

	unregister(terminal: Terminal<T, Recursive, InitType>) {
		this.byTerminals.delete(terminal.terminal)
	}

	register(
		terminal: Terminal<T, Recursive, InitType>,
		parent: WrapArray<T, Recursive, InitType>,
		index: number
	) {
		this.byTerminals.set(terminal.terminal, [parent, index])
	}

	getBy(terminal: T) {
		const [parent, index] = this.findTerminal(terminal)
		// The reasoning here is - since one follows encapsulation,
		// and only ever puts `Terminal<T, Recursive, InitType>`, it is obvious
		// that this will be the type we'll get, and not a `Switch`
		return parent.get(index) as Terminal<T, Recursive, InitType>
	}

	constructor(readonly items: WrapArray<T, Recursive, InitType>) {}
}

/**
 * This is a `RecursivePipe` variation capable of renewing an item at a
 * specific index. In event that the renewal in question turns out to be
 * impossible (due to item relying on something else that has already
 * finished and, itself, *cannot* be renewed), one throws a corresponding
 * exception.
 */
class PinpointRenewablePipe<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> extends BaseEvaluablePipe<T, Recursive, InitType> {
	private readonly evaluator = new SwitchableEvaluator()
	private readonly uniRenewer = new UniversalRenewer(this.renewer)

	private foundNonOld(
		firstNonOldIndex: number,
		parent: WrapArray<T, Recursive, InitType>
	) {
		return firstNonOldIndex !== parent.size
	}

	private itemAhead(of: number) {
		return of + 1
	}

	private getTerminalAfter(
		from: number,
		parent: WrapArray<T, Recursive, InitType>
	) {
		return parent.get(this.itemAhead(from)) as Terminal<
			T,
			Recursive,
			InitType
		>
	}

	private renewNeeded(
		from: number,
		to: number,
		parent: WrapArray<T, Recursive, InitType>
	) {
		let initItem = this.getTerminalAfter(from, parent).terminal
		for (let i = from; i >= to; --i) {
			const currItem = parent.get(i)
			this.evaluator.evalSwitchable(currItem, initItem)
			initItem = this.renewer.prevItem(initItem)
		}
	}

	private lastNonOldIndex(
		item: Terminal<T, Recursive, InitType>
	): [number, WrapArray<T, Recursive, InitType>] {
		const parent = item.parentArray
		let currItem: IRecursivelySwitchable<T, Recursive, InitType> = item
		let i: number = item.itemIndex
		while (i < parent.size && this.uniRenewer.isOld(currItem))
			currItem = parent.get(i++)
		return [i, parent]
	}

	private lastNonOldItem(
		item: Terminal<T, Recursive, InitType>
	): [boolean, number] {
		const [i, parent] = this.lastNonOldIndex(item)
		return [this.foundNonOld(i, parent), i]
	}

	private firstOldItem(
		item: Terminal<T, Recursive, InitType>
	): [boolean, number] {
		const [foundNonOld, lastNonOld] = this.lastNonOldItem(item)
		return [foundNonOld, lastNonOld - 1]
	}

	private renewOldItem(item: Terminal<T, Recursive, InitType>) {
		const [foundNonOld, firstOldItem] = this.firstOldItem(item)
		if (foundNonOld)
			this.renewNeeded(firstOldItem, item.itemIndex, item.parentArray)
		return foundNonOld
	}

	override setRenewer(
		renewer: RecursivePipe.Renewer<T, Recursive, InitType>
	): void {
		super.setRenewer(renewer)
		this.evaluator.setRenewer(renewer)
	}

	override setDepthMap(map: GlobalDepthMap): void {
		super.setDepthMap(map)
		this.evaluator.setDepthMap(map)
	}

	/**
	 * Renews a given terminal `item: T`, provided it is
	 * a part of the current item-pipe.
	 */
	renewItem(item: Terminal<T, Recursive, InitType>) {
		return this.renewer.isOld(item.terminal)
			? this.renewOldItem(item)
			: true
	}
}

class GlobalDepthMap<T extends ITerminalAcceptable = any> {
	private readonly depths = new Map<IDepthMark, number>()

	private set(mark: IDepthMark, depth: number) {
		this.depths.set(mark, depth)
		return depth
	}

	private hasMark(item: T) {
		return !!item.depthMarks
	}

	private for(terminal: T, callback: (mark: IDepthMark) => void) {
		if (this.hasMark(terminal))
			for (const mark in terminal.depthMarks!) callback(mark)
	}

	incFor(terminal: T) {
		this.for(terminal, (mark) => this.inc(mark))
	}

	decFor(terminal: T) {
		this.for(terminal, (mark) => this.dec(mark))
	}

	inc(mark: IDepthMark) {
		return this.set(mark, this.get(mark) + 1)
	}

	dec(mark: IDepthMark) {
		const depth = this.get(mark)
		if (depth > 0) this.set(mark, depth - 1)
	}

	get(mark: IDepthMark) {
		return this.depths.get(mark) || 0
	}
}

class RecursivePipeArgsBuilder<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> implements IDeepTerminalMapSettable<T, Recursive, InitType> {
	static readonly instance = new RecursivePipeArgsBuilder()

	private renewer?: RecursivePipe.Renewer<T, Recursive, InitType>
	private items?: (T | Recursive)[]
	private deepTerminalMap?: DeepTerminalMap<T, Recursive, InitType>
	private depthMap?: GlobalDepthMap

	reset() {
		this.renewer = MissingArgument
		this.items = MissingArgument
		this.deepTerminalMap = MissingArgument
		this.depthMap = MissingArgument
	}

	setRenewer(renewer: RecursivePipe.Renewer<T, Recursive, InitType>) {
		this.renewer = renewer
		return this
	}

	setItems(items: (T | Recursive)[]) {
		this.items = items
		return this
	}

	setDeepTerminalMap(
		deepTerminalMap: DeepTerminalMap<T, Recursive, InitType>
	) {
		this.deepTerminalMap = deepTerminalMap
		return this
	}

	setDepthMap(depthMap: GlobalDepthMap) {
		this.depthMap = depthMap
		return this
	}

	build(): RecursivePipeArgs<T, Recursive, InitType> {
		return RecursivePipeArgs.instance.init(
			this.renewer,
			this.items,
			this.deepTerminalMap,
			this.depthMap
		)
	}

	private constructor() {}
}

export class RecursivePipeArgs<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
> {
	static readonly instance = new RecursivePipeArgs()

	private _renewer?: RecursivePipe.Renewer<T, Recursive, InitType>
	private _items?: (T | Recursive)[]
	private _deepTerminalMap?: DeepTerminalMap<T, Recursive, InitType>
	private _depthMap?: GlobalDepthMap<T>

	get renewer() {
		return this._renewer
	}

	get items() {
		return this._items
	}

	get deepTerminalMap() {
		return this._deepTerminalMap
	}

	get depthMap() {
		return this._depthMap
	}

	static build<
		T extends ITerminalAcceptable = any,
		Recursive = any,
		InitType = any
	>(): RecursivePipeArgsBuilder<T, Recursive, InitType> {
		const builder = RecursivePipeArgsBuilder.instance
		builder.reset()
		return builder
	}

	init(
		renewer?: RecursivePipe.Renewer<T, Recursive, InitType>,
		items?: (T | Recursive)[],
		deepTerminalMap?: DeepTerminalMap<T, Recursive, InitType>,
		depthMap?: GlobalDepthMap
	) {
		this._renewer = renewer
		this._items = items
		this._deepTerminalMap = deepTerminalMap
		this._depthMap = depthMap
		return this
	}

	private constructor() {}
}

const wrapArrayInitializer = {
	init(target: WrapArray, items?: any[], renewer?: RecursivePipe.Renewer) {
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

/**
 * This is a class that encapsulates the `IRecursiveItems`
 * of the `RecursivePipe`, and which is used by the user
 * via the `IStreamArray` whenever modifying the internal
 * structure of a `DynamicParser`.
 */
export class WrapArray<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any
>
	extends Initializable<
		[
			IRecursiveItems<T, Recursive, InitType>,
			RecursivePipe.Renewer<T, Recursive, InitType>
		]
	>
	implements IArray<T | Recursive>
{
	private _items: IRecursiveItems<T, Recursive, InitType>
	private renewer: RecursivePipe.Renewer<T, Recursive, InitType>

	private set items(newItems: IRecursiveItems<T, Recursive, InitType>) {
		this._items = newItems
	}

	get items() {
		return this._items
	}

	get size() {
		return this.items.length
	}

	private maybeWrapSwitchMult(items: (T | Recursive)[]) {
		return mutate(items, (r: T | Recursive) => this.maybeWrapSwitch(r))
	}

	private baseWrite(
		i: number,
		value: IRecursivelySwitchable<T, Recursive, InitType>
	) {
		this.items[i] = value
	}

	private maybeWrapSwitch(r: T | Recursive) {
		return this.renewer.wrap(r)
	}

	setRenewer(renewer: RecursivePipe.Renewer<T, Recursive, InitType>) {
		this.renewer = renewer
	}

	setItems(items: IRecursiveItems<T, Recursive, InitType>) {
		this.items = items
	}

	protected get initializer() {
		return wrapArrayInitializer
	}

	write(i: number, value: T | Recursive) {
		const currItem = this.get(i)
		if (!this.renewer.isRecursive(value))
			this.baseWrite(i, Terminal.wrap(value))
		else if (isSwitch(currItem)) currItem.init(value)
		else this.baseWrite(i, Switch.wrap(value))
		return this
	}

	get(i: number) {
		return this.items[i]
	}

	read(i: number) {
		return unwrap(this.items[i])
	}

	push(...items: (T | Recursive)[]) {
		this.items.push(...this.maybeWrapSwitchMult(items))
		return this
	}

	pop(count = 1) {
		this.items.length -= count
		return this
	}

	insert(i: number, ...values: (T | Recursive)[]) {
		insert(this.items, i, ...this.maybeWrapSwitchMult(values))
		return this
	}

	remove(i: number, count = 1) {
		out(this.items, i, count)
		return this
	}

	shift(count = 1) {
		this.items = this.items.slice(count)
		return this
	}

	unshift(...values: (T | Recursive)[]) {
		this.items.unshift(...this.maybeWrapSwitchMult(values))
		return this
	}

	each(callback: (x: T | Recursive, i?: number) => void) {
		for (let i = this.size; i--; ) callback(this.read(i), i)
		return this
	}

	clear() {
		clear(this.items)
		return this
	}

	fill(newItems: (T | Recursive)[]) {
		this.clear()
		this.items = this.maybeWrapSwitchMult(newItems)
		return this
	}

	first() {
		return first(this.items)
	}

	*[Symbol.iterator]() {
		for (let i = this.size; i--; ) yield this.items[i]
	}
}

/**
 * This is the primary data structure for implementing the
 * library's self-modifying parser. Particularly, it is responsible
 * for keeping track of the list of items that may or may not
 * be leading to recursion within the structure of the pipe.
 */
export class RecursivePipe<
	T extends ITerminalAcceptable = any,
	Recursive = any,
	InitType = any,
	InitArgs extends any[] = []
>
	extends Initializable<
		[RecursivePipeArgs<T, Recursive, InitType>, ...(InitArgs | [])]
	>
	implements IDeepTerminalMapSettable
{
	readonly items = new WrapArray<T, Recursive, InitType>()
	private readonly asEvaluable: EvaluablePipe<T, Recursive, InitType>
	private readonly asRenewable: RenewablePipe<T, Recursive, InitType>

	protected depthMap: GlobalDepthMap<T>
	protected asDeepMap: DeepTerminalMap<T, Recursive, InitType>
	protected renewer: RecursivePipe.Renewer<T, Recursive, InitType>

	private adoptChild(terminal: Terminal<T, Recursive, InitType>) {
		terminal.setParentArray(this.items)
	}

	private register(
		terminal: Terminal<T, Recursive, InitType>,
		index: number
	) {
		this.asDeepMap.register(terminal, this.items, index)
	}

	private newTerminal(
		terminal: Terminal<T, Recursive, InitType>,
		at: number
	) {
		this.adoptChild(terminal)
		this.register(terminal, at)
	}

	private toWrapped(fromArr: (T | Recursive)[], atIndex: number) {
		const wrapped = this.renewer.wrap(fromArr[atIndex])
		wrapped.setItemIndex(atIndex)
		if (!isSwitch(wrapped)) this.newTerminal(wrapped, atIndex)
		return wrapped
	}

	private firstItem() {
		return this.items.first()
	}

	protected get initializer() {
		return recursivePipeInitializer
	}

	setDepthMap(map: GlobalDepthMap) {
		this.depthMap = map
	}

	setDeepTerminalMap(
		deepTerminalMap: DeepTerminalMap<T, Recursive, InitType>
	) {
		this.asDeepMap = deepTerminalMap
	}

	setRenewer(renewer: RecursivePipe.Renewer<T, Recursive, InitType>) {
		this.renewer = renewer
		this.items.init(MissingArgument, renewer)
		this.asEvaluable.init(renewer)
		this.asRenewable.init(renewer)
	}

	setItems(newItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive, InitType> = newItems
		for (let i = newItems.length; i--; )
			mutItems[i] = this.toWrapped(newItems, i)
		this.items.init(mutItems as IRecursiveItems<T, Recursive, InitType>)
	}

	firstItemDeep(): T {
		const firstItem = this.firstItem()
		return isSwitch<T, Recursive, InitType>(firstItem)
			? firstItem.pipe.firstItemDeep()
			: firstItem.terminal
	}

	renewAll(initial: T | InitType) {
		return this.asRenewable.renew(initial)
	}

	evaluate(initial: T | InitType) {
		this.asEvaluable.evaluate(initial)
	}

	constructor(
		args: RecursivePipeArgs<T, Recursive, InitType>,
		...rest: Partial<InitArgs> | []
	) {
		super()
		const lastInitialized = new LastInitialized()
		this.asEvaluable = new EvaluablePipe(lastInitialized, this.items)
		this.asRenewable = new RenewablePipe(lastInitialized, this.items)
		this.init(args, ...rest)
	}
}

export namespace RecursivePipe {
	/**
	 * Responsible for keeping access to joint-access methods
	 * essential for the functioning of the `RecursivePipe` and `WrapArray`.
	 * Has the purpose of identifying "old" [those to be renewed] and "recursive"
	 * [those to be turned into `Switch`es] elements of the `RecursivePipe`.
	 * Also contains the `evaluator` method, which spits out a new `IDerivable<T, Recursive, InitType>`,
	 * based on the current `Recursive` element, and the last evaluated `T`.
	 */
	export abstract class Renewer<
		T extends ITerminalAcceptable = any,
		Recursive = any,
		InitType = any
	> {
		abstract isRecursive(x: T | Recursive): x is Recursive

		abstract isOld(terminal: T): boolean

		abstract nextItem(after: T): T

		abstract prevItem(to: T): T

		abstract evaluate(
			currRec: Recursive,
			last: T | InitType
		): IDerivedPipe<T, Recursive, InitType>

		wrap(item: T | Recursive) {
			return this.isRecursive(item)
				? Switch.wrap(item)
				: Terminal.wrap(item)
		}
	}

	/**
	 * This is an abstract class representing the root `RecursivePipe`.
	 * It delegates to a toplevel `RecursivePipe`, while also providing
	 * abstract operations to be overriden by concrete children and
	 * the Facade for the algorithms of the underlying pipe
	 * (full-pipe recursive renewal, pinpoint renewal, initial pipe
	 * evaluation, obtaining the first item deeply).
	 */
	export abstract class RootPipe<
		T extends ITerminalAcceptable = any,
		Recursive = any,
		InitType = any,
		InitArgs extends any[] = []
	> {
		protected abstract getPipe(): RecursivePipe<
			T,
			Recursive,
			InitType,
			InitArgs
		>

		protected abstract getRenewer(): Renewer<T, Recursive, InitType>

		protected readonly asDeep: DeepTerminalMap<T, Recursive, InitType>
		protected readonly renewer: Renewer<T, Recursive, InitType>

		private readonly pipe: RecursivePipe<T, Recursive, InitType, InitArgs>
		private readonly asPinpointRenewable = new PinpointRenewablePipe<
			T,
			Recursive,
			InitType
		>()

		protected readonly globalDepth = new GlobalDepthMap()

		getDepth(mark: IDepthMark) {
			return this.globalDepth.get(mark)
		}

		get items() {
			return this.pipe.items
		}

		renewItem(item: T) {
			return this.asPinpointRenewable.renewItem(this.asDeep.getBy(item))
		}

		renewAll(lastItem: InitType) {
			return this.pipe.renewAll(lastItem)
		}

		firstItemDeep() {
			return this.pipe.firstItemDeep()
		}

		evaluate(initial: InitType) {
			this.pipe.evaluate(initial)
		}

		constructor(items: (T | Recursive)[], ...args: Partial<InitArgs> | []) {
			this.renewer = this.getRenewer()
			this.pipe = this.getPipe()
			this.asDeep = new DeepTerminalMap<T>(this.items)
			this.asPinpointRenewable.init(this.renewer, this.globalDepth)
			this.pipe.init(
				RecursivePipeArgs.build()
					.setRenewer(this.renewer)
					.setItems(items)
					.setDeepTerminalMap(this.asDeep)
					.setDepthMap(this.globalDepth)
					.build()
			)
		}
	}

	/**
	 * A public wrapper around the `RecursivePipe`.
	 * It contains the iteration order and methods needed
	 * for correct recursive pool reclamation routine.
	 */
	export abstract class Poolable<
		T extends ITerminalAcceptable = any,
		Recursive = any,
		InitType = any,
		InitArgs extends any[] = []
	> extends RecursivePipe<T, Recursive, InitType, InitArgs> {
		protected abstract reclaim(pipe: Poolable<T, Recursive, InitType>): void

		private recycleAsTerminal(
			item: IRecursivelySwitchable<T, Recursive, InitType>
		) {
			if (!isSwitch(item)) {
				this.asDeepMap.unregister(item)
				this.depthMap.decFor(item.terminal)
			}
		}

		recycleSubs() {
			for (const curr of this) {
				this.recycleAsTerminal(curr)
				curr.recycle()
			}
		}

		recycle() {
			this.recycleSubs()
			this.reclaim(this)
		}

		*[Symbol.iterator]() {
			yield* this.items
		}
	}
}
