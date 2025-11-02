import type { IPeekableStream, IRegexMatcher } from "../../interfaces.js"
import { OverflowCounter } from "../OverflowCounter.js"
import { StateArrayList, type State } from "./State.js"

function toStateArrayList<T = any>(
	input: IPeekableStream<T>,
	startState: State,
	runCount: number
) {
	let currList = new StateArrayList(runCount)
	let nextList = new StateArrayList(runCount)
	let temp: StateArrayList

	currList.add(startState)

	let i = 0

	// ! BUG - need to check IF THE NEXT PEEK IS VALID! [it's an equivalent, but anyway...]
	while (!input.isEnd) {
		if (currList.isEmpty()) break
		if (step(currList, nextList, input.peek(i++))) break
		temp = currList
		currList = nextList
		nextList = temp
	}

	return currList
}

function step<T = any>(
	currList: StateArrayList,
	nextList: StateArrayList,
	curr: T
) {
	nextList.clear()
	for (const state of currList)
		if (state.verify(curr)) {
			const nextState = state.arrow.to
			nextList.add(nextState)
			if (nextState.isMatch) return true
		}
	return false
}

export class NFARegexMatcher implements IRegexMatcher {
	private readonly runCounter = new OverflowCounter()

	match<T = any>(
		stream: IPeekableStream<T>
	): false | string | (string | T)[] {
		const list = toStateArrayList(stream, this.state, this.runCounter.inc())
		if (!list.isMatch()) return false
		// TODO: handle options:
		// * 1. SUCCCESS MATCH - string (WE NEED TO *COLLECT* THE ITEMS FROM THE STRING!!!)
		// * 2. SUCCESS MATCH - (string | T)[]; One needs a GENERIC COLLECTION for (string | T)[],
		// 		which would DEGRADE to `string` (via concatenation) in case that NO "ITyped" types
		// 		has ever appeared...
	}

	constructor(private readonly state: State) {}
}
