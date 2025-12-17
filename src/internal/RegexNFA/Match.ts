import { type } from "@hgargg-0710/one"
import type {
	ICaptureResolutionPredicate,
	IMatchResult,
	IMixedMatch
} from "../../interfaces.js"
import { RetainedArray } from "../../objects.js"
import type { BoundState, MatchState, State, StateHistory } from "./State.js"

const { isString } = type

export class MatchCollector<T = any> {
	private readonly reversed = new RetainedArray<T | string>()
	private readonly toString = new StringMatchCollectorStrategy<T>()
	private readonly toVaried = new ObjectMatchCollectorStrategy<T>()
	private strategy: INFARegexMatchStrategy<T> = this.toString

	reset() {
		this.reversed.clear()
		this.strategy = this.toString
	}

	prepend(item: T | string) {
		if (!isString(item)) this.strategy = this.toVaried
		this.reversed.push(item)
	}

	collect() {
		return this.strategy.collect(
			this.reversed
				.get()
				.filter((x) => x !== "")
				.reverse()
		)
	}
}

interface INFARegexMatchStrategy<
	T = any,
	Out extends IMatchResult<T> = IMatchResult<T>
> {
	collect(items: IMixedMatch<T>): Out
}

class StringMatchCollectorStrategy<T = any>
	implements INFARegexMatchStrategy<T, string>
{
	collect(items: IMixedMatch<T>): string {
		return (items as string[]).join()
	}
}

class ObjectMatchCollectorStrategy<T = any>
	implements INFARegexMatchStrategy<T, IMixedMatch<T>>
{
	collect(items: IMixedMatch<T>): IMixedMatch<T> {
		return items
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
