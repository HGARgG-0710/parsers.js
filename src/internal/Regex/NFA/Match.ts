import { type } from "@hgargg-0710/one"
import type {
	ICaptureResolutionPredicate,
	IMatchResult,
	IPartialMatch
} from "../../../interfaces.js"
import { ArrayCollection, RetainedArray } from "../../../objects.js"
import type { BasicArray } from "../../BasicArray.js"
import type { BoundState, MatchState, State, StateHistory } from "./State.js"

const { isString } = type

type ISubarrLimits = readonly [number, number][]

// ! PROBLEM: need to MERGE the two *sanitized-only* arrays [with ARRAY-INDEXES for sanitation SAVED!];
// !!! 	3. GENERALIZE THIS in a way that would enable the 'Sanitizer's to be COMPOSABLE [would allow FURTHER easy-addition of similar replacement-features in the future, if we *ever* need it...]
export class MatchCollector<T = any> {
	private readonly reversed = new RetainedArray<T | string>()
	private readonly stringMatchSanitizer = new MatchSanitizer(
		new StringMatchSanitizingAgent<T>()
	)
	private readonly emptyMatchSanitizer = new MatchSanitizer(
		new FilteringSanitizingAgent<T>()
	)
	private readonly emptyMatchesLimits = new SubarrayLimits<IPartialMatch<T>>(
		(x) => this.isEmpty(x)
	)
	private readonly stringMatchesLimits = new SubarrayLimits<IPartialMatch<T>>(
		(x) => !this.isEmpty(x) && this.isStringMatch(x)
	)

	private asForward() {
		return this.reversed.get().toReversed()
	}

	private isEmpty(match: IPartialMatch<T>): match is "" {
		return match === ""
	}

	private isStringMatch(item: IPartialMatch<T>): item is string {
		return !this.isEmpty(item) && isString(item)
	}

	private updateStartSubarrLimits(item: IPartialMatch<T>) {
		this.emptyMatchesLimits.tryAdd(item)
	}

	reset() {
		this.reversed.clear()
		this.emptyMatchesLimits.reset()
		this.stringMatchesLimits.reset()
	}

	prepend(item: IPartialMatch<T>) {
		this.updateStartSubarrLimits(item)
		this.reversed.push(item)
	}

	collect(): IMatchResult<T> {
		const forward = this.asForward()
		const blankSanitized = this.emptyMatchSanitizer.apply(
			forward,
			this.emptyMatchesLimits,
			this.stringMatchesLimits
		)
		const stringSanitized = this.stringMatchSanitizer.apply(
			blankSanitized,
			this.stringMatchesLimits
		)
		return stringSanitized
	}
}

class LastEndLimit {
	get() {
		return this.limits.last()[1]
	}

	inc() {
		++this.limits.last()[1]
	}

	constructor(private readonly limits: BasicArray<[number, number]>) {}
}

class SubarrayLimits<T = any> {
	private readonly limits = new ArrayCollection<[number, number]>()
	private readonly lastEndLimit = new LastEndLimit(this.limits)
	private runningIndex = 0

	private getNextPair(): [number, number] {
		const newStart = this.runningIndex
		return [newStart, newStart]
	}

	private resetRunningIndex() {
		this.runningIndex = 0
	}

	private isContinuous() {
		return (
			this.runningIndex > 0 &&
			this.runningIndex === this.lastEndLimit.get()
		)
	}

	private increaseLast() {
		this.lastEndLimit.inc()
		this.forward()
	}

	private appendNew() {
		this.limits.push(this.getNextPair())
	}

	private addNew() {
		if (this.isContinuous()) this.increaseLast()
		else this.appendNew()
	}

	private forward() {
		++this.runningIndex
	}

	reset() {
		this.limits.clear()
		this.resetRunningIndex()
	}

	tryAdd(item: T) {
		if (this.inclusionCondition(item)) this.addNew()
		else this.forward()
	}

	get() {
		return this.limits.get()
	}

	constructor(private readonly inclusionCondition: (x: T) => boolean) {}
}

