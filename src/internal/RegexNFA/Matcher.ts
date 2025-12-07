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
		this.currList.add(startState)
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

	constructor() {
		const currId = this.listId.get()
		this.currList = new StateArrayList(currId)
		this.nextList = new StateArrayList(currId + 1)
	}
}

export class NFARegexMatcher implements IRegexMatcher {
	private readonly peekKeeper = new PeekKeeper()

	private lists = new StateArrayListPair()

	private addVerified(state: ArrowState) {
		const nextState = state.arrow.to
		this.lists.next.add(nextState)
		return nextState.isMatch
	}

	private tryMatching(state: ArrowState) {
		return state.verify(this.peekKeeper) && this.addVerified(state)
	}

	private step() {
		let isMatch: boolean = false
		this.lists.resetNext()
		for (const state of this.lists.curr)
			if ((isMatch = this.tryMatching(state))) break
		return isMatch
	}

	private init(stream: IPeekableStream) {
		this.lists.reset(this.startState)
		this.peekKeeper.init(stream)
	}

	private toStateArrayList(stream: IPeekableStream) {
		this.init(stream)

		do {
			if (this.lists.curr.isEmpty()) break
			if (this.step()) break
			this.peekKeeper.advance()
			this.lists.switch()
		} while (this.peekKeeper.hasAnyMore())

		return this.lists.next
	}

	match<T = any>(
		stream: IPeekableStream<T>
	): false | string | (string | T)[] {
		const list = this.toStateArrayList(stream)
		if (!list.isMatch()) return false
		// TODO: handle options:
		// * 1. SUCCCESS MATCH - string (WE NEED TO *COLLECT* THE ITEMS FROM THE STRING!!!)
		// * 2. SUCCESS MATCH - (string | T)[]; One needs a GENERIC COLLECTION for (string | T)[],
		// 		which would DEGRADE to `string` (via concatenation) in case that NO "ITyped" types
		// 		has ever appeared...
		// ! REMEMBER to add the `stream.toPeek(matchedItems.length)`
	}

	constructor(private readonly startState: State) {}
}
