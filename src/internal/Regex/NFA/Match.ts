import { type } from "@hgargg-0710/one"
import type {
	ICaptureResolutionPredicate,
	ICleanMatch,
	IMatchResult,
	IPartialMatch
} from "../../../interfaces.js"
import { ArrayCollection, Regex, RetainedArray } from "../../../objects.js"
import type { BasicArray } from "../../BasicArray.js"
import type { BoundState, MatchState, State, StateHistory } from "./State.js"

const { isString } = type

type ISubarrLimits = readonly [number, number][]

// ! PROBLEM: need to MERGE the two *sanitized-only* arrays [with ARRAY-INDEXES for sanitation SAVED!];
// * 	1. Specifically, run the TWO sanitizers on the RAW 'IMatchResult'
// ! 		1. FIX the 'MatchSanitizer' to ALSO accept a NEW 'SubarrayLimits', 
// ! 			which will be FILLED as it DOES the sanitizing! 
// 				1. THEN, we REMOVE the "filling" of the 'stringMatchLimits', and INSTEAD give them to the 'emptyMatchSanitizer'; 
// 			2. Namely, one replaces the: 
// 					1. for-over-items-added-on-adding + for-over-items-added-to-see-which-are-blanks/which-are-strings/which-are...?
// 						1. building of a Map of arrays for each "type" of replacement [complex]
// 					2. for-over-items-added-to-perform-complex-combined-replacement-logic [return final arr]
// 				With: 
// 					1. for-over-items-added-on-adding + for-over-items-added-to-see-which-are-blanks
// 					2. build-smaller-temp-arr-with-Blanks + for-over-items-added-to-see-which-are-strings
// 					3. build-even-smaller-temp-arr-with-Strings, RETURN FINAL ARR
// 				The second is MORE MAINTAINABLE 
// 						[since it's CHAINING, and not "orchestrating" the internal behaviour 
// 							of a given super-complex Map, where conditions MAY intersect easily
// 							and their order of calling must be accounted-for...]
// * 	2. THEN, *combine* the two results TOGETHER!
// ! 		1. RUN 'Blank'-sanitizer FIRST, and THEN - the 'StringMatch'-sanitizer!v
// !!! 	3. GENERALIZE THIS in a way that would enable the 'Sanitizer's to be COMPOSABLE [would allow FURTHER easy-addition of similar replacement-features in the future, if we *ever* need it...]
export class MatchCollector<T = any> {
	private readonly reversed = new RetainedArray<T | string>()
	private readonly stringMatchSanitizer = new MatchSanitizer(
		new StringMatchSanitizingAgent<T>()
	)
	private readonly emptyMatchSanitizer = new MatchSanitizer(
		new EmptyMatchSanitizingAgent<T>()
	)
	private readonly emptyMatchesLimits = new SubarrayLimits()
	private readonly stringMatchesLimits = new SubarrayLimits()

	private asForward() {
		return this.reversed.get().toReversed()
	}

	private isEmpty(match: IPartialMatch<T>): match is "" {
		return match === ""
	}

	private isStringMatch(item: IPartialMatch<T>): item is string {
		return !this.isEmpty(item) && isString(item)
	}

	private updateSubarrLimits(item: IPartialMatch<T>) {
		this.emptyMatchesLimits.addIf(this.isEmpty(item))
		this.stringMatchesLimits.addIf(this.isStringMatch(item))
	}

	reset() {
		this.reversed.clear()
		this.emptyMatchesLimits.reset()
		this.stringMatchesLimits.reset()
	}

	prepend(item: IPartialMatch<T>) {
		this.updateSubarrLimits(item)
		this.reversed.push(item)
	}

	collect(): IMatchResult<T> {
		const forward = this.asForward()
		const blankSanitized = this.emptyMatchSanitizer.apply(
			forward,
			this.emptyMatchesLimits
		)
		// ! WRONG - must use the 'blankSanitized' here...
		// const stringSanitized = this.stringMatchSanitizer.apply(
		// 	forward,
		// 	this.stringMatchesLimits
		// )
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

class SubarrayLimits {
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

	private add() {
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

	addIf(condition: boolean) {
		if (condition) this.add()
		else this.forward()
	}

	get() {
		return this.limits.get()
	}
}

// ! predoc: the 'start' and 'end' are BOTH INCLUSIVE!
interface ISanitizingAgent<T = any> {
	apply(raw: IMatchResult<T>, start: number, end: number): ICleanMatch<T>
}

class MatchSanitizer<T = any> {
	private firstRemainsInd: number
	private rawResult: IMatchResult<T>

	private setRawResult(rawResult: IMatchResult<T>) {
		this.rawResult = rawResult
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
		let i = 0
		for (let currRngInd = 0; currRngInd < ranges.length; ++currRngInd) {
			const [start, end] = ranges[currRngInd]
			sanitized.push(...this.rawResult.slice(i, start))
			sanitized.push(this.agent.apply(this.rawResult, start, end))
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

	apply(rawResult: IMatchResult<T>, subarrLimits: SubarrayLimits) {
		const ranges = subarrLimits.get()
		if (!ranges.length) return rawResult
		this.setRawResult(rawResult)
		return this.pushCleanRemains(this.toSanitized(ranges))
	}

	constructor(private readonly agent: ISanitizingAgent<T>) {}
}

class EmptyMatchSanitizingAgent<T = any> implements ISanitizingAgent<T> {
	apply(): ICleanMatch<T> {
		return new Regex.Break()
	}
}

class StringMatchSanitizingAgent<T = any> implements ISanitizingAgent<T> {
	apply(raw: IMatchResult<T>, start: number, end: number): ICleanMatch<T> {
		return raw.slice(start, end + 1).join("")
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