// ! predoc: the 'start' and 'end' are BOTH INCLUSIVE!
interface ISanitizingAgent<T = any> {
	setTarget(target: IMatchResult<T>): void
	apply(raw: IMatchResult<T>, start: number, end: number): void
}

class MatchSanitizer<T = any> {
	private firstRemainsInd: number
	private rawResult: IMatchResult<T>
	private nextLimits?: SubarrayLimits<IPartialMatch<T>>

	private setRawResult(rawResult: IMatchResult<T>) {
		this.rawResult = rawResult
	}

	private setNextLimits(nextLimits?: SubarrayLimits<IPartialMatch<T>>) {
		this.nextLimits = nextLimits
	}

	private tryUpdateNextLimit(withItem: IPartialMatch<T>) {
		if (this.nextLimits) this.nextLimits.tryAdd(withItem)
	}

	// ! pre-doc: DOCUMENT THIS [internal JSDOC - *NOT* part or Wiki; REMINDER: create *proper* JSDoc for INTERNAL stuff
	// !	in case you EVER have to maintain this for your future projects with new requirements...
	// %	Specifically, this is an instance of Design-By-Contract; Document ALL such instances INTERNAL *and* public
	// ! ]
	// * note: `i` is not checked since `last(rangeIndex)[1]` is required to be `< result.length` [`assert`-checked],
	// 		AND `ranges[rangeIndex][i][0] <= ranges[rangeIndex][i][1] < rangeIndex[i + 1][0] + 1` holds, for each 'i'
	// 		(implicit, by construction; introduces some Connescence);
	private toSanitized(ranges: ISubarrLimits): IMatchResult<T> {
		const sanitized: IMatchResult<T> = []
		this.agent.setTarget(sanitized)
		let i = 0
		for (let currRngInd = 0; currRngInd < ranges.length; ++currRngInd) {
			const [start, end] = ranges[currRngInd]
			const itemsNewlyInserted = this.rawResult.slice(i, start)
			for (const item of itemsNewlyInserted) this.tryUpdateNextLimit(item)
			sanitized.push(...itemsNewlyInserted)
			this.agent.apply(this.rawResult, start, end)
			i = end + 1
		}
		this.firstRemainsInd = i
		return sanitized
	}

	private pushCleanRemains(to: IMatchResult<T>) {
		let i = this.firstRemainsInd
		while (i < to.length) to.push(this.rawResult[i++])
		return to
	}

	apply(
		rawResult: IMatchResult<T>,
		subarrLimits: SubarrayLimits<IPartialMatch<T>>,
		nextLimits?: SubarrayLimits<IPartialMatch<T>>
	) {
		const ranges = subarrLimits.get()
		if (!ranges.length) return rawResult
		this.setRawResult(rawResult)
		this.setNextLimits(nextLimits)
		return this.pushCleanRemains(this.toSanitized(ranges))
	}

	constructor(private readonly agent: ISanitizingAgent<T>) {}
}

class FilteringSanitizingAgent<T = any> implements ISanitizingAgent<T> {
	setTarget(rawResult: IMatchResult<T>): void {}

	apply(): void {}
}

class StringMatchSanitizingAgent<T = any> implements ISanitizingAgent<T> {
	private targetSanitized: IMatchResult<T>

	setTarget(target: IMatchResult<T>): void {
		this.targetSanitized = target
	}

	apply(raw: IMatchResult<T>, start: number, end: number): void {
		this.targetSanitized.push(raw.slice(start, end + 1).join(""))
	}
}

export class MatchIterator<T = any> {
	private priorTo(state: State, prevIndex?: number) {
		const prevStateArr = this.history.top(prevIndex)
		const verified = prevStateArr.verifiedPriorTo(state)
		return verified[this.captureResolver(verified)]
	}

	*traceback(matchState: MatchState) {
		let currState: BoundState<T> = this.priorTo(matchState)
		yield currState.captured
		for (let i = 1; this.history.hasItemAt(i); ++i) {
			currState = this.priorTo(currState.state, i)
			yield currState.captured
		}
	}

	constructor(
		private readonly history: StateHistory,
		private readonly captureResolver: ICaptureResolutionPredicate<T>
	) {}
}
