import { Initializable } from "../classes/Initializer.js"
import { ObjectPool } from "../classes/ObjectPool.js"
import type { IInitializable, IInitializer } from "../interfaces.js"
import { SwitchArray } from "./SwitchArray.js"

interface IRecursiveListIdentifiable<B extends boolean = boolean> {
	readonly isRecursiveList?: B
}

export interface ISwitchIdentifiable<B extends boolean = boolean> {
	readonly isSwitch?: B
}

export type IDerivable<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any
> = T | PoolableRecursiveList<T, Recursive>

type IFoldable<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> = (currRec: Recursive, last: T | InitType) => IDerivable<T, Recursive>

export type IRecursivelySwitchable<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> = T | Switch<T, Recursive, InitType>

export type IRecursiveItems<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any
> = IRecursivelySwitchable<T, Recursive>[]

type IPreRecursiveItems<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any
> = (IRecursivelySwitchable<T, Recursive> | Recursive)[]

export interface ITerminal<Recursive extends ISwitchIdentifiable = any>
	extends IInitializable,
		IRecursiveListIdentifiable<false>,
		ISwitchIdentifiable<false> {
	readonly parentList: SwitchArray<this, Recursive>
	readonly listIndex: number

	setParentList(parentList: SwitchArray<this, Recursive>): void
	setListIndex(listIndex: number): void
}

export function isSwitch<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
>(x: ISwitchIdentifiable): x is Switch<T, Recursive, InitType> {
	return x.isSwitch === true
}

export function isRecursiveInitList(
	x: IRecursiveListIdentifiable
): x is RecursiveList {
	return x.isRecursiveList === true
}

/**
 * This is a class for keeping track of recursion points.
 * More specifically, a 'Switch' is an "optional" recursion point.
 */
export class Switch<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> implements ISwitchIdentifiable, IInitializable
{
	private _recursive: Recursive
	private _derivable: IDerivable<T, Recursive>

