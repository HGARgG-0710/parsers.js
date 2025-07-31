import { array, inplace, type } from "@hgargg-0710/one"
import { Initializable } from "../classes/Initializer.js"
import { ObjectPool } from "../classes/ObjectPool.js"
import { MissingArgument } from "../constants.js"
import type { IInitializable, IInitializer } from "../interfaces.js"
import type { IArray } from "../interfaces/Array.js"

const { insert, mutate, out } = inplace
const { first, clear } = array
const { isUndefined } = type

interface ISwitchIdentifiable {
	readonly isSwitch?: boolean
}

type IDerivedList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = RecursiveList.Poolable<T, Recursive>

type IRecursivelySwitchable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> = Terminal<T, Recursive> | Switch<T, Recursive, InitType>

type IRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = IRecursivelySwitchable<T, Recursive>[]

type IPreRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = (IRecursivelySwitchable<T, Recursive> | T | Recursive)[]

interface ITerminal<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> extends IInitializable,
		ISwitchIdentifiable {
	readonly parentList: SwitchArray<T, Recursive>
	readonly listIndex: number

	setParentList(parentList: SwitchArray<T, Recursive>): void
	setListIndex(listIndex: number): void
}

function isSwitch<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
>(x: ISwitchIdentifiable): x is Switch<T, Recursive, InitType> {
	return x.isSwitch === true
}

abstract class ListIndexHaving {
	private _listIndex: number

	private set listIndex(index: number) {
		this._listIndex = index
	}

	get listIndex() {
		return this._listIndex
	}

	setListIndex(listIndex: number): void {
		this.listIndex = listIndex
	}
}

/**
 * This is a class for keeping track of recursion points.
 * More specifically, a 'Switch' is an "optional" recursion point.
 */
export class Switch<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends ListIndexHaving {
	private _recursive: Recursive
	private _list: IDerivedList<T, Recursive>
	private renewer: RecursiveList.Renewer<T, Recursive>

	private set recursive(newRecursive: Recursive) {
		this._recursive = newRecursive
	}

	private set list(x: IDerivedList<T, Recursive>) {
		this._list = x
	}

	get isSwitch() {
		return true
	}

	get recursive() {
		return this._recursive
	}

	get list() {
		return this._list
	}

	expand(appliedUpon: T | InitType) {
		this.list = this.renewer.evaluate(this.recursive, appliedUpon)
	}

	init(recursive?: Recursive) {
		if (!isUndefined(recursive)) this.recursive = recursive
		return this
	}

	recycleSubs() {
		this.list.recycle()
	}

	recycle() {
		this.recycleSubs()
		switchPool.free(this)
	}

	constructor(recursive: Recursive) {
		super()
		this.init(recursive)
	}
}

export const switchPool = new ObjectPool<[any], Switch>(Switch)

/**
 * This is a wrapper-class around a terminal `T`,
 * implementation of `ITerminal<T, Recursive>`, serving as
 * a way to encapsulate its functionality.
 */
class Terminal<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any
	>
	extends ListIndexHaving
	implements ITerminal<T, Recursive>
{
	private _terminal: T
	private _parentList: SwitchArray<T, Recursive>

	private set terminal(terminal: T) {
		this._terminal = terminal
	}

	private set parentList(list: SwitchArray<T, Recursive>) {
		this._parentList = list
	}

	get terminal() {
		return this._terminal
	}

	get parentList() {
		return this._parentList
	}

	set(terminal: T) {
		this.terminal = terminal
	}

	setParentList(parentList: SwitchArray<T, Recursive>): void {
		this.parentList = parentList
	}

	init(terminal?: T) {
		if (terminal) this.terminal = terminal
		return this
	}

	get isSwitch() {
		return false
	}

	recycle() {
		terminalPool.free(this)
	}
}

const terminalPool = new ObjectPool<[any], Terminal>(Terminal)

function wrapSwitch<Recursive extends ISwitchIdentifiable = any>(r: Recursive) {
	return switchPool.create(r)
}

function wrapTerminal<T extends IInitializable = any>(t: T) {
	return terminalPool.create(t)
}

