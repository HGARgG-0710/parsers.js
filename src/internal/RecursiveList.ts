import type { IInitializable } from "../interfaces.js"

import { array } from "@hgargg-0710/one"
const { first } = array

type IDerivable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = T | RecursiveInitList<T, Recursive>

type IFoldable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = (currRec: Recursive, last: T) => IDerivable<T, Recursive>

type IFillableSwitch<
	T extends IInitializable,
	Recursive extends ISwitchIdentifiable = any
> = Switch<T, Recursive>

type IRecursivelySwitchable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = T | IFillableSwitch<T, Recursive>

type IRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = IRecursivelySwitchable<T, Recursive>[]

type IPreRecursiveItems<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = (IRecursivelySwitchable<T, Recursive> | Recursive)[]

type IRecursiveIdentifiable = {
	readonly isRecursiveList?: boolean
}

type ISwitchIdentifiable = {
	readonly isSwitch?: boolean
}

function isSwitch(x: ISwitchIdentifiable): x is Switch {
	return !!x.isSwitch
}

function isRecursiveList(x: IRecursiveIdentifiable): x is RecursiveInitList {
	return !!x.isRecursiveList
}

class Switch<
	T extends IInitializable &
		ISwitchIdentifiable &
		IRecursiveIdentifiable = any,
	Recursive extends ISwitchIdentifiable & IRecursiveIdentifiable = any
> implements ISwitchIdentifiable
{
	private _derivable: IDerivable<T, Recursive>

	get isSwitch() {
		return true
	}

	private set derivable(x: IDerivable<T, Recursive>) {
		this._derivable = x
	}

	get derivable() {
		return this._derivable
	}

	expand(evaluator: IFoldable<T, Recursive>, appliedUpon: T) {
		this.derivable = evaluator(this.recursive, appliedUpon)
	}

	constructor(public readonly recursive: Recursive) {}
}

// ! IMPORTANT note [StreamList/ComposedStream]: will need to `assert` that all the things passed are EITHER `.isFunction`;

