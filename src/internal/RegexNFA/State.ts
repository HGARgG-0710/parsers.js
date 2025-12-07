// ! NEED MORE `State` classes:
// * 1. for `UnicodeProperty` - one that (quickly/simply) defines a specific unicode property supported by the library's `Regex` syntax

import { type } from "@hgargg-0710/one"
import type { IPeekableStream, IValidNodeType } from "../../interfaces.js"
import { RetainedArray } from "../../objects.js"
import { isTyped } from "../../utils/Node.js"

const { isString, isNull } = type

export class PeekKeeper<T = any> {
	private stream: IPeekableStream<T>
	private index = 0

	get curr() {
		return this.stream.peek(this.index)
	}

	advance() {
		++this.index
	}

	behind() {
		--this.index
	}

	hasCurrPeek() {
		return this.stream.hasPeek(this.index)
	}

	isFirst() {
		return this.index === 0
	}

	init(stream: IPeekableStream<T>) {
		this.stream = stream
		this.index = 0
	}

	commit() {
		this.stream.toPeek(this.index)
	}
}

export class StateArrayList {
	readonly states = new RetainedArray<ArrowState>()
	private matchState: MatchState | null = null

	isMatch() {
		return !isNull(this.matchState)
	}

	isEmpty() {
		return this.states.size === 0
	}

	clear() {
		this.states.clear()
		this.matchState = null
	}

	reset(listId: number) {
		this.listId = listId
		this.clear()
	}

	add(state: State, keeper: PeekKeeper) {
		if (!state.beenSeen(this.listId)) {
			state.addTo(this, keeper)
			state.markSeen(this.listId)
		}
	}

	setMatchState(state: MatchState) {
		this.matchState = state
	}

	*[Symbol.iterator]() {
		yield* this.states
	}

	constructor(private listId: number) {}
}

export class Fragment {
	patch(outState: State) {
		for (const outArrow of this.outArrows) outArrow.set(outState)
		return this
	}

	append(...frags: Fragment[]) {
		for (const frag of frags) this.outArrows.push(...frag.outArrows)
		return this
	}

	constructor(readonly inState: State, readonly outArrows: StateArrow[]) {}
}

export class StateArrow {
	private _to: State

	get to() {
		return this._to
	}

	set(out: State) {
		this._to = out
	}
}

export abstract class State {
	abstract addTo(list: StateArrayList, keeper: PeekKeeper): void
	abstract verify(keeper: PeekKeeper): boolean

	private seenTimes = -1

	markSeen(i: number) {
		this.seenTimes = i
	}

	beenSeen(i: number) {
		return this.seenTimes === i
	}

	get isMatch() {
		return false
	}
}

export abstract class ArrowState extends State {
	readonly arrow = new StateArrow()

	addTo(list: StateArrayList, keeper: PeekKeeper): void {
		list.states.push(this)
	}
}

export class CharState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		return keeper.curr === this.char
	}

	constructor(private readonly char: string) {
		super()
	}
}

class MultVerifier {
	static verifyNone(options: State[], keeper: PeekKeeper): boolean {
		return !MultVerifier.verifySome(options, keeper)
	}

	static verifySome(options: State[], keeper: PeekKeeper): boolean {
		for (const option of options) if (option.verify(keeper)) return true
		return false
	}
}

abstract class MultState extends State {
	// * note: we allow optional `verify` because depending on the
	// * context in which `EitherState` is used, it serves DIFFERENT
	// * PURPOSES. The reason it's represented by the same object is
	// * because they are so semantically close.
	// ? (although maybe it'd be better to split them? meh, maybe later)
	verify(keeper: PeekKeeper): boolean {
		return MultVerifier.verifySome(this.options, keeper)
	}

	constructor(protected readonly options: State[]) {
		super()
	}
}

export class EitherState extends MultState {
	addTo(list: StateArrayList, keeper: PeekKeeper): void {
		for (const option of this.options)
			if (option.verify(keeper)) option.addTo(list, keeper)
	}
}

export class CodeRangeState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		const currItem = keeper.curr
		if (!isString(currItem)) return false
		const codePoint = currItem.codePointAt(0)!
		return this.from <= codePoint && codePoint <= this.to
	}

	constructor(private readonly from: number, private readonly to: number) {
		super()
	}
}

// ! pre-doc: a state that matches any item - ADVANCES THE POSITION
export class AnythingState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		return true
	}
}

// ! pre-doc: an empty state - always matches - NO ADVANCEMENT OF POSITION
export class EmptyState extends ArrowState {
	addTo(list: StateArrayList, keeper: PeekKeeper): void {
		list.add(this.arrow.to, keeper)
	}

	verify(keeper: PeekKeeper): boolean {
		return this.arrow.to.verify(keeper)
	}
}

// ! pre-doc: this checks a given item for: 1. being an `ITyped`; 2. having the correct `type` (use `utils.Node.isType` for this...)
export class TokenState extends ArrowState {
	verify(verify: PeekKeeper): boolean {
		const currItem = verify.curr
		return isTyped(currItem) && currItem.type === this.type
	}

	constructor(private readonly type: IValidNodeType) {
		super()
	}
}

export class NoneOfState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		return MultVerifier.verifyNone(this.options, keeper)
	}

	constructor(private readonly options: State[]) {
		super()
	}
}

export class BoundaryState extends ArrowState {
	private verifySimple(keeper: PeekKeeper) {
		return MultVerifier.verifySome(this.options, keeper)
	}

	protected verifyFirst(keeper: PeekKeeper) {
		return keeper.isFirst()
	}

	protected verifyCommon(keeper: PeekKeeper) {
		keeper.behind()
		const isLastMatch = this.verifySimple(keeper)
		keeper.advance()
		const isCurrMatch = this.verifySimple(keeper)
		return isCurrMatch !== isLastMatch
	}

	verify(keeper: PeekKeeper): boolean {
		return this.verifyFirst(keeper) || this.verifyCommon(keeper)
	}

	constructor(private readonly options: State[]) {
		super()
	}
}

export class NonBoundaryState extends BoundaryState {
	protected verifyCommon(keeper: PeekKeeper): boolean {
		return !super.verifyCommon(keeper)
	}
}

export class MatchState extends State {
	addTo(list: StateArrayList): void {
		list.setMatchState(this)
	}

	verify(keeper: PeekKeeper) {
		return true
	}

	beenSeen(i: number): boolean {
		return false
	}

	get isMatch() {
		return true
	}
}
