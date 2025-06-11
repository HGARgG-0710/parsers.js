import { ObjectPool } from "../classes/ObjectPool.js"
import { Initializable } from "../classes/Initializer.js"
import type { IInitializable, IInitializer, IRecursiveListIdentifiable, ISwitchIdentifiable } from "../interfaces.js"
import { SwitchArray } from "./SwitchArray.js"

export type IDerivable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = T | RecursiveInitList<T, Recursive>

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
): x is RecursiveInitList {
	return x.isRecursiveInitList === true
}

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

interface IItemSettable {
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
	init(target: IItemSettable, items?: any[]) {
		if (items) target.setItems(items)
	}
}

const recursiveInitListInitializer: IInitializer<[RecursiveRenewer, any[]]> = {
	init(target: RecursiveInitList, renewer?: RecursiveRenewer, items?: any[]) {
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

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

export abstract class RecursiveInitList<
		T extends ISwitchIdentifiable &
			IRecursiveListIdentifiable &
			IInitializable = any,
		Recursive extends ISwitchIdentifiable = any,
		InitType = any,
		InitArgs extends any[] = []
	>
	extends Initializable<
		[RecursiveRenewer<T, Recursive>, (T | Recursive)[], ...(InitArgs | [])]
	>
	implements IRecursiveListIdentifiable
{
	protected abstract reclaim(list: RecursiveInitList<T, Recursive>): void

	public readonly items = new SwitchArray<T, Recursive>()

	protected renewer: RecursiveRenewer<T, Recursive>
	
	private lastInitialized: T | null = null
	private hasSwitch: boolean = false

	protected get initializer() {
		return recursiveInitListInitializer
	}

	get isRecursiveInitList() {
		return true
	}

	private isOld(terminal: T) {
		return this.renewer.isOld(terminal)
	}

	private firstItem() {
		return this.items.first()
	}

	private evaluateEach(origTerm: InitType) {
		for (const curr of this.items)
			this.initSwitchable(curr, this.pickLastItem(origTerm))
	}

	private initSwitchable(
		toInitialize: IRecursivelySwitchable<T, Recursive>,
		initParam: T | InitType
	) {
		if (isSwitch(toInitialize)) this.fillSwitch(toInitialize, initParam)
		else this.initTerminal(toInitialize, initParam)
	}

	private initTerminal(toInitialize: T, initParam: T | InitType) {
		toInitialize.init(initParam)
		this.linkNewInitialized(toInitialize)
	}

	private fillSwitch(
		fillable: Switch<T, Recursive>,
		evaledWith: T | InitType
	) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateDerivable(fillable.derivable, evaledWith)
	}

	private expandEvaluated(
		fillable: Switch<T, Recursive>,
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
		else this.linkNewInitialized(maybeSublist)
	}

	private evaluateSublist(
		sublist: RecursiveInitList<T, Recursive>,
		evaledWith: T | InitType
	) {
		sublist.evaluate(evaledWith)
		this.linkEvaluatedSublist(sublist)
	}

	private linkEvaluatedSublist(sublist: RecursiveInitList<T, Recursive>) {
		this.linkNewInitialized(sublist.firstItemDeep())
	}

	private linkNewInitialized(toBeLastInitialized: T) {
		this.lastInitialized = toBeLastInitialized
	}

	private unlinkOldInitialized() {
		this.lastInitialized = null
	}

	private pickLastItem(evalWith: InitType) {
		return this.lastInitialized || evalWith
	}

	private forgetMetSwitches() {
		this.hasSwitch = false
	}

	private reEvalEach(evalWith: InitType) {
		for (const curr of this.items)
			if (!this.maybeReInitSwitchable(curr, this.pickLastItem(evalWith)))
				return false
		return true
	}

	private maybeReInitSwitchable(
		currItem: IRecursivelySwitchable<T, Recursive>,
		lastItem: T | InitType
	) {
		return isSwitch(currItem)
			? this.maybeReFillSwitch(currItem, lastItem)
			: this.maybeReInitTerminal(currItem, lastItem)
	}

	private maybeReFillSwitch(
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		this.hasSwitch = true
		this.reFillSwitch(currSwitch, lastItem)
		return true
	}

	private reFillSwitch(
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		const derivable = currSwitch.derivable
		if (isRecursiveInitList(derivable))
			this.reFillSublist(derivable, lastItem, currSwitch)
		else this.maybeReFillSimpleSwitch(derivable, currSwitch, lastItem)
	}

	private reFillSublist(
		sublist: RecursiveInitList<T, Recursive>,
		lastItem: T | InitType,
		currSwitch: Switch<T, Recursive>
	) {
		if (!sublist.reEvaluate(lastItem)) this.fillSwitch(currSwitch, lastItem)
	}

	private maybeReFillSimpleSwitch(
		derivable: T,
		currSwitch: Switch<T, Recursive>,
		lastItem: T | InitType
	) {
		if (this.isOld(derivable)) this.fillSwitch(currSwitch, lastItem)
	}

	private maybeReInitTerminal(currTerminal: T, lastTerminal: T | InitType) {
		return this.isOld(currTerminal)
			? this.reInitTerminal(currTerminal, lastTerminal)
			: true
	}

	private reInitTerminal(currTerminal: T, lastTerminal: T | InitType) {
		if (!this.hasSwitch) return false
		this.initTerminal(currTerminal, lastTerminal)
		return this.isOld(currTerminal)
	}

	private recycleMaybeSwitch(
		maybeSwitch: IRecursivelySwitchable<T, Recursive>
	) {
		if (isSwitch(maybeSwitch)) maybeSwitch.recycle()
	}

	setRenewer(renewer: RecursiveRenewer<T, Recursive>) {
		this.renewer = renewer
		this.items.setRenewer(renewer)
	}

	setItems(newItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = newItems
		for (let i = newItems.length; --i; )
			mutItems[i] = this.renewer.maybeWrapSwitch(newItems[i])
		this.items.init(mutItems as IRecursiveItems<T, Recursive>)
		return this
	}

	evaluate(origTerm: InitType) {
		this.unlinkOldInitialized()
		this.evaluateEach(origTerm)
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

	reEvaluate(evaledWith: InitType) {
		this.forgetMetSwitches()
		this.unlinkOldInitialized()
		return this.reEvalEach(evaledWith)
	}

	recycleSubs() {
		for (const curr of this) this.recycleMaybeSwitch(curr)
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
		super()
		this.init(renewer, origItems)
	}
}
