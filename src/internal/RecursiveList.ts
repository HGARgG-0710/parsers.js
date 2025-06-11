import { Initializable } from "../classes/Initializer.js"
import { ObjectPool } from "../classes/ObjectPool.js"
import type {
	IInitializable,
	IInitializer,
	IRecursiveListIdentifiable,
	ISwitchIdentifiable
} from "../interfaces.js"
import { SwitchArray } from "./SwitchArray.js"

export type IDerivable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = T | PoolableRecursiveList<T, Recursive>

type IFoldable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> = (currRec: Recursive, last: T | InitType) => IDerivable<T, Recursive>

export type IRecursivelySwitchable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = T | Switch<T, Recursive>

export type IRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = IRecursivelySwitchable<T, Recursive>[]

type IPreRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = (IRecursivelySwitchable<T, Recursive> | Recursive)[]

export function isSwitch<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
>(x: ISwitchIdentifiable): x is Switch<T, Recursive> {
	return x.isSwitch === true
}

export function isRecursiveInitList(
	x: IRecursiveListIdentifiable
): x is PoolableRecursiveList {
	return x.isRecursiveInitList === true
}

/**
 * This is a class for keeping track of recursion points.
 * More specifically, a 'Switch' is an "optional" recursion point.
 */
class Switch<
	T extends IInitializable &
		ISwitchIdentifiable &
		IRecursiveListIdentifiable = any,
	Recursive extends ISwitchIdentifiable & IRecursiveListIdentifiable = any,
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

function recycleMaybeSwitch<
	T extends IInitializable &
		ISwitchIdentifiable &
		IRecursiveListIdentifiable = any,
	Recursive extends ISwitchIdentifiable & IRecursiveListIdentifiable = any
