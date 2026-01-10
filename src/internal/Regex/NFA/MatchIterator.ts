import type { ICaptureResolutionPredicate } from "../../../interfaces.js"
import type { BoundState, MatchState, State, StateHistory } from "./State.js"

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
