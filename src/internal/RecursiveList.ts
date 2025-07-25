import { array, inplace, type } from "@hgargg-0710/one"
import { Initializable } from "../classes/Initializer.js"
import { ObjectPool } from "../classes/ObjectPool.js"
import type { IInitializable, IInitializer } from "../interfaces.js"
import type { IArray } from "../interfaces/Array.js"

const { insert, mutate, out } = inplace
const { last, lastIndex, first, clear } = array
const { isUndefined } = type

interface IRecursiveListIdentifiable {
	readonly isRecursiveList?: boolean
}

export interface ISwitchIdentifiable {
	readonly isSwitch?: boolean
}

export type IDerivable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = Terminal<T, Recursive> | PoolableRecursiveList<T, Recursive>

export type IRecursivelySwitchable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> = Terminal<T, Recursive> | Switch<T, Recursive, InitType>

export type IRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = IRecursivelySwitchable<T, Recursive>[]

type IPreRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = (IRecursivelySwitchable<T, Recursive> | T | Recursive)[]

export interface ITerminal<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> extends IInitializable,
		IRecursiveListIdentifiable,
		ISwitchIdentifiable {
	readonly parentList: SwitchArray<T, Recursive>
	readonly listIndex: number

	setParentList(parentList: SwitchArray<T, Recursive>): void
	setListIndex(listIndex: number): void
}

export function isSwitch<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
>(x: ISwitchIdentifiable): x is Switch<T, Recursive, InitType> {
	return x.isSwitch === true
}

