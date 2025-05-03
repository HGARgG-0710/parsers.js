import type { IInitializable } from "../interfaces.js"

import { array } from "@hgargg-0710/one"
const { first } = array

type IDerivable<
	T extends IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> = T | EvaluableList<T, Recursive>

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

type IEvaluableIdentifiable = {
	readonly isEvaluableList?: boolean
}

type ISwitchIdentifiable = {
	readonly isSwitch?: boolean
}

function isSwitch(x: ISwitchIdentifiable): x is Switch {
	return !!x.isSwitch
}

function isEvaluableList(x: IEvaluableIdentifiable): x is EvaluableList {
	return !!x.isEvaluableList
}

class Switch<
	T extends IInitializable &
		ISwitchIdentifiable &
		IEvaluableIdentifiable = any,
	Recursive extends ISwitchIdentifiable & IEvaluableIdentifiable = any
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

// ! IMPORTANT note: will need to `assert` that all the things passed are EITHER `.isFunction`;

// Arguments:
// 		! 1. isRecursive = isFunction // SINCE, we are actually passing `.init`-ializiazble *IStream-s*, the 'chooser's are the ONLY functions ever present;
// 		! 2. T = IStream<Type> [ADD mandatory IInitializable]; NOTE: these are NOT IStreamClass-es, INSTEAD, these are INSTANCES!
// 		! 3. Recursive = IChooser
// 		! 4. evaluator = (chooser, streamInstance) => chooser(streamInstance)
// 	^ 		CONCLUSION: `chooser`s will HAVE to return NEW 'Stream'-s/Arrays-of-'Stream's [that is, their CREATION is a part of the actual parsing-function];
// 		! 5. origItems - the (...x: (IStream | IChooser)[]) FROM the pre-initialization step of the `ComposedStream` [more precisely - the constructor of the `DynamicComposition];
// Notes:
// * 0. IChooser-s RETURN IStream objects, and NOT classes for them. This is ESSENTIAL;
// * 1. `.evaluate(with)` is called when we want to RE-INITIALIZE the 'IStream' instances present OR create new ones,
// 		IN OTHER WORDS, cases:
// 			1. the ComposedStream-iteration has (just) begun, and we are searching the first "shtick"
// 		ARGUMENT is the `.origResource` of the `ComposedStream` [input that is used to then obtain the REAL `.resource` - the result of `.firstNonRecursive()`]; 
// * 2. USE '.evaluateWhen(pred, evalWith)' when we strike `.isEnd` on the `.resource`. 
// 		1. this is the "renewal" method. HERE, `isOld = (x) => x.isEnd`; 
// 		2. IF returns `false`, then we KNOW that the `ComposedStream` is FINISHED; 
// 		3. Otherwise, we KNOW that the Stream continues AS-IS, 
// 			and then - we just PROCEED to be calling it as desired
// * 3. USE `.firstNonRecursive()` to get the "final" Stream, FROM WHICH the values will be DIRECTLY channeled! [note: THAT can cange just as well!]
// * 4. To get new elements (.next()) and check for last element (.isCurrEnd()) from the obtained `.resource`, one just delegates the appropriate methods; 
export class EvaluableList<
	T extends ISwitchIdentifiable &
		IEvaluableIdentifiable &
		IInitializable = any,
	Recursive extends ISwitchIdentifiable = any
> implements IEvaluableIdentifiable
{
	private items: IRecursiveItems<T, Recursive>
	private lastInitialized: T | null = null

	get isEvaluableList() {
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

	private expandEvaluated(
		fillable: IFillableSwitch<T, Recursive>,
		evaledWith: T
	) {
		fillable.expand(this.evaluator, evaledWith)
	}

	private fillSwitch(fillable: IFillableSwitch<T, Recursive>, evaledWith: T) {
		this.expandEvaluated(fillable, evaledWith)
		this.evaluateDerivable(fillable.derivable, evaledWith)
	}

	private evaluateDerivable(
		maybeSublist: IDerivable<T, Recursive>,
		evaledWith: T
	) {
		let sublist: EvaluableList<T, Recursive> | null
		if ((sublist = this.ensureSublist(maybeSublist)))
			this.evaluateSublist(sublist, evaledWith)
	}

	private ensureSublist(maybeSublist: IDerivable<T, Recursive>) {
		return isEvaluableList(maybeSublist) ? maybeSublist : null
	}

	private evaluateSublist(
		sublist: EvaluableList<T, Recursive>,
		evaledWith: T
	) {
		sublist.evaluate(evaledWith)
		this.linkEvaluatedSublist(sublist)
	}

	private linkEvaluatedSublist(sublist: EvaluableList<T, Recursive>) {
		this.lastInitialized = sublist.firstNonRecursive()
	}

	evaluate(origTerm: T) {
		for (let i = this.size; --i; )
			this.initSwitchable(this.items[i], this.lastInitialized || origTerm)
	}

	init(origItems: (T | Recursive)[]) {
		const mutItems: IPreRecursiveItems<T, Recursive> = origItems
		for (let i = origItems.length; --i; )
			mutItems[i] = this.wrapSwitch(origItems[i])
		this.items = mutItems as IRecursiveItems<T, Recursive>
		return this
	}

	firstNonRecursive(): T {
		let firstItem: IRecursivelySwitchable<T, Recursive>
		let firstDerivable: IDerivable<T, Recursive>
		return isSwitch((firstItem = this.firstItem()))
			? isEvaluableList((firstDerivable = firstItem.derivable))
				? firstDerivable.firstNonRecursive()
				: firstDerivable
			: firstItem
	}

	// TODO: refactor!!!
	evaluateWhen(isOld: (terminal: T) => boolean, evaledWith: T) {
		let seenSwitch = false
		for (let i = this.size; i--; ) {
			const lastItem = this.lastInitialized || evaledWith
			const currItem = this.items[i]
			if (isSwitch(currItem)) {
				seenSwitch = true
				const currDerivable = currItem.derivable
				if (isEvaluableList(currDerivable)) {
					if (!currDerivable.evaluateWhen(isOld, evaledWith))
						this.fillSwitch(currItem, lastItem)
				} else if (isOld(currDerivable))
					this.expandEvaluated(currItem, lastItem)
			} else if (isOld(currItem)) {
				if (seenSwitch) this.initTerminal(currItem, lastItem)
				else return false
			}
		}
		return true
	}

	constructor(
		origItems: (T | Recursive)[],
		private isRecursive: (x: any) => x is Recursive,
		private evaluator: IFoldable<T, Recursive>
	) {
		this.init(origItems)
	}
}
