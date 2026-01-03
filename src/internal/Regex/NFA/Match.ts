import { type } from "@hgargg-0710/one"
import assert from "assert"
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

export class MatchCollector<T = any> {
	private readonly sanitizerChain = new MatchSanitizerChain<T>(
		new MatchTransformLayer(
			new MatchSanitizer(new FilteringSanitizingAgent<T>()),
			new SubarrayLimits<IPartialMatch<T>>((x) => this.isEmpty(x))
		),
		new MatchTransformLayer(
			new MatchSanitizer(new StringMatchSanitizingAgent<T>()),
			new SubarrayLimits<IPartialMatch<T>>((x) => this.isStringMatch(x))
		)
	)

	private readonly reversed = new RetainedArray<T | string>()

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
		this.sanitizerChain.start.tryAdd(item)
	}

	reset() {
		this.reversed.clear()
		this.sanitizerChain.reset()
	}

	prepend(item: IPartialMatch<T>) {
		this.updateStartSubarrLimits(item)
		this.reversed.push(item)
	}

	collect(): IMatchResult<T> {
		return this.sanitizerChain.apply(this.asForward())
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

class MatchTransformLayer<T = any> {
	constructor(
		readonly sanitizer: MatchSanitizer<T>,
		readonly subarrLimits: SubarrayLimits<IPartialMatch<T>>
	) {}
}

class MatchTransformLink<T = any> {
	reset() {
		this.subarrLimits.reset()
		this.nextLimits.reset()
	}

	apply(input: IMatchResult<T>) {
		return this.sanitizer.apply(input, this.subarrLimits, this.nextLimits)
	}

	tryAdd(item: IPartialMatch<T>) {
		this.subarrLimits.tryAdd(item)
	}

	constructor(
		private readonly sanitizer: MatchSanitizer<T>,
		private readonly subarrLimits: SubarrayLimits<IPartialMatch<T>>,
		private readonly nextLimits: SubarrayLimits<IPartialMatch<T>>
	) {}
}

class MatchSanitizerChain<T = any> {
	private readonly links: MatchTransformLink<T>[]

	get start() {
		return this.links[0]
	}

	private defineLinks(layers: MatchTransformLayer<T>[]) {
		for (let i = 0; i < layers.length - 1; ++i) {
			const from = layers[i]
			const to = layers[i + 1]
			this.links[i] = new MatchTransformLink(
				from.sanitizer,
				from.subarrLimits,
				to.subarrLimits
			)
		}
	}

	apply(input: IMatchResult<T>) {
		let currResult: IMatchResult<T> = input
		for (const link of this.links) currResult = link.apply(currResult)
		return currResult
	}

	reset() {
		for (const link of this.links) link.reset()
	}

	constructor(...layers: MatchTransformLayer<T>[]) {
		assert(layers.length >= 2)
		this.links = new Array(layers.length - 1)
		this.defineLinks(layers)
	}
}

class SubarrayLimits<T = any> {
	private readonly limits = new ArrayCollection<[number, number]>()
	private readonly lastEndLimit = new LastEndLimit(this.limits)
	private runningIndex = 0
	private wasDiscontinuityScheduled = false

	private getNextPair(): [number, number] {
		const newStart = this.runningIndex
		return [newStart, newStart]
	}

	private unsetDiscontinuity() {
		this.wasDiscontinuityScheduled = false
	}

	private resetRunningIndex() {
		this.runningIndex = 0
	}

	private onDiscontinuityScheduled() {
		this.unsetDiscontinuity()
		return false
	}

	private isContinuous() {
		return this.wasDiscontinuityScheduled
			? this.onDiscontinuityScheduled()
			: this.runningIndex > 0 &&
					this.runningIndex === this.lastEndLimit.get()
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

	private onInclusionFail() {
		this.forward()
		// Explanation: we have ALREADY achieved
		// 		discontinuity by calling `.forward()`
		// 		*without* needing to "fake" it with a
		// 		specialized `wasDiscontinuityScheduled` var;
		// 		Ergo, we must unset it.
		this.unsetDiscontinuity()
	}

	reset() {
		this.limits.clear()
		this.resetRunningIndex()
		this.unsetDiscontinuity()
	}

	tryAdd(item: T) {
		if (this.inclusionCondition(item)) this.addNew()
		else this.onInclusionFail()
	}

	get() {
		return this.limits.get()
	}

	scheduleDiscontinuity() {
		this.wasDiscontinuityScheduled = true
	}

	areNone() {
		return this.limits.isEmpty()
	}

	constructor(private readonly inclusionCondition: (x: T) => boolean) {}
}

// ! predoc: the 'start' and 'end' are BOTH INCLUSIVE!
interface ISanitizingAgent<T = any> {
	apply(raw: IMatchResult<T>, start: number, end: number): IPartialMatch<T>[]
	postAction(nextLimits: SubarrayLimits<IPartialMatch<T>>): void
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

	private tryUpdateNextLimits(withItem: IPartialMatch<T>) {
		if (this.nextLimits) this.nextLimits.tryAdd(withItem)
	}

	private tryUpdateNextLimitsFor(items: IMatchResult<T>) {
		for (const item of items) this.tryUpdateNextLimits(item)
	}

	private recordCleanItems(from: IPartialMatch<T>[], into: IMatchResult<T>) {
		this.tryUpdateNextLimitsFor(from)
		into.push(...from)
	}

	private applyAgentOn(start: number, end: number) {
		return this.agent.apply(this.rawResult, start, end)
	}

	private tryRunPostAction() {
		if (this.nextLimits) this.agent.postAction(this.nextLimits)
	}

	// ! pre-doc: DOCUMENT THIS [internal JSDOC - *NOT* part or Wiki; REMINDER: create *proper* JSDoc for INTERNAL stuff
	// !	in case you EVER have to maintain this for your future projects with new requirements...
	// %	Specifically, this is an instance of Design-By-Contract; Document ALL such instances INTERNAL *and* public
	// ! ]
	// * note: `i` is not checked since `last(rangeIndex)[1]` is required to be `< result.length` [`assert`-checked],
	// 		AND `ranges[rangeIndex][i][0] <= ranges[rangeIndex][i][1] < rangeIndex[i + 1][0]` holds, for each 'i'
	// 		(implicit, by construction; introduces some Connescence);
	private toSanitized(ranges: ISubarrLimits): IMatchResult<T> {
		const sanitized: IMatchResult<T> = []
		let i = 0
		for (let currRngInd = 0; currRngInd < ranges.length; ++currRngInd) {
			const [start, end] = ranges[currRngInd]
			this.recordCleanItems(this.rawResult.slice(i, start), sanitized)
			this.recordCleanItems(this.applyAgentOn(start, end), sanitized)
			this.tryRunPostAction()
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

	private applyTrivial(rawResult: IMatchResult<T>) {
		this.tryUpdateNextLimitsFor(rawResult)
		return rawResult
	}

	private applyCommon(rawResult: IMatchResult<T>, ranges: ISubarrLimits) {
		this.setRawResult(rawResult)
		return this.pushCleanRemains(this.toSanitized(ranges))
	}

	apply(
		rawResult: IMatchResult<T>,
		subarrLimits: SubarrayLimits<IPartialMatch<T>>,
		nextLimits?: SubarrayLimits<IPartialMatch<T>>
	) {
		this.setNextLimits(nextLimits)
		return subarrLimits.areNone()
			? this.applyTrivial(rawResult)
			: this.applyCommon(rawResult, subarrLimits.get())
	}

	constructor(private readonly agent: ISanitizingAgent<T>) {}
}

class FilteringSanitizingAgent<T = any> implements ISanitizingAgent<T> {
	apply(): IPartialMatch<T>[] {
		return []
	}

	postAction(nextLimits: SubarrayLimits<IPartialMatch<T>>): void {
		nextLimits.scheduleDiscontinuity()
	}
}

class StringMatchSanitizingAgent<T = any> implements ISanitizingAgent<T> {
	apply(
		raw: IMatchResult<T>,
		start: number,
		end: number
	): IPartialMatch<T>[] {
		return [raw.slice(start, end + 1).join("")]
	}

	postAction(nextLimits: SubarrayLimits<IPartialMatch<T>>): void {}
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