>(maybeSwitch: IRecursivelySwitchable<T, Recursive>) {
	if (isSwitch(maybeSwitch)) maybeSwitch.recycle()
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
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> {
	abstract isRecursive(x: any): x is Recursive

	abstract isOld(terminal: T): boolean

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
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
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
 * The base class for `ReevaluableList` and `EvaluableList`
 */
abstract class BaseEvaluableList<
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends Initializable<[RecursiveRenewer<T, Recursive>]> {
	protected renewer: RecursiveRenewer<T, Recursive>

	protected pickLastItem(evalWith: InitType) {
		return this.lastInitialized.get() || evalWith
	}

	protected get initializer() {
		return renewerInitializer
	}

	private evaluateSublist(
		sublist: RecursiveList<T, Recursive>,
		evaledWith: T | InitType
	) {
		sublist.evaluate(evaledWith)
		this.lastInitialized.linkEvaluatedSublist(sublist)
	}

	private evaluateDerivable(
		maybeSublist: IDerivable<T, Recursive>,
		evaledWith: T | InitType
	) {
		if (isRecursiveInitList(maybeSublist))
			this.evaluateSublist(maybeSublist, evaledWith)
		else this.lastInitialized.linkNew(maybeSublist)
	}

	private expandEvaluated(
		fillable: Switch<T, Recursive>,
		evaledWith: T | InitType
	) {
		fillable.recycleSubs()
		fillable.expand(this.renewer.evaluator, evaledWith)
	}

	protected initTerminal(toInitialize: T, initParam: T | InitType) {
		toInitialize.init(initParam)
		this.lastInitialized.linkNew(toInitialize)
	}

	protected fillSwitch(
		fillable: Switch<T, Recursive>,
		evaledWith: T | InitType
	) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateDerivable(fillable.derivable, evaledWith)
	}

	constructor(
		protected readonly lastInitialized: LastInitialized,
		protected readonly items: SwitchArray<T, Recursive>
	) {
		super()
	}
}

/**
 * This is an object for encapsulating the `foundSwitch: boolean` flag
 * of `ReevaluableList`.
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
 * The `.reevaluate` method is the one where the `CompositeStream`
 * spends most of its time in. More specifically, it is the place
 * where the given `.items: SwitchArray` gets re-checked for being
 * no longer acceptable [i.e. that there is, now, a "terminal" which `.isOld`].
 * In such an eventuality, the further attempts to re-evalute the
 * `.items` are no longer pursued, at which point, one simply
 * quits and returns `false`.
 */
class ReevaluableList<
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends BaseEvaluableList<T, Recursive, InitType> {
	private foundSwitch = new FoundSwitchFlag()

	private refillSublist(
		sublist: RecursiveList<T, Recursive>,
		lastItem: T | InitType,
		currSwitch: Switch<T, Recursive>
	) {
		if (!sublist.reevaluate(lastItem)) this.fillSwitch(currSwitch, lastItem)
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
		currItem: IRecursivelySwitchable<T, Recursive>,
		lastItem: T | InitType
	) {
		return isSwitch(currItem)
			? this.refillSwitch(currItem, lastItem)
			: this.maybeReinitTerminal(currItem, lastItem)
	}

	private reevalEach(evalWith: InitType) {
		for (const curr of this.items)
			if (!this.maybeReinitSwitchable(curr, this.pickLastItem(evalWith)))
				return false
		return true
	}

	reevaluate(evaledWith: InitType) {
		this.foundSwitch.forget()
		this.lastInitialized.unlinkOld()
		return this.reevalEach(evaledWith)
	}
}

/**
 * The `.evaluate()` is the first call that
 * properly evaluates the `.items: SwitchArray`.
 * However, it is only called on re-initialization
 * of `CompositeStream`. Any further work on the
 * internal `.items` is handled by the `.reevaluate`
 */
class EvaluableList<
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any
> extends BaseEvaluableList<T, Recursive, InitType> {
	private initSwitchable(
		toInitialize: IRecursivelySwitchable<T, Recursive>,
		initParam: T | InitType
	) {
		if (isSwitch(toInitialize)) this.fillSwitch(toInitialize, initParam)
		else this.initTerminal(toInitialize, initParam)
	}

	private evaluateEach(origTerm: InitType) {
		for (const curr of this.items)
			this.initSwitchable(curr, this.pickLastItem(origTerm))
	}

	evaluate(origTerm: InitType) {
		this.lastInitialized.unlinkOld()
		this.evaluateEach(origTerm)
	}
}

/**
 * This is the primary data structure for implementing the
 * library's self-modifying parser. Particularly, it is responsible
 * for keeping track of the list of items that may or may not
 * be leading to recursion within the structure of the list.
 */
class RecursiveList<
	T extends ISwitchIdentifiable &
		IRecursiveListIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any,
	InitType = any,
	InitArgs extends any[] = []
> extends Initializable<
	[RecursiveRenewer<T, Recursive>, (T | Recursive)[], ...(InitArgs | [])]
> {
	public readonly items = new SwitchArray<T, Recursive>()
	private readonly lastInitialized = new LastInitialized()

	private readonly evaluableList = new EvaluableList(
		this.lastInitialized,
		this.items
	)

	private readonly reevaluableList = new ReevaluableList(
		this.lastInitialized,
		this.items
	)

	protected renewer: RecursiveRenewer<T, Recursive>

	protected get initializer() {
		return recursiveInitListInitializer
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive>) {
		this.renewer = renewer
		this.items.setRenewer(renewer)
		this.evaluableList.init(renewer)
		this.reevaluableList.init(renewer)
	}

	setItems(newItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = newItems
		for (let i = newItems.length; i--; )
			mutItems[i] = this.renewer.maybeWrapSwitch(newItems[i])
		this.items.init(mutItems as IRecursiveItems<T, Recursive>)
		return this
	}

	firstItemDeep(): T {
		let firstItem: IRecursivelySwitchable<T, Recursive>
		let firstDerivable: IDerivable<T, Recursive>
		return isSwitch((firstItem = this.firstItem()))
			? isRecursiveInitList((firstDerivable = firstItem.derivable))
				? firstDerivable.firstItemDeep()
				: firstDerivable
			: firstItem
	}

	reevaluate(evaledWith: InitType) {
		return this.reevaluableList.reevaluate(evaledWith)
	}

	firstItem() {
		return this.items.first()
	}

	evaluate(origTerm: InitType) {
		this.evaluableList.evaluate(origTerm)
		return this
	}
}

/**
 * A public wrapper around the `RecursiveList`.
 * It contains the iteration order and methods needed
 * for correct recursive pool reclamation routine.
 */
export abstract class PoolableRecursiveList<
		T extends ISwitchIdentifiable &
			IRecursiveListIdentifiable &
			IInitializable = any,
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

	get isRecursiveInitList() {
		return true
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