export function isRecursiveList(
	x: IRecursiveListIdentifiable
): x is RecursiveList {
	return x.isRecursiveList === true
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
	private _derivable: IDerivable<T, Recursive>
	private renewer: RecursiveRenewer<T, Recursive>

	private recycleMaybeSwitches(derivable: IDerivable<T, Recursive>) {
		if (isRecursiveList(derivable)) derivable.recycle()
	}

	private set recursive(newRecursive: Recursive) {
		this._recursive = newRecursive
	}

	private set derivable(x: IDerivable<T, Recursive>) {
		this._derivable = x
	}

	get isSwitch() {
		return true
	}

	get recursive() {
		return this._recursive
	}

	get derivable() {
		return this._derivable
	}

	expand(appliedUpon: T | InitType) {
		this.derivable = this.renewer.evaluate(this.recursive, appliedUpon)
	}

	init(recursive?: Recursive) {
		if (!isUndefined(recursive)) this.recursive = recursive
		return this
	}

	recycleSubs() {
		this.recycleMaybeSwitches(this.derivable)
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

	get isRecursiveList() {
		return false
	}

	recycle() {
		terminalPool.free(this)
	}
}

export const terminalPool = new ObjectPool<[any], Terminal>(Terminal)

export function wrapSwitch<Recursive extends ISwitchIdentifiable = any>(
	r: Recursive
) {
	return switchPool.create(r)
}

export function wrapTerminal<T extends IInitializable = any>(t: T) {
	return terminalPool.create(t)
}

export function unwrap<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
>(wrapped: IRecursivelySwitchable<T, Recursive>) {
	return isSwitch(wrapped) ? wrapped.recursive : wrapped.terminal
}

interface IItemsSettable {
	setItems(items: any[]): void
}

interface IRenewerSettable {
	setRenewer(renewer: RecursiveRenewer): void
}

export const renewerInitializer: IInitializer<[RecursiveRenewer]> = {
	init(target: IRenewerSettable, renewer?: RecursiveRenewer) {
		if (renewer) target.setRenewer(renewer)
	}
}

export const itemsInitializer: IInitializer<[any[]]> = {
	init(target: IItemsSettable, items?: any[]) {
		if (items) target.setItems(items)
	}
}

const recursiveInitListInitializer: IInitializer<[RecursiveRenewer, any[]]> = {
	init(
		target: IRenewerSettable & IItemsSettable,
		renewer?: RecursiveRenewer,
		items?: any[]
	) {
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

/**
 * Responsible for keeping access to joint-access methods
 * essential for the functioning of the `RecursiveInitList` and `SwitchArray`.
 * Has the purpose of identifying "old" [those to be renewed] and "recursive"
 * [those to be turned into `Switch`es] elements of the `RecursiveInitList`.
 * Also contains the `evaluator` method, which spits out a new `IDerivable<T, Recursive>`,
 * based on the current `Recursive` element, and the last evaluated `T`.
 */
export abstract class RecursiveRenewer<
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
	): IDerivable<T, Recursive>

	wrap(r: T | Recursive) {
		return this.isRecursive(r) ? wrapSwitch(r) : wrapTerminal(r)
	}
}

class UniversalRenewer<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends Initializable<[RecursiveRenewer<T, Recursive, InitType>]> {
	private renewer: RecursiveRenewer<T, Recursive, InitType>

	private firstTerminal(derivable: IDerivable<T, Recursive>) {
		return isRecursiveList(derivable)
			? derivable.firstItemDeep()
			: derivable.terminal
	}

	private asTerminal(
		switchable: IRecursivelySwitchable<T, Recursive, InitType>
	) {
		return isSwitch(switchable)
			? this.firstTerminal(switchable.derivable)
			: switchable.terminal
	}

	protected get initializer() {
		return renewerInitializer
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive, InitType>) {
		this.renewer = renewer
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
 * `protected readonly renewer: RecursiveRenewer<T, Recursive, InitType>`,
 * as well as the `.init` method that expects a `RecursiveRenewer`.
 */
abstract class BaseEvaluableList<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any
	>
	extends Initializable<[RecursiveRenewer<T, Recursive>]>
	implements IRenewerSettable
{
	private _renewer: RecursiveRenewer<T, Recursive, InitType>

	private set renewer(newRenewer: RecursiveRenewer<T, Recursive, InitType>) {
		this._renewer = newRenewer
	}

	get renewer() {
		return this._renewer
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive, InitType>): void {
		this.renewer = renewer
	}

	protected get initializer() {
		return renewerInitializer
	}

	private expandEvaluated(
		fillable: Switch<T, Recursive, InitType>,
		evaledWith: T | InitType
	) {
		fillable.recycleSubs()
		fillable.expand(evaledWith)
	}

	private evaluateDerivable(
		maybeSublist: IDerivable<T, Recursive>,
		evaledWith: T | InitType
	) {
		if (isRecursiveList(maybeSublist))
			this.evaluateSublist(maybeSublist, evaledWith)
		else this.evaluateTerminal(maybeSublist.terminal)
	}

	protected fillSwitch(
		fillable: Switch<T, Recursive>,
		evaledWith: T | InitType
	) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateDerivable(fillable.derivable, evaledWith)
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

	evaluateTerminal(derived: T): void {}
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

	evaluateTerminal(derived: T): void {
		this.lastInitialized.linkNew(derived)
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
	evaluateTerminal(derived: T): void {
		this.parentList.evaluateTerminal(derived)
	}

	evalSwitchable(
		toInitialize: IRecursivelySwitchable<T, Recursive, InitType>,
		initParam: T | InitType
	) {
		if (isSwitch<T, Recursive, InitType>(toInitialize))
			this.fillSwitch(toInitialize, initParam)
		else this.initTerminal(toInitialize.terminal, initParam)
	}

	constructor(
		private readonly parentList: BaseEvaluableList<T, Recursive, InitType>
	) {
		super()
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

	private refillSublist(
		sublist: RecursiveList<T, Recursive>,
		lastItem: T | InitType,
		currSwitch: Switch<T, Recursive>
	) {
		if (!sublist.renewAll(lastItem)) this.fillSwitch(currSwitch, lastItem)
		else this.lastInitialized.linkEvaluatedSublist(sublist)
	}

	private maybeRefillSimpleSwitch(
		derivable: T,
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		if (this.renewer.isOld(derivable)) this.fillSwitch(currSwitch, lastItem)
		else this.lastInitialized.linkNew(derivable)
	}

	private refillEitherSwitch(
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		const { derivable } = currSwitch
		if (isRecursiveList(derivable))
			this.refillSublist(derivable, lastItem, currSwitch)
		else
			this.maybeRefillSimpleSwitch(
				derivable.terminal,
				currSwitch,
				lastItem
			)
	}

	private reinitOldTerminalIfPossible(old: T, last: T | InitType) {
		if (!this.foundSwitch.get()) return false
		this.initTerminal(old, last)
		return this.renewer.isOld(old)
	}

	private refillSwitch(
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		this.foundSwitch.found()
		this.refillEitherSwitch(currSwitch, lastItem)
		return true
	}

	private linkNonOldTerminal(currTerminal: T) {
		this.lastInitialized.linkNew(currTerminal)
		return true
	}

	private maybeReinitTerminal(currTerminal: T, lastTerminal: T | InitType) {
		return this.renewer.isOld(currTerminal)
			? this.reinitOldTerminalIfPossible(currTerminal, lastTerminal)
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
	>(this)

	private evaluateEach(origTerm: InitType) {
		for (const curr of this.items)
			this.evaluator.evalSwitchable(curr, this.pickLastItem(origTerm))
	}

	evaluate(origTerm: InitType) {
		this.lastInitialized.unlinkOld()
		this.evaluateEach(origTerm)
	}
}

// TODO [4]: add the `.setIndex(index: number[])` onto `RecursiveList`; It would get called inside of the `Switch` class.
// ??? QUESTION - where do we call `.setIndex` from???
// * 1. Needs to be called before the `.setItems` code;
// * 2. Needs to be (close) to creation/`.init` call [note - MUST be a part of the `.init/.create` call];
// * 3. The `Switch` can't access information [wrong place]
// * 4. [ok option] The `StreamList` COULD access it... but then we run into needing to:
// 		1. add a new initializer to `streamListInitializer` [easy - `indexInitializer/setIndex`; runs before the rest]
// 		2. adding a new argument [bad] to `init` + `initializer` + `constructor` - `index`; optional [good] - so by default, one just doesn't use anything...
// !!! 	3. hardest: 
// * 		1. provide `RecursiveRenewer` with `setIndex`
// * 		2. provide `Switch` with properties `deepIndex` [obtained from owning `RecursiveList`], and `renewer` [via `setRenewer` - PART OF `.initNew` of `RecursiveList`]
// * 		3. provide `RecursiveList` with an (optional) `index: number[]` argument used inside `setIndex` [which is called FROM WITHIN THE 'initializer' RIGHT AFTER `renewerInitializer`, i.e. BEFORE `topStreamInitializer`]; 
// * 		4. inside `Switch.prototype.expand`, let there be a sequence of calls: 
// !!! [sketch]		this.renewer.setIndex(this.deepIndex.with(this.lastIndex))
// * 				this.derivable = this.renewer.evaluate(this.recursive, appliedUpon)
// 			* 5. the `fromStreams` call would CALL THE `streamListPool.create` with THE FOURTH argument - `this.index` [private variable, set by `StreamRenewer.setIndex`]; 
// TODO [5]: BIG PROBLEM - the `DeepList`s are BROKEN UP! 
// * 	1. Need a new class - one (speficially) for managing the two maps, and being attached to `DeepList` via *DI* IN ORDER to retain THE SAME 'key-value's across ALL the `DeepList`s
// * 	2. The "DeepIndexStorage" class [new one] would have only ONE INSTANCE; 
// * 	3. CONCLUSION[1]: one would have a NEW CLASS - `RootStreamList`. It would: 
// ! 		1. contain the SHARED `DeepIndexStorage` instance shared ACROSS a single toplevel `RecursiveList`, and all of its descendants.
// ! 		2. delegate needed methods to its `StreamList`
// * 	4. The `DeepList`s would have a `.setStorage` method, delegated-to through teh `setIndexStorage` on `RecursiveList`, AND CALLED via `StreamRenewer`: 
// * 		1. The `IndexStorage` is the FIFTH argument for the `init` method/constructor; 
// ! 		2. CONCLUSION: since we only use ALL THE FIVE arguments together: 
// * 			1. Create YET ANOTHER [3rd new] class - StreamListParams [StreamList.ts]
// * 			2. Create YET ANOTHER [4th new] class - StreamListParamsBuilder [StreamList.ts] - builds the `StreamListParam` instances: 
// ! 				1. The call to the building function [static] happens INSIDE the `StreamRenewer.fromChoice` [where the 3/5 arguments for `streamListPool` are...];
// * 	5. CONCLUSION [2]: The `CompositeStream` would use NOT the `StreamList`, but a `RootStreamList`; 
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
class DeepList<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> {
	private readonly byTerminals: Map<T, number[]> = new Map()
	private readonly byIndexes: Map<number[], T> = new Map()

	private registerSwitch(toRegister: Switch<T, Recursive>, index: number[]) {
		const { derivable } = toRegister
		if (!isRecursiveList(derivable)) this.registerTerminal(derivable, index)
	}

	private registerTerminal(
		terminal: Terminal<T, Recursive>,
		index: number[]
	) {
		const unwrapped = terminal.terminal
		this.byTerminals.set(unwrapped, index)
		this.byIndexes.set(index, unwrapped)
	}

	/**
	 * Expects index to point to an alreaady existing
	 * `Terminal`-record inside the hashes.
	 */
	private unregisterTerminal(
		terminal: Terminal<T, Recursive>,
		atIndex: number[]
	) {
		this.byIndexes.delete(atIndex)
		this.byTerminals.delete(terminal.terminal)
	}

	private unregisterSwitch(
		toUnregister: Switch<T, Recursive>,
		index: number[]
	) {
		const { derivable } = toUnregister
		if (!isRecursiveList(derivable))
			this.unregisterTerminal(derivable, index)
	}

	/**
	 * Recursively reads the `Terminal<T, Recursive>` at a given index.
	 */
	private getAt(index: number[]) {
		let currList = this.items
		const beforeLast = lastIndex(index)
		for (let i = 0; i < beforeLast; ++i)
			currList = (
				(currList.get(i) as Switch<T, Recursive>)
					.derivable as RecursiveList<T, Recursive>
			).items
		return currList.get(last(index))
	}

	private findTerminal(terminal: T) {
		return this.byTerminals.get(terminal)!
	}

	unregister(
		switchable: IRecursivelySwitchable<T, Recursive>,
		index: number[]
	) {
		if (isSwitch(switchable)) this.unregisterSwitch(switchable, index)
		else this.unregisterTerminal(switchable, index)
	}

	register(
		switchable: IRecursivelySwitchable<T, Recursive>,
		index: number[]
	) {
		if (isSwitch(switchable)) this.registerSwitch(switchable, index)
		else this.registerTerminal(switchable, index)
	}

	getBy(terminal: T) {
		return this.getAt(this.findTerminal(terminal))
	}

	constructor(public readonly items: SwitchArray<T, Recursive>) {}
}

/**
 * Represents the recursive index of the current `RecursiveList`
 * starting from the topmost one of its parents.
 */
class DeepIndex {
	private readonly cached: number[][] = []

	private cacheIndex(i: number) {
		this.cached[i] = [...this.index, i]
	}

	private indexMissing(i: number) {
		return this.cached.length <= i
	}

	private getCached(i: number) {
		return this.cached[i]
	}

	private cacheIfMissing(i: number) {
		if (this.indexMissing(i)) this.cacheIndex(i)
	}

	from(index: number[]) {
		this.index = index
	}

	with(i: number) {
		this.cacheIfMissing(i)
		return this.getCached(i)
	}

	constructor(private index: number[] = []) {}
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
	private readonly evaluator = new SwitchableEvaluator(this)
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
	init(target: SwitchArray, items?: any[], renewer?: RecursiveRenewer) {
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
export class SwitchArray<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any
	>
	extends Initializable<
		[
			IRecursiveItems<T, Recursive>,
			RecursiveRenewer<T, Recursive, InitType>
		]
	>
	implements IArray<T | Recursive>
{
	private _items: IRecursiveItems<T, Recursive>
	private renewer: RecursiveRenewer<T, Recursive, InitType>

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

	setRenewer(renewer: RecursiveRenewer<T, Recursive, InitType>) {
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
		renewer?: RecursiveRenewer<T, Recursive, InitType>
	) {
		super()
		this.init(items, renewer)
	}
}

/**
 * This class serves as an intermediary between the `DeepIndex`,
 * `DeepList` and `SwitchArray` classes, providing ready-to-use
 * interfaces for registration/deregistration of a given `IRecursivelySwitchable`.
 */
class SwitchableRegistrator<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> {
	private get items() {
		return this.asDeepList.items
	}

	putSelfAsParentFor(
		maybeTerminal: IRecursivelySwitchable<T, Recursive, InitType>
	) {
		if (!isSwitch(maybeTerminal)) maybeTerminal.setParentList(this.items)
	}

	unregister(wrapped: IRecursivelySwitchable<T, Recursive, InitType>) {
		this.asDeepList.unregister(
			wrapped,
			this.deepIndex.with(wrapped.listIndex)
		)
	}

	register(
		wrapped: IRecursivelySwitchable<T, Recursive, InitType>,
		index: number
	) {
		this.asDeepList.register(wrapped, this.deepIndex.with(index))
	}

	constructor(
		private readonly asDeepList: DeepList<T, Recursive>,
		private readonly deepIndex: DeepIndex
	) {}
}

/**
 * This is the primary data structure for implementing the
 * library's self-modifying parser. Particularly, it is responsible
 * for keeping track of the list of items that may or may not
 * be leading to recursion within the structure of the list.
 */
class RecursiveList<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any,
		InitArgs extends any[] = []
	>
	extends Initializable<
		[
			RecursiveRenewer<T, Recursive, InitType>,
			(T | Recursive)[],
			...(InitArgs | [])
		]
	>
	implements IRecursiveListIdentifiable
{
	public readonly items = new SwitchArray<T, Recursive>()
	private readonly deepIndex = new DeepIndex()
	private readonly asEvaluable: EvaluableList<T, Recursive, InitType>
	private readonly asRenewable: RenewableList<T, Recursive, InitType>
	private readonly asPinpointRenewable = new PinpointRenewableList<
		T,
		Recursive,
		InitType
	>()

	private readonly asDeep = new DeepList(this.items)
	protected readonly registrator = new SwitchableRegistrator(
		this.asDeep,
		this.deepIndex
	)

	private initNew(fromArr: (T | Recursive)[], index: number) {
		const wrapped = this.renewer.wrap(fromArr[index])
		wrapped.setListIndex(index)
		this.registrator.putSelfAsParentFor(wrapped)
		this.registrator.register(wrapped, index)
		return wrapped
	}

	private firstItem() {
		return this.items.first()
	}

	protected renewer: RecursiveRenewer<T, Recursive, InitType>

	protected get initializer() {
		return recursiveInitListInitializer
	}

	get isRecursiveList() {
		return true
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive, InitType>) {
		this.renewer = renewer
		this.items.setRenewer(renewer)
		this.asEvaluable.init(renewer)
		this.asRenewable.init(renewer)
		this.asPinpointRenewable.init(renewer)
	}

	setItems(newItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = newItems
		for (let i = newItems.length; i--; )
			mutItems[i] = this.initNew(newItems, i)
		this.items.init(mutItems as IRecursiveItems<T, Recursive>)
	}

	setIndex(index: number[]) {
		this.deepIndex.from(index)
	}

	firstItemDeep(): T {
		let firstItem: IRecursivelySwitchable<T, Recursive, InitType>
		let firstDerivable: IDerivable<T, Recursive>
		return isSwitch<T, Recursive, InitType>((firstItem = this.firstItem()))
			? isRecursiveList((firstDerivable = firstItem.derivable))
				? firstDerivable.firstItemDeep()
				: firstDerivable.terminal
			: firstItem.terminal
	}

	renewAll(evaledWith: InitType) {
		return this.asRenewable.renew(evaledWith)
	}

	renewItem(item: T) {
		this.asPinpointRenewable.renewItem(
			this.asDeep.getBy(item) as Terminal<T, Recursive>
		)
	}

	evaluate(origTerm: InitType) {
		this.asEvaluable.evaluate(origTerm)
	}

	constructor(
		renewer?: RecursiveRenewer<T, Recursive, InitType>,
		items?: (T | Recursive)[]
	) {
		super()
		const lastInitialized = new LastInitialized()
		this.asEvaluable = new EvaluableList(lastInitialized, this.items)
		this.asRenewable = new RenewableList(lastInitialized, this.items)
		this.init(renewer, items)
	}
}

/**
 * A public wrapper around the `RecursiveList`.
 * It contains the iteration order and methods needed
 * for correct recursive pool reclamation routine.
 */
export abstract class PoolableRecursiveList<
		T extends IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any,
		InitArgs extends any[] = []
	>
	extends RecursiveList<T, Recursive, InitType, InitArgs>
	implements IRecursiveListIdentifiable
{
	protected abstract reclaim(list: PoolableRecursiveList<T, Recursive>): void

	protected get initializer() {
		return recursiveInitListInitializer
	}

	recycleSubs() {
		for (const curr of this) {
			this.registrator.unregister(curr)
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
		renewer?: RecursiveRenewer<T, Recursive, InitType>,
		origItems?: (T | Recursive)[]
	) {
		super(renewer, origItems)
	}
}
