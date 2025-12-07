import assert from "node:assert"
import type { IPeekableStream, IRegexMatcher } from "../../interfaces.js"
import { OverflowCounter } from "../OverflowCounter.js"
import { ArrowState, PeekKeeper, StateArrayList, type State } from "./State.js"

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

	private addVerified(state: ArrowState) {
		const nextState = state.arrow.to
		this.lists.next.add(nextState, this.peekKeeper)
		return nextState.isMatch
	}

	private tryMatching(state: ArrowState) {
		return state.verify(this.peekKeeper) && this.addVerified(state)
	}

	private attempt() {
		let isMatch: boolean = false
		this.lists.resetNext()
		for (const state of this.lists.curr)
			if ((isMatch = this.tryMatching(state))) break
		return isMatch
	}

	private init(stream: IPeekableStream) {
		this.peekKeeper.init(stream)
		this.lists.reset(this.startState)
	}

	private fromPeeks() {
		do {
			if (this.lists.curr.isEmpty()) break
			if (this.attempt()) break
			this.peekKeeper.advance()
			this.lists.switch()
		} while (this.peekKeeper.hasCurrPeek())
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