	private recycleMaybeSwitches(derivable: IDerivable<T, Recursive>) {
		if (isRecursiveInitList(derivable)) derivable.recycle()
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

	expand(
		evaluator: IFoldable<T, Recursive, InitType>,
		appliedUpon: T | InitType
	) {
		this.derivable = evaluator(this.recursive, appliedUpon)
	}

	init(recursive: Recursive) {
		this.recursive = recursive
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
		this.init(recursive)
	}
}

export const switchPool = new ObjectPool(Switch)

export function wrapSwitch<Recursive extends ISwitchIdentifiable = any>(
	r: Recursive
) {
	return switchPool.create(r)
}

export function maybeDeSwitch<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any
>(wrapped: IRecursivelySwitchable<T, Recursive>) {
	return isSwitch(wrapped) ? wrapped.recursive : wrapped
}

function recycleMaybeSwitch<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
>(maybeSwitch: IRecursivelySwitchable<T, Recursive>) {
	if (isSwitch<T, Recursive, InitType>(maybeSwitch)) maybeSwitch.recycle()
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
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any
> {
	abstract isRecursive(x: any): x is Recursive

	abstract isOld(terminal: T): boolean

	abstract nextItem(after: T): T

	abstract prevItem(to: T): T

	abstract evaluator: (
		currRec: Recursive,
		last: T
	) => IDerivable<T, Recursive>

	maybeWrapSwitch(r: T | Recursive) {
		return this.isRecursive(r) ? wrapSwitch(r) : r
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
	T extends ITerminal<Recursive> = any,
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
 * `protected readonly renewer: RecursiveRenewer<T, Recursive>`,
 * as well as the `.init` method that expects a `RecursiveRenewer`.
 */
abstract class BaseEvaluableList<
		T extends ITerminal<Recursive> = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any
	>
	extends Initializable<[RecursiveRenewer<T, Recursive>]>
	implements IRenewerSettable
{
	private _renewer: RecursiveRenewer<T, Recursive>

	private set renewer(newRenewer: RecursiveRenewer<T, Recursive>) {
		this._renewer = newRenewer
	}

	get renewer() {
		return this._renewer
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive>): void {
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
		fillable.expand(this.renewer.evaluator, evaledWith)
	}

	private evaluateDerivable(
		maybeSublist: IDerivable<T, Recursive>,
		evaledWith: T | InitType
	) {
		if (isRecursiveInitList(maybeSublist))
			this.evaluateSublist(maybeSublist, evaledWith)
		else this.evaluateTerminal(maybeSublist)
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
	T extends ITerminal<Recursive> = any,
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
	T extends ITerminal<Recursive> = any,
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
		else this.initTerminal(toInitialize, initParam)
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
	T extends ITerminal<Recursive> = any,
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
		if (isRecursiveInitList(derivable))
			this.refillSublist(derivable, lastItem, currSwitch)
		else this.maybeRefillSimpleSwitch(derivable, currSwitch, lastItem)
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
			: this.maybeReinitTerminal(currItem, lastItem)
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
	T extends ITerminal<Recursive> = any,
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

/**
 * This is a `RecursiveList` variation capable of renewing an item at a
 * specific index. In event that the renewal in question turns out to be
 * impossible (due to item relying on something else that has already
 * finished and, itself, *cannot* be renewed), one throws a corresponding
 * exception.
 */
class PinpointRenewableList<
	T extends ITerminal<Recursive> = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends BaseEvaluableList<T, Recursive, InitType> {
	private readonly evaluator = new SwitchableEvaluator(this)

	private nextItem(
		after: T,
		nextWrapped: IRecursivelySwitchable<T, Recursive, InitType>
	) {
		return isSwitch(nextWrapped)
			? this.renewer.nextItem(after)
			: nextWrapped
	}

	private throwSiblingsUnrenewable() {
		throw new Error(
			"None of the immediate non-deep siblings of the provided item are renewable. The pinpoint-renewal operation requested is malformed"
		)
	}

	private allAreOld(
		firstNonOldIndex: number,
		parent: SwitchArray<T, Recursive>
	) {
		return firstNonOldIndex === parent.size
	}

	private itemAhead(of: number) {
		return of + 1
	}

	private renewNeeded(
		from: number,
		to: number,
		parent: SwitchArray<T, Recursive>
	) {
		let initItem = parent.get(this.itemAhead(from)) as T
		for (let i = from; i >= to; --i) {
			const currItem = parent.get(i)
			this.evaluator.evalSwitchable(currItem, initItem)
			initItem = this.renewer.prevItem(initItem)
		}
	}

	// ! [FOR `.setListIndex` call-implementation...] IMPORTANT NOTE: the item at `.listIndex` of some `I` depends on item of `I + 1` [IF there is any such item... else - it's OUTSIDE [as in - ABOVE] the current `.parentList`, and renewal is deemed impossible/pointless];
	private lastNonOldItem(item: T) {
		const parent = item.parentList
		const size = parent.size
		let currItem = item
		let i: number = item.listIndex
		while (i < size && this.renewer.isOld(currItem))
			currItem = this.nextItem(currItem, parent.get(i++))
		if (this.allAreOld(i, parent)) this.throwSiblingsUnrenewable()
		return i
	}

	private firstOldItem(item: T) {
		return this.lastNonOldItem(item) - 1
	}

	private renewOldItem(item: T) {
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
	renewItem(item: T) {
		if (this.renewer.isOld(item)) this.renewOldItem(item)
	}
}

/**
 * This is the primary data structure for implementing the
 * library's self-modifying parser. Particularly, it is responsible
 * for keeping track of the list of items that may or may not
 * be leading to recursion within the structure of the list.
 */
class RecursiveList<
		T extends ITerminal<Recursive> = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any,
		InitArgs extends any[] = []
	>
	extends Initializable<
		[RecursiveRenewer<T, Recursive>, (T | Recursive)[], ...(InitArgs | [])]
	>
	implements IRecursiveListIdentifiable
{
	public readonly items = new SwitchArray<T, Recursive>()
	private readonly lastInitialized = new LastInitialized()

	private readonly evaluableList = new EvaluableList(
		this.lastInitialized,
		this.items
	)

	private readonly renewableList = new RenewableList(
		this.lastInitialized,
		this.items
	)

	private readonly pinpointList = new PinpointRenewableList<
		T,
		Recursive,
		InitType
	>()

	private firstItem() {
		return this.items.first()
	}

	protected renewer: RecursiveRenewer<T, Recursive>

	protected get initializer() {
		return recursiveInitListInitializer
	}

	get isRecursiveList(): true {
		return true
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive>) {
		this.renewer = renewer
		this.items.setRenewer(renewer)
		this.evaluableList.init(renewer)
		this.renewableList.init(renewer)
	}

	setItems(newItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = newItems
		for (let i = newItems.length; i--; )
			mutItems[i] = this.renewer.maybeWrapSwitch(newItems[i])
		this.items.init(mutItems as IRecursiveItems<T, Recursive>)
		return this
	}

	firstItemDeep(): T {
		let firstItem: IRecursivelySwitchable<T, Recursive, InitType>
		let firstDerivable: IDerivable<T, Recursive>
		return isSwitch<T, Recursive, InitType>((firstItem = this.firstItem()))
			? isRecursiveInitList((firstDerivable = firstItem.derivable))
				? firstDerivable.firstItemDeep()
				: firstDerivable
			: firstItem
	}

	renewAll(evaledWith: InitType) {
		return this.renewableList.renew(evaledWith)
	}

	renewItem(item: T) {
		this.pinpointList.renewItem(item)
	}

	evaluate(origTerm: InitType) {
		this.evaluableList.evaluate(origTerm)
	}
}

/**
 * A public wrapper around the `RecursiveList`.
 * It contains the iteration order and methods needed
 * for correct recursive pool reclamation routine.
 */
export abstract class PoolableRecursiveList<
		T extends ITerminal<Recursive> = any,
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
		for (const curr of this) recycleMaybeSwitch(curr)
	}

	recycle() {
		this.recycleSubs()
		this.reclaim(this)
	}

	*[Symbol.iterator]() {
		yield* this.items
	}

	constructor(
		renewer?: RecursiveRenewer<T, Recursive>,
		origItems?: (T | Recursive)[]
	) {
		super(renewer, origItems)
	}
}
