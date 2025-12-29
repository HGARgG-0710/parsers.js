import assert from "node:assert"
import type {
	ICaptureResolutionPredicate,
	IMatch,
	IPeekableStream,
	IRegexMatcher
} from "../../../interfaces.js"
import { OverflowCounter } from "../../OverflowCounter.js"
import { MatchCollector, MatchIterator } from "./Match.js"
import {
	BoundState,
	PeekKeeper,
	StateArray,
	StateHistory,
	type State
} from "./State.js"

class StateArrayPair<T = any> {
	private currList: StateArray
	private nextList: StateArray

	private resetLists() {
		this.currList = this.history.pushNew()
		this.nextList = this.history.pushNew()
	}

	resetNext() {
		this.nextList = this.history.pushNew()
	}

	reset(startState: State, peekKeeper: PeekKeeper) {
		this.history.clear()
		this.resetLists()
		this.currList.add(startState, peekKeeper)
	}

	advance() {
		this.currList = this.nextList
		this.nextList = this.history.pushNew()
	}

	get next() {
		return this.nextList
	}

	get curr() {
		return this.currList
	}

	constructor(private readonly history: StateHistory<T>) {
		this.resetLists()
	}
}

class MatchResult<T = any> {
	private result?: StateArray<T>

	commit() {
		this.peekKeeper.commit()
	}

	get() {
		assert(this.result)
		return this.result
	}

	set(result: StateArray<T>) {
		this.result = result
	}

	constructor(private readonly peekKeeper: PeekKeeper) {}
}

class MatchExecutor<T = any> {
	private readonly peekKeeper = new PeekKeeper<T>()
	private readonly result = new MatchResult<T>(this.peekKeeper)
	private readonly stateArrPair = new StateArrayPair<T>(this.history)

	private resetLists() {
		this.stateArrPair.reset(this.startState, this.peekKeeper)
	}

	private init(stream: IPeekableStream) {
		this.peekKeeper.init(stream)
		this.resetLists()
	}

	private addVerified(state: BoundState) {
		const nextState = state.next()
		this.stateArrPair.next.add(nextState, state.keeper)
		return nextState.isMatch
	}

	private tryMatching(state: BoundState) {
		return state.verify() && this.addVerified(state)
	}

	private prepareCommit(endKeeper: PeekKeeper) {
		this.peekKeeper.from(endKeeper)
	}

	private toMatch(state: BoundState) {
		this.prepareCommit(state.keeper)
		return true
	}

	private runAttempt() {
		for (const state of this.stateArrPair.curr) {
			if (!state.hasCurrPeek()) continue
			if (this.tryMatching(state)) return this.toMatch(state)
			state.advance()
		}
		return false
	}

	private fromPeeks() {
		do {
			if (this.runAttempt()) break
			this.stateArrPair.advance()
		} while (!this.stateArrPair.curr.isEmpty())
		return this.stateArrPair.next
	}

	private toMatchResult(rawStateList: StateArray) {
		this.result.set(rawStateList)
		return this.result
	}

	doMatchOn(stream: IPeekableStream) {
		this.init(stream)
		return this.toMatchResult(this.fromPeeks())
	}

	constructor(
		private readonly startState: State,
		private readonly history: StateHistory
	) {}
}

export class NFARegexMatcher<T = any> implements IRegexMatcher {
	private readonly executor: MatchExecutor<T>
	private readonly collector = new MatchCollector<T>()
	private readonly stateHistory = new StateHistory<T>(
		new OverflowCounter(() => this.resetStateIds())
	)

	private readonly iterator = new MatchIterator<T>(
		this.stateHistory,
		this.captureResolver
	)

	private resetStateIds() {
		this.startState.resetSeenTimes()
	}

	private collectResultFrom(states: StateArray<T>) {
		this.collector.reset()
		for (const capture of this.iterator.traceback(states.matchState))
			this.collector.prepend(capture)
		return this.collector.collect()
	}

	match<T = any>(stream: IPeekableStream<T>): IMatch {
		const result = this.executor.doMatchOn(stream)
		const states = result.get()
		if (!states.hasMatch()) return false
		result.commit()
		return this.collectResultFrom(states)
	}

	constructor(
		private readonly startState: State,
		private readonly captureResolver: ICaptureResolutionPredicate
	) {
		this.executor = new MatchExecutor(startState, this.stateHistory)
	}
}
