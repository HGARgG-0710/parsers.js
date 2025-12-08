import assert from "node:assert"
import type { IPeekableStream, IRegexMatcher } from "../../interfaces.js"
import { OverflowCounter } from "../OverflowCounter.js"
import { BoundState, PeekKeeper, StateArrayList, type State } from "./State.js"

class StateArrayListPair {
	private readonly listId = new OverflowCounter()
	private currList: StateArrayList
	private nextList: StateArrayList

	resetNext() {
		this.nextList.reset(this.listId.inc())
	}

	reset(startState: State) {
		const newId = this.listId.inc()
		this.currList.reset(newId)
		this.nextList.reset(newId + 1)
		this.currList.add(startState, this.peekKeeper)
	}

	switch() {
		const temp = this.currList
		this.currList = this.nextList
		this.nextList = temp
	}

	get next() {
		return this.nextList
	}

	get curr() {
		return this.currList
	}

	constructor(private readonly peekKeeper: PeekKeeper) {
		const currId = this.listId.get()
		this.currList = new StateArrayList(currId)
		this.nextList = new StateArrayList(currId + 1)
	}
}

class MatchResult {
	private result?: StateArrayList

	commit() {
		this.peekKeeper.commit()
	}

	get() {
		assert(this.result)
		return this.result
	}

	set(result: StateArrayList) {
		this.result = result
	}

	constructor(private readonly peekKeeper: PeekKeeper) {}
}

class MatchExecutor {
	private readonly peekKeeper = new PeekKeeper()
	private readonly lists = new StateArrayListPair(this.peekKeeper)
	private readonly result = new MatchResult(this.peekKeeper)

	private init(stream: IPeekableStream) {
		this.peekKeeper.init(stream)
		this.lists.reset(this.startState)
	}

	private addVerified(state: BoundState) {
		const nextState = state.next()
		this.lists.next.add(nextState, state.keeper)
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
		this.lists.resetNext()
		for (const state of this.lists.curr) {
			if (!state.hasCurrPeek()) continue
			if (this.tryMatching(state)) return this.toMatch(state)
			state.advance()
		}
		return false
	}

	private fromPeeks() {
		do {
			if (this.runAttempt()) break
			this.lists.switch()
		} while (!this.lists.curr.isEmpty())
		return this.lists.next
	}

	private toMatchResult(rawStateList: StateArrayList) {
		this.result.set(rawStateList)
		return this.result
	}

	doMatch(stream: IPeekableStream) {
		this.init(stream)
		return this.toMatchResult(this.fromPeeks())
	}

	constructor(private readonly startState: State) {}
}

export class NFARegexMatcher implements IRegexMatcher {
	private readonly executor: MatchExecutor

	match<T = any>(
		stream: IPeekableStream<T>
	): false | string | (string | T)[] {
		const result = this.executor.doMatch(stream)
		const list = result.get()
		if (!list.isMatch()) return false
		result.commit()
		// TODO: handle options:
		// * 1. SUCCCESS MATCH - string (WE NEED TO *COLLECT* THE ITEMS FROM THE STRING!!!)
		// * 2. SUCCESS MATCH - (string | T)[]; One needs a GENERIC COLLECTION for (string | T)[],
		// 		which would DEGRADE to `string` (via concatenation) in case that NO "ITyped" types
		// 		has ever appeared...
	}

	constructor(startState: State) {
		this.executor = new MatchExecutor(startState)
	}
}