function unwrap<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
>(wrapped: IRecursivelySwitchable<T, Recursive>) {
	return isSwitch(wrapped) ? wrapped.recursive : wrapped.terminal
}

interface IItemsSettable {
	setItems(items: any[]): void
}

interface IRenewerSettable {
	setRenewer(renewer: RecursiveList.Renewer): void
}

interface IDeepListSettable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> {
	setDeepList(deepList: DeepList<T, Recursive>): void
}

export const deepListInitializer: IInitializer<[DeepList]> = {
	init(target: IDeepListSettable, deepList?: DeepList) {
		if (deepList) target.setDeepList(deepList)
	}
}

export const renewerInitializer: IInitializer<[RecursiveList.Renewer]> = {
	init(target: IRenewerSettable, renewer?: RecursiveList.Renewer) {
		if (renewer) target.setRenewer(renewer)
	}
}

export const itemsInitializer: IInitializer<[any[]]> = {
	init(target: IItemsSettable, items?: any[]) {
		if (items) target.setItems(items)
	}
}

const recursiveListInitializer: IInitializer<[RecursiveList.Renewer, any[]]> = {
	init(
		target: IRenewerSettable & IItemsSettable,
		renewer?: RecursiveList.Renewer,
		items?: any[],
		deepList?: DeepList
	) {
		deepListInitializer.init(target, deepList)
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

abstract class RenewerHaving<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any
	>
	extends Initializable<[RecursiveList.Renewer<T, Recursive>]>
	implements IRenewerSettable
{
	private _renewer: RecursiveList.Renewer<T, Recursive, InitType>

	private set renewer(
		newRenewer: RecursiveList.Renewer<T, Recursive, InitType>
	) {
		this._renewer = newRenewer
	}

	get renewer() {
		return this._renewer
	}

	setRenewer(renewer: RecursiveList.Renewer<T, Recursive, InitType>): void {
		this.renewer = renewer
	}

	protected get initializer() {
		return renewerInitializer
	}
}

class UniversalRenewer<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends RenewerHaving<T, Recursive, InitType> {
	private asTerminal(
		switchable: IRecursivelySwitchable<T, Recursive, InitType>
	) {
		return isSwitch(switchable)
			? switchable.list.firstItemDeep()
			: switchable.terminal
	}

	isOld(switchable: IRecursivelySwitchable<T, Recursive, InitType>) {
		return this.renewer.isOld(this.asTerminal(switchable))
	}
}

/**
 * The class for encapsulating the shared state of
 * `.lastInitialized: T | null`. The purpose is to
 * ensure that the three different "List" classes
 * all have the same version of the variable,
 * and can modify/access it as-necessary.
 */
class LastInitialized<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> {
	private lastInitialized: T | null = null

	get() {
		return this.lastInitialized
	}

	linkEvaluatedSublist(sublist: RecursiveList<T, Recursive>) {
		this.linkNew(sublist.firstItemDeep())
	}

	linkNew(toBeLastInitialized: T) {
		this.lastInitialized = toBeLastInitialized
	}

	unlinkOld() {
		this.lastInitialized = null
	}
}

/**
 * An abstract class encapsulating the basic internal operations
 * on "recursive lists" - ability to evaluate a given item, with
 * a given "something: T | InitType", capability of being enabled with a
 * `protected readonly renewer: RecursiveList.Renewer<T, Recursive, InitType>`,
 * as well as the `.init` method that expects a `RecursiveList.Renewer`.
 */
abstract class BaseEvaluableList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends RenewerHaving<T, Recursive, InitType> {
	private expandEvaluated(
		fillable: Switch<T, Recursive, InitType>,
		evaledWith: T | InitType
	) {
		fillable.recycleSubs()
		fillable.expand(evaledWith)
	}

	private evaluateDerivable(
		maybeSublist: IDerivedList<T, Recursive>,
		evaledWith: T | InitType
	) {
		this.evaluateSublist(maybeSublist, evaledWith)
	}

	protected fillSwitch(
		fillable: Switch<T, Recursive>,
		evaledWith: T | InitType
	) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateDerivable(fillable.list, evaledWith)
	}

	protected initTerminal(toInitialize: T, initParam: T | InitType) {
		toInitialize.init(initParam)
	}

	protected evaluateSublist(
		sublist: RecursiveList<T, Recursive>,
		evaledWith: T | InitType
	) {
		sublist.evaluate(evaledWith)
	}
}

/**
 * The base class for `RenewableList` and `EvaluableList`,
 * enabling tracking of the last item evaluated, which is
 * essential for the two algorithms in question.
 */
abstract class EvaluableListWithLastItem<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends BaseEvaluableList<T, Recursive, InitType> {
	protected pickLastItem(evalWith: InitType) {
		return this.lastInitialized.get() || evalWith
	}

	protected evaluateSublist(
		sublist: RecursiveList<T, Recursive>,
		evaledWith: T | InitType
	) {
		super.evaluateSublist(sublist, evaledWith)
		this.lastInitialized.linkEvaluatedSublist(sublist)
	}

	protected initTerminal(toInitialize: T, initParam: T | InitType) {
		super.initTerminal(toInitialize, initParam)
		this.lastInitialized.linkNew(toInitialize)
	}

	constructor(
		protected readonly lastInitialized: LastInitialized,
		protected readonly items: SwitchArray<T, Recursive>
	) {
		super()
	}
}

/**
 * This is an add-on `BaseEvaluableList<T, Recursive, InitType>` class,
 * whose objects are capable of being used for introducing the `initSwitchable`
 * into `BaseEvaluableList`-deriving classes via delegation in cases,
 * where it would (otherwise) would have been difficult/impossible.
 */
class SwitchableEvaluator<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends BaseEvaluableList<T, Recursive, InitType> {
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
 * of `RenewableList`.
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
 * where the given `.items: SwitchArray` gets re-checked for being
 * no longer acceptable [i.e. that there is, now, a "terminal" which `.isOld`].
 * In such an eventuality, the further attempts to re-evalute the
 * `.items` are no longer pursued, at which point, one simply
 * quits and returns `false`.
 */
class RenewableList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends EvaluableListWithLastItem<T, Recursive, InitType> {
	private readonly foundSwitch = new FoundSwitchFlag()

	private refillSublistIn(
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		const sublist = currSwitch.list
		if (!sublist.renewAll(lastItem)) this.fillSwitch(currSwitch, lastItem)
		else this.lastInitialized.linkEvaluatedSublist(sublist)
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
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		this.foundSwitch.found()
		this.refillSublistIn(currSwitch, lastItem)
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

	private renewEach(evalWith: InitType) {
		for (const curr of this.items)
			if (!this.maybeReinitSwitchable(curr, this.pickLastItem(evalWith)))
				return false
		return true
	}

	renew(evaledWith: InitType) {
		this.foundSwitch.forget()
		this.lastInitialized.unlinkOld()
		return this.renewEach(evaledWith)
	}
}

/**
 * The `.evaluate()` is the first call that
 * properly evaluates the `.items: SwitchArray`.
 * However, it is only called on re-initialization
 * of `CompositeStream`. Any further work on the
 * internal `.items` is handled by the `.renew`
 */
class EvaluableList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends EvaluableListWithLastItem<T, Recursive, InitType> {
	private readonly evaluator = new SwitchableEvaluator<
		T,
		Recursive,
		InitType
	>()

	private evaluateEach(origTerm: InitType) {
		for (const curr of this.items)
			this.evaluator.evalSwitchable(curr, this.pickLastItem(origTerm))
	}

	evaluate(origTerm: InitType) {
		this.lastInitialized.unlinkOld()
		this.evaluateEach(origTerm)
	}
}

/**
 * This is a list-like view of the `items: SwitchArray<T, Recursive>`
 * intended to provide one with a way to obtain the current
 * `IRecursiveSwitchable<T, Recursive>`-representation of a given `T`
 * via the `.getBy` method, as well as to perform bookkeeping
 * operations via the `.register/.unregister` calls on a given
 * `IRecursiveSwitchable` instance.
 *
 * The `.getBy` method, in particular, is the one that makes the
 * `RecursiveList.prototype.renewItem` method implementation feasible.
 */
export class DeepList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> {
	private readonly byTerminals: Map<T, [SwitchArray<T, Recursive>, number]> =
		new Map()

	/**
	 * Reads the `Terminal<T, Recursive>` at a given `index` in a
	 * given `parent`
	 */
	private getAt(parent: SwitchArray<T, Recursive>, index: number) {
		return parent.get(index) as Terminal<T, Recursive>
	}

	private findTerminal(terminal: T) {
		return this.byTerminals.get(terminal)!
	}

	unregister(terminal: Terminal<T, Recursive>) {
		this.byTerminals.delete(terminal.terminal)
	}

	register(
		terminal: Terminal<T, Recursive>,
		parent: SwitchArray<T, Recursive>,
		index: number
	) {
		this.byTerminals.set(terminal.terminal, [parent, index])
	}

	getBy(terminal: T) {
		const [parent, index] = this.findTerminal(terminal)
		return this.getAt(parent, index)
	}

	constructor(public readonly items: SwitchArray<T, Recursive>) {}
}

/**
 * This is a `RecursiveList` variation capable of renewing an item at a
 * specific index. In event that the renewal in question turns out to be
 * impossible (due to item relying on something else that has already
 * finished and, itself, *cannot* be renewed), one throws a corresponding
 * exception.
 */
class PinpointRenewableList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends BaseEvaluableList<T, Recursive, InitType> {
	private readonly evaluator = new SwitchableEvaluator()
	private readonly uniRenewer = new UniversalRenewer(this.renewer)

	private throwSiblingsUnrenewable() {
		throw new Error(
			"None of the immediate non-deep siblings of the provided item are renewable. The pinpoint-renewal operation requested is malformed"
		)
	}

	private foundNonOld(
		firstNonOldIndex: number,
		parent: SwitchArray<T, Recursive>
	) {
		return firstNonOldIndex !== parent.size
	}

	private assertNonOldFound(
		searchIndex: number,
		parent: SwitchArray<T, Recursive>
	) {
		if (!this.foundNonOld(searchIndex, parent))
			this.throwSiblingsUnrenewable()
	}

	private itemAhead(of: number) {
		return of + 1
	}

	private renewNeeded(
		from: number,
		to: number,
		parent: SwitchArray<T, Recursive>
	) {
		let initItem = (
			parent.get(this.itemAhead(from)) as Terminal<T, Recursive>
		).terminal
		for (let i = from; i >= to; --i) {
			const currItem = parent.get(i)
			this.evaluator.evalSwitchable(currItem, initItem)
			initItem = this.renewer.prevItem(initItem)
		}
	}

	private lastNonOldIndex(
		item: Terminal<T, Recursive>
	): [number, SwitchArray<T, Recursive>] {
		const parent = item.parentList
		let currItem: IRecursivelySwitchable<T, Recursive, InitType> = item
		let i: number = item.listIndex
		while (i < parent.size && this.uniRenewer.isOld(currItem))
			currItem = parent.get(i++)
		return [i, parent]
	}

	// ! [FOR `.setListIndex` call-implementation...] IMPORTANT NOTE: the item at `.listIndex` of some `I` depends on item of `I + 1` [IF there is any such item... else - it's OUTSIDE [as in - ABOVE] the current `.parentList`, and renewal is deemed impossible/pointless];
	private lastNonOldItem(item: Terminal<T, Recursive>) {
		const [i, parent] = this.lastNonOldIndex(item)
		this.assertNonOldFound(i, parent)
		return i
	}

	private firstOldItem(item: Terminal<T, Recursive>) {
		return this.lastNonOldItem(item) - 1
	}

	private renewOldItem(item: Terminal<T, Recursive>) {
		this.renewNeeded(
			this.firstOldItem(item),
			item.listIndex,
			item.parentList
		)
	}

	/**
	 * Renews a given terminal `item: T`, provided it is
	 * a part of the current item-list.
	 */
	renewItem(item: Terminal<T, Recursive>) {
		if (this.renewer.isOld(item.terminal)) this.renewOldItem(item)
	}
}

const switchArrayInitializer = {
	init(target: SwitchArray, items?: any[], renewer?: RecursiveList.Renewer) {
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

/**
 * This is a class that encapsulates the `IRecursiveItems`
 * of the `RecursiveList`, and which is used by the user
 * via the `IStreamArray` whenever modifying the internal
 * structure of a `DynamicParser`.
 */
class SwitchArray<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any
	>
	extends Initializable<
		[
			IRecursiveItems<T, Recursive>,
			RecursiveList.Renewer<T, Recursive, InitType>
		]
	>
	implements IArray<T | Recursive>
{
	private _items: IRecursiveItems<T, Recursive>
	private renewer: RecursiveList.Renewer<T, Recursive, InitType>

	private set items(newItems: IRecursiveItems<T, Recursive>) {
		this._items = newItems
	}

	get items() {
		return this._items
	}

	get size() {
		return this.items.length
	}

	private maybeWrapSwitchMult(items: (T | Recursive)[]) {
		return mutate(items, this.maybeWrapSwitch.bind(this))
	}

	private baseWrite(i: number, value: IRecursivelySwitchable<T, Recursive>) {
		this.items[i] = value
	}

	private maybeWrapSwitch(r: T | Recursive) {
		return this.renewer.wrap(r)
	}

	setRenewer(renewer: RecursiveList.Renewer<T, Recursive, InitType>) {
		this.renewer = renewer
	}

	setItems(items: IRecursiveItems<T, Recursive>) {
		this.items = items
	}

	protected get initializer() {
		return switchArrayInitializer
	}

	write(i: number, value: T | Recursive) {
		const currItem = this.get(i)
		if (!this.renewer.isRecursive(value))
			this.baseWrite(i, wrapTerminal(value))
		else if (isSwitch(currItem)) currItem.init(value)
		else this.baseWrite(i, wrapSwitch(value))
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

	constructor(
		items?: IRecursiveItems<T, Recursive>,
		renewer?: RecursiveList.Renewer<T, Recursive, InitType>
	) {
		super()
		this.init(items, renewer)
	}
}

/**
 * This is the primary data structure for implementing the
 * library's self-modifying parser. Particularly, it is responsible
 * for keeping track of the list of items that may or may not
 * be leading to recursion within the structure of the list.
 */
export class RecursiveList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any,
	InitArgs extends any[] = []
> extends Initializable<
	[
		RecursiveList.Renewer<T, Recursive, InitType>,
		(T | Recursive)[],
		DeepList<T, Recursive>,
		...(InitArgs | [])
	]
> {
	public readonly items = new SwitchArray<T, Recursive>()
	private readonly asEvaluable: EvaluableList<T, Recursive, InitType>
	private readonly asRenewable: RenewableList<T, Recursive, InitType>

	protected asDeep: DeepList<T, Recursive>
	protected renewer: RecursiveList.Renewer<T, Recursive, InitType>

	private putSelfAsParentFor(maybeTerminal: Terminal<T, Recursive>) {
		maybeTerminal.setParentList(this.items)
	}

	private register(wrapped: Terminal<T, Recursive>, index: number) {
		this.asDeep.register(wrapped, this.items, index)
	}

	private initNewTerminal(wrapped: Terminal<T, Recursive>, at: number) {
		this.putSelfAsParentFor(wrapped)
		this.register(wrapped, at)
	}

	private toWrapped(fromArr: (T | Recursive)[], atIndex: number) {
		const wrapped = this.renewer.wrap(fromArr[atIndex])
		wrapped.setListIndex(atIndex)
		if (!isSwitch(wrapped)) this.initNewTerminal(wrapped, atIndex)
		return wrapped
	}

	private firstItem() {
		return this.items.first()
	}

	protected get initializer() {
		return recursiveListInitializer
	}

	setDeepList(deepList: DeepList<T, Recursive>) {
		this.asDeep = deepList
	}

	setRenewer(renewer: RecursiveList.Renewer<T, Recursive, InitType>) {
		this.renewer = renewer
		this.items.init(MissingArgument, renewer)
		this.asEvaluable.init(renewer)
		this.asRenewable.init(renewer)
	}

	setItems(newItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = newItems
		for (let i = newItems.length; i--; )
			mutItems[i] = this.toWrapped(newItems, i)
		this.items.init(mutItems as IRecursiveItems<T, Recursive>)
	}

	firstItemDeep(): T {
		const firstItem = this.firstItem()
		return isSwitch<T, Recursive, InitType>(firstItem)
			? firstItem.list.firstItemDeep()
			: firstItem.terminal
	}

	renewAll(initial: InitType) {
		return this.asRenewable.renew(initial)
	}

	evaluate(initial: InitType) {
		this.asEvaluable.evaluate(initial)
	}

	constructor(
		renewer?: RecursiveList.Renewer<T, Recursive, InitType>,
		items?: (T | Recursive)[],
		deepList?: DeepList<T, Recursive>,
		...args: Partial<InitArgs> | []
	) {
		super()
		const lastInitialized = new LastInitialized()
		this.asEvaluable = new EvaluableList(lastInitialized, this.items)
		this.asRenewable = new RenewableList(lastInitialized, this.items)
		this.init(renewer, items, deepList, ...args)
	}
}

export namespace RecursiveList {
	/**
	 * Responsible for keeping access to joint-access methods
	 * essential for the functioning of the `RecursiveList` and `SwitchArray`.
	 * Has the purpose of identifying "old" [those to be renewed] and "recursive"
	 * [those to be turned into `Switch`es] elements of the `RecursiveList`.
	 * Also contains the `evaluator` method, which spits out a new `IDerivable<T, Recursive>`,
	 * based on the current `Recursive` element, and the last evaluated `T`.
	 */
	export abstract class Renewer<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any
	> {
		abstract isRecursive(x: any): x is Recursive

		abstract isOld(terminal: T): boolean

		abstract nextItem(after: T): T

		abstract prevItem(to: T): T

		abstract evaluate(
			currRec: Recursive,
			last: T | InitType
		): IDerivedList<T, Recursive>

		wrap(r: T | Recursive) {
			return this.isRecursive(r) ? wrapSwitch(r) : wrapTerminal(r)
		}
	}

	export abstract class RootList<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any,
		InitArgs extends any[] = []
	> {
		protected abstract getList(): RecursiveList<
			T,
			Recursive,
			InitType,
			InitArgs
		>

		protected abstract getRenewer(): Renewer<T, Recursive, InitType>

		protected readonly asDeep: DeepList<T, Recursive>
		protected readonly renewer: Renewer<T, Recursive, InitType>

		private readonly list: RecursiveList<T, Recursive, InitType, InitArgs>
		private readonly asPinpointRenewable = new PinpointRenewableList<
			T,
			Recursive,
			InitType
		>()

		get items() {
			return this.list.items
		}

		renewItem(item: T) {
			this.asPinpointRenewable.renewItem(
				this.asDeep.getBy(item) as Terminal<T, Recursive>
			)
		}

		renewAll(lastItem: InitType) {
			return this.list.renewAll(lastItem)
		}

		firstItemDeep() {
			return this.list.firstItemDeep()
		}

		evaluate(initial: InitType) {
			this.list.evaluate(initial)
		}

		constructor(items: (T | Recursive)[], ...args: Partial<InitArgs> | []) {
			const list = this.getList()

			this.renewer = this.getRenewer()
			this.list = list
			this.asDeep = new DeepList<T>(this.items)

			this.asPinpointRenewable.init(this.renewer)
			this.list.init(this.renewer, items, this.asDeep, ...args)
		}
	}

	/**
	 * A public wrapper around the `RecursiveList`.
	 * It contains the iteration order and methods needed
	 * for correct recursive pool reclamation routine.
	 */
	export abstract class Poolable<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any,
		InitArgs extends any[] = []
	> extends RecursiveList<T, Recursive, InitType, InitArgs> {
		protected abstract reclaim(list: Poolable<T, Recursive>): void

		recycleSubs() {
			for (const curr of this) {
				if (!isSwitch(curr)) this.asDeep.unregister(curr)
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

		constructor(
			renewer?: Renewer<T, Recursive, InitType>,
			origItems?: (T | Recursive)[],
			deepList?: DeepList<T, Recursive>,
			...args: Partial<InitArgs> | []
		) {
			super(renewer, origItems, deepList, ...args)
		}
	}
}