// TODO: LATER, provide an EFFICIENT implementation of `RecursiveInitList`:
// * 	1.  *with* pooling of 'Switch' and 'StreamList' objects:
// 			1. a new 'ObjectPool' class;
// 			2. it will have a `.free(x)` method
// 			3. it will have a `.create(...any: [])` method
// 			4. it will have a BOUND `.construct(x: ObjType, ...args)` function (*not* method), which will INITIALIZE the newly created objects;
// 			5. it will have a `.creator: (...args: any[]) => T` function for creating the objects of the kept type. THESE ARE USED for ``
// 			6. use `SwitchPool` and `StreamPool` LOCAL objects;
// 			7. EXPORT IT TO BE PUBLIC, since that would allow the user to be RE-USING their own Stream-objects (immensely useful if there's many of them...);
// * 	2. *with* AN UNDERLYING `TempArray` to RETAIN the space:
// 			1. instead of the current basic 'Type[]'-arrays
// ?		2. Rename `TempArray` to `RetainedArray`? [YES, PLEASE DO!]
export abstract class RecursiveInitList<
	T extends ISwitchIdentifiable &
		IRecursiveIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> implements IRecursiveIdentifiable
{
	protected abstract isOld(terminal: T): boolean
	protected abstract isRecursive(x: any): x is Recursive
	protected abstract evaluator(
		currRec: Recursive,
		last: T
	): IDerivable<T, Recursive>

	private items: IRecursiveItems<T, Recursive>
	private lastInitialized: T | null = null
	private hasSwitch: boolean = false

	get isRecursiveList() {
		return true
	}

	get size() {
		return this.items.length
	}

	private firstItem() {
		return first(this.items)
	}

	private wrapSwitch(r: T | Recursive) {
		return this.isRecursive(r) ? new Switch(r) : r
	}

	private initSwitchable(
		toInitialize: IRecursivelySwitchable<T, Recursive>,
		initParam: T
	) {
		if (isSwitch(toInitialize)) this.fillSwitch(toInitialize, initParam)
		else this.initTerminal(toInitialize, initParam)
	}

	private initTerminal(toInitialize: T, initParam: T) {
		toInitialize.init(initParam)
		this.lastInitialized = toInitialize
	}

	private fillSwitch(fillable: IFillableSwitch<T, Recursive>, evaledWith: T) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateDerivable(fillable.derivable, evaledWith)
	}

	private expandEvaluated(
		fillable: IFillableSwitch<T, Recursive>,
		evaledWith: T
	) {
		fillable.expand(this.evaluator, evaledWith)
	}

	private evaluateDerivable(
		maybeSublist: IDerivable<T, Recursive>,
		evaledWith: T
	) {
		if (isRecursiveList(maybeSublist))
			this.evaluateSublist(maybeSublist, evaledWith)
		else this.linkNewInitialized(maybeSublist)
	}

	private evaluateSublist(
		sublist: RecursiveInitList<T, Recursive>,
		evaledWith: T
	) {
		sublist.evaluate(evaledWith)
		this.linkEvaluatedSublist(sublist)
	}

	private linkEvaluatedSublist(sublist: RecursiveInitList<T, Recursive>) {
		this.linkNewInitialized(sublist.firstNonRecursive())
	}

	private linkNewInitialized(toBeLastInitialized: T) {
		this.lastInitialized = toBeLastInitialized
	}

	private unlinkOldInitialized() {
		this.lastInitialized = null
	}

	private forgetMetSwitches() {
		this.hasSwitch = false
	}

	private reEvalEach(evalWith: T) {
		for (let i = this.size; i--; )
			if (
				!this.maybeReInitSwitchable(
					this.items[i],
					this.lastInitialized || evalWith
				)
			)
				return false
	}

	private maybeReInitSwitchable(
		currItem: IRecursivelySwitchable<T, Recursive>,
		lastItem: T
	) {
		return isSwitch(currItem)
			? this.maybeReFillSwitch(currItem, lastItem)
			: this.maybeReInitTerminal(currItem, lastItem)
	}

	private maybeReFillSwitch(
		currSwitch: IFillableSwitch<T, Recursive>,
		lastItem: T
	) {
		this.hasSwitch = true
		this.reFillSwitch(currSwitch, lastItem)
		return true
	}

	private reFillSwitch(
		currSwitch: IFillableSwitch<T, Recursive>,
		lastItem: T
	) {
		const derivable = currSwitch.derivable
		if (isRecursiveList(derivable))
			this.reFillSublist(derivable, lastItem, currSwitch)
		else this.maybeReFillSimpleSwitch(derivable, currSwitch, lastItem)
	}

	private maybeReFillSimpleSwitch(
		derivable: T,
		currSwitch: IFillableSwitch<T, Recursive>,
		lastItem: T
	) {
		if (this.isOld(derivable)) this.fillSwitch(currSwitch, lastItem)
	}

	private reFillSublist(
		sublist: RecursiveInitList<T, Recursive>,
		lastItem: T,
		currSwitch: IFillableSwitch<T, Recursive>
	) {
		if (!sublist.reEvaluate(lastItem)) this.fillSwitch(currSwitch, lastItem)
	}

	private maybeReInitTerminal(currTerminal: T, lastTerminal: T) {
		return this.isOld(currTerminal)
			? this.reInitTerminal(currTerminal, lastTerminal)
			: true
	}

	private reInitTerminal(currTerminal: T, lastTerminal: T) {
		const reEvalProceed = this.hasSwitch
		if (reEvalProceed) this.initTerminal(currTerminal, lastTerminal)
		return reEvalProceed
	}

	evaluate(origTerm: T) {
		this.unlinkOldInitialized()
		for (let i = this.size; i--; )
			this.initSwitchable(this.items[i], this.lastInitialized || origTerm)
		return this
	}

	firstNonRecursive(): T {
		let firstItem: IRecursivelySwitchable<T, Recursive>
		let firstDerivable: IDerivable<T, Recursive>
		return isSwitch((firstItem = this.firstItem()))
			? isRecursiveList((firstDerivable = firstItem.derivable))
				? firstDerivable.firstNonRecursive()
				: firstDerivable
			: firstItem
	}

	reEvaluate(evaledWith: T) {
		this.forgetMetSwitches()
		this.unlinkOldInitialized()
		this.reEvalEach(evaledWith)
		return true
	}

	init(origItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = origItems
		for (let i = origItems.length; --i; )
			mutItems[i] = this.wrapSwitch(origItems[i])
		this.items = mutItems as IRecursiveItems<T, Recursive>
		return this
	}

	constructor(origItems: (T | Recursive)[]) {
		this.init(origItems)
	}
}
