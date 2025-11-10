import type { IPeekableStream, IRegexMatcher } from "../../interfaces.js"
import { OverflowCounter } from "../OverflowCounter.js"
import { ArrowState, StateArrayList, type State } from "./State.js"

export class NFARegexMatcher implements IRegexMatcher {
	private readonly listId = new OverflowCounter()
	private currList: StateArrayList
	private nextList: StateArrayList

	private input: IPeekableStream

	private peekAt(i: number) {
		return this.input.peek(i)
	}

	private resetNextList() {
		this.nextList.reset(this.listId.inc())
	}

	private addVerified(state: ArrowState) {
		const nextState = state.arrow.to
		this.nextList.add(nextState)
		return nextState.isMatch
	}

	private tryMatching<T = any>(state: ArrowState, against: T) {
		return state.verify(against) && this.addVerified(state)
	}

	private step<T = any>(i: number) {
		let isMatch: boolean = false
		const curr: T = this.peekAt(i)
		this.resetNextList()
		for (const state of this.currList)
			if ((isMatch = this.tryMatching(state, curr))) break
		return isMatch
	}

	private resetLists() {
		const newId = this.listId.inc()
		this.currList.reset(newId)
		this.nextList.reset(newId + 1)
		this.currList.add(this.startState)
	}

	private toStateArrayList() {
		this.resetLists()
		let i = 0

		do {
			if (this.currList.isEmpty()) break
			if (this.step(i++)) break
			const temp = this.currList
			this.currList = this.nextList
			this.nextList = temp
		} while (this.input.hasPeek(i))

		return this.nextList
	}

	match<T = any>(
		stream: IPeekableStream<T>
	): false | string | (string | T)[] {
		this.input = stream
		const list = this.toStateArrayList()
		if (!list.isMatch()) return false
		// TODO: handle options:
		// * 1. SUCCCESS MATCH - string (WE NEED TO *COLLECT* THE ITEMS FROM THE STRING!!!)
		// * 2. SUCCESS MATCH - (string | T)[]; One needs a GENERIC COLLECTION for (string | T)[],
		// 		which would DEGRADE to `string` (via concatenation) in case that NO "ITyped" types
		// 		has ever appeared...
		// ! REMEMBER to add the `stream.toPeek(matchedItems.length)`
	}

	constructor(private readonly startState: State) {
		const currId = this.listId.get()
		this.currList = new StateArrayList(currId)
		this.nextList = new StateArrayList(currId + 1)
	}
}
