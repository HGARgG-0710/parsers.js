// ! NEED MORE `State` classes:
// * 1. for `UnicodeProperty` - one that (quickly/simply) defines a specific unicode property supported by the library's `Regex` syntax

import { type } from "@hgargg-0710/one"
import type { IPeekableStream, IValidNodeType } from "../../interfaces.js"
import { RetainedArray } from "../../objects.js"
import { isTyped } from "../../utils/Node.js"

const { isString, isNull } = type

export interface IMaybeVerifiableState extends State {
	verify?(keeper: PeekKeeper): boolean
}

export interface IVerifiableState extends State {
	verify(keeper: PeekKeeper): boolean
}

export class PeekKeeper<T = any> {
	private stream: IPeekableStream<T>
	private index = 0

	get curr() {
		return this.stream.peek(this.index)
	}

	advance() {
		++this.index
	}

	behind(n: number) {
		this.stream.peek(Math.max(this.index - n, 0))
	}

	hasAnyMore() {
		return this.stream.hasPeek(this.index)
	}

	isFirst() {
		return this.index === 0
	}

	init(stream: IPeekableStream<T>) {
		this.stream = stream
		this.index = 0
	}

	constructor() {}
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

	add(state: State) {
		if (!state.beenSeen(this.listId)) {
			state.addTo(this)
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
	private _to: IMaybeVerifiableState

	get to() {
		return this._to
	}

	set(out: IMaybeVerifiableState) {
		this._to = out
	}
}

export abstract class State {
	private seenTimes = -1

	abstract addTo(list: StateArrayList): void

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

	addTo(list: StateArrayList): void {
		list.states.push(this)
	}

	abstract verify(keeper: PeekKeeper): boolean
}

export class CharState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		return keeper.curr === this.char
	}

	constructor(private readonly char: string) {
		super()
	}
}

export class EitherState extends State implements IVerifiableState {
	// * note: we allow optional `verify` because depending on the
	// * context in which `EitherState` is used, it serves DIFFERENT
	// * PURPOSES. The reason it's represented by the same object is
	// * because they are so semantically close.
	// ? (although maybe it'd be better to split them? meh, maybe later)
	verify(keeper: PeekKeeper): boolean {
		for (const option of this.options)
			if (option.verify && !option.verify(keeper)) return false
		return true
	}

	addTo(list: StateArrayList): void {
		for (const option of this.options) list.add(option)
	}

	constructor(readonly options: IMaybeVerifiableState[]) {
		super()
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
	addTo(list: StateArrayList): void {
		list.add(this.arrow.to)
	}

	verify(keeper: PeekKeeper): boolean {
		return !this.arrow.to.verify || this.arrow.to.verify(keeper)
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
	verify(verify: PeekKeeper): boolean {
		for (const item of this.items) if (item.verify(verify)) return false
		return true
	}

	constructor(private readonly items: IVerifiableState[]) {
		super()
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
