// ! NEED MORE `State` classes:
// * 1. for `UnicodeProperty` - one that (quickly/simply) defines a specific unicode property supported by the library's `Regex` syntax

import { type } from "@hgargg-0710/one"
import assert from "node:assert"
import { Pools } from "../../global.js"
import type { IPeekableStream, IValidNodeType } from "../../interfaces.js"
import { ObjectPool, Poolable, Regex, RetainedArray } from "../../objects.js"
import { isTyped } from "../../utils/Node.js"
import { toLowerCase, toUpperCase } from "../Unicode.js"

const { isString, isNull } = type

export class BoundState<T = any> extends Poolable<[ArrowState, PeekKeeper<T>]> {
	static readonly pool = Pools.Internal.add(
		new ObjectPool<BoundState, [State, PeekKeeper]>(BoundState)
	)

	private state: ArrowState
	readonly keeper = new PeekKeeper<T>()

	protected get pool() {
		return BoundState.pool as ObjectPool<
			typeof this,
			[State, PeekKeeper<T>]
		>
	}

	init(state?: ArrowState, keeper?: PeekKeeper): this {
		if (state) this.state = state
		if (keeper) this.keeper.from(keeper)
		return this
	}

	verify() {
		return this.state.verify(this.keeper)
	}

	advance() {
		this.state.advance(this.keeper)
	}

	next() {
		return this.state.next()
	}

	hasCurrPeek() {
		return this.keeper.hasCurrPeek()
	}
}

export class PeekKeeper<T = any> {
	private static TotalKeepers = 0

	readonly id: number
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

	from(keeper: PeekKeeper<T>) {
		this.index = keeper.index
		this.stream = keeper.stream
	}

	constructor() {
		assert(PeekKeeper.TotalKeepers <= Number.MAX_SAFE_INTEGER)
		this.id = PeekKeeper.TotalKeepers++
	}
}

export class StateArrayList {
	readonly states = new RetainedArray<BoundState>()
	private matchState: MatchState | null = null

	private clearStates() {
		for (const boundState of this.states) boundState.free()
		this.states.clear()
	}

	private resetMatch() {
		this.matchState = null
	}

	private newIdAdd(state: State, keeper: PeekKeeper) {
		state.markSeen(this.listId)
		state.forgetAllKeepers()
		this.commonAdd(state, keeper)
	}

	private commonAdd(state: State, keeper: PeekKeeper) {
		state.register(keeper)
		state.addTo(this, keeper)
	}

	isMatch() {
		return !isNull(this.matchState)
	}

	isEmpty() {
		return this.states.size === 0
	}

	clear() {
		this.clearStates()
		this.resetMatch()
	}

	reset(listId: number) {
		this.listId = listId
		this.clear()
	}

	add(state: State, keeper: PeekKeeper) {
		if (!state.beenSeen(this.listId)) return this.newIdAdd(state, keeper)
		if (!state.beenSeenWith(keeper)) return this.commonAdd(state, keeper)
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
	abstract advance(keeper: PeekKeeper): void

	private readonly keeperIds = new RetainedArray<number>()

	private seenTimes = -1

	resetSeenTimes() {
		this.seenTimes = -1
	}

	beenSeenWith(keeper: PeekKeeper): boolean {
		return this.keeperIds.has(keeper.id)
	}

	register(keeper: PeekKeeper) {
		this.keeperIds.push(keeper.id)
	}

	forgetAllKeepers() {
		this.keeperIds.clear()
	}

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

	resetSeenTimes(): void {
		super.resetSeenTimes()
		this.next().resetSeenTimes()
	}

	with(keeper: PeekKeeper) {
		return BoundState.pool.create(this, keeper)
	}

	advance(keeper: PeekKeeper) {
		keeper.advance()
	}

	addTo(list: StateArrayList, keeper: PeekKeeper): void {
		list.states.push(this.with(keeper))
	}

	next() {
		return this.arrow.to
	}
}

class MultVerifier {
	static verifySome(options: State[], keeper: PeekKeeper): boolean {
		for (const option of options) if (option.verify(keeper)) return true
		return false
	}
}

export class EitherState extends State {
	resetSeenTimes(): void {
		super.resetSeenTimes()
		for (const option of this.options) option.resetSeenTimes()
	}

	advance(keeper: PeekKeeper): void {}

	// * note: we allow optional `verify` because depending on the
	// * context in which `EitherState` is used, it serves DIFFERENT
	// * PURPOSES. The reason it's represented by the same object is
	// * because they are so semantically close.
	// ? (although maybe it'd be better to split them? meh, maybe later)
	verify(keeper: PeekKeeper): boolean {
		return MultVerifier.verifySome(this.options, keeper)
	}

	addTo(list: StateArrayList, keeper: PeekKeeper): void {
		for (const option of this.options) option.addTo(list, keeper)
	}

	constructor(private readonly options: State[]) {
		super()
	}
}

abstract class LocaleSensitiveState extends ArrowState {
	protected abstract baseVerify(x: string): boolean

	private ignoreCaseVerify(item: string): boolean {
		return (
			this.baseVerify(toLowerCase(item)) ||
			this.baseVerify(toUpperCase(item))
		)
	}

	verify({ curr }: PeekKeeper): boolean {
		if (!isString(curr)) return false
		return this.extensions.ignoreCase
			? this.ignoreCaseVerify(curr)
			: this.baseVerify(curr)
	}

	constructor(private readonly extensions: Regex.ExtensionMap) {
		super()
	}
}

export class CharState extends LocaleSensitiveState {
	protected baseVerify(item: string): boolean {
		return item === this.char
	}

	constructor(private readonly char: string, extensions: Regex.ExtensionMap) {
		super(extensions)
	}
}

export class CodeRangeState extends LocaleSensitiveState {
	protected baseVerify(char: string) {
		const codePoint = char.codePointAt(0)!
		return this.from <= codePoint && codePoint <= this.to
	}

	constructor(
		private readonly from: number,
		private readonly to: number,
		extensions: Regex.ExtensionMap
	) {
		super(extensions)
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
		this.next().addTo(list, keeper)
	}

	verify(keeper: PeekKeeper): boolean {
		return this.next().verify(keeper)
	}
}

// ! pre-doc: this checks a given item for: 1. being an `ITyped`; 2. having the correct `type` (use `utils.Node.isType` for this...)
export class TokenState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		const currItem = keeper.curr
		return isTyped(currItem) && currItem.type === this.type
	}

	constructor(private readonly type: IValidNodeType) {
		super()
	}
}

export class NoneOfState extends ArrowState {
	verify(keeper: PeekKeeper): boolean {
		return !MultVerifier.verifySome(this.options, keeper)
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

	// * IMPORTANT. This is what enables one to put boundary
	// * classes *in between* other patterns like '\w+\b{\w}.'
	// * (matches word followed by anything that isn't a word, equiv. of '\w+^[\W]')
	// (in fact, this line is pretty much the reason that
	// `advance` was even originally added to the `State`)
	advance(keeper: PeekKeeper): void {}

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
	advance(keeper: PeekKeeper): void {}

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
