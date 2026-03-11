import { type } from "@hgargg-0710/one"
import assert from "node:assert"
import { BadId, NewId } from "../../../constants.js"
import { Pools } from "../../../global.js"
import type {
	IMatchedState,
	IPeekableStream,
	IValidNodeType
} from "../../../interfaces.js"
import {
	ArrayCollection,
	ObjectPool,
	Poolable,
	Regex
} from "../../../objects.js"
import { isTyped } from "../../../utils/Node.js"
import type { OverflowCounter } from "../../Utils/OverflowCounter.js"
import { toLowerCase, toUpperCase } from "../../Utils/Unicode.js"

const { isString, isNull } = type

export class BoundState<T = any>
	extends Poolable<[ArrowState, PeekKeeper<T>]>
	implements IMatchedState
{
	static readonly pool = Pools.Internal.add(
		new ObjectPool<BoundState, [State, PeekKeeper]>(BoundState)
	)

	private _state: ArrowState | null
	private _wasVerified: boolean
	private _captured: string | T

	readonly keeper = new PeekKeeper<T>()

	private set wasVerified(wasVerified: boolean) {
		this._wasVerified = wasVerified
	}

	private set captured(item: string | T) {
		this._captured = item
	}

	private set state(newState: ArrowState) {
		this._state = newState
	}

	private resetState() {
		this._state = null
	}

	private resetCommon() {
		this.wasVerified = false
		this.captured = ""
	}

	protected get pool() {
		return BoundState.pool as ObjectPool<
			typeof this,
			[State, PeekKeeper<T>]
		>
	}

	override postFree(): void {
		this.resetCommon()
		this.resetState()
	}

	init(state?: ArrowState, keeper?: PeekKeeper): this {
		if (state) this.state = state
		if (keeper) this.keeper.from(keeper)
		this.resetCommon()
		return this
	}

	get wasVerified() {
		return this._wasVerified
	}

	get captured() {
		return this._captured
	}

	get state() {
		return this._state!
	}

	verify() {
		const result = (this.wasVerified = this.state.verify(this.keeper))
		if (result) this.captured = this.state.getCaptured(this.keeper)
		return result
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
	private static TotalInstances = BadId

	private static NewId() {
		return (this.TotalInstances = NewId(this.TotalInstances))
	}

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
		assert(PeekKeeper.TotalInstances <= Number.MAX_SAFE_INTEGER)
		this.id = PeekKeeper.NewId()
	}
}

export class StateHistory<T = any> {
	readonly stateArrs = new ArrayCollection<StateArray<T>>()

	hasItemAt(i: number) {
		return i < this.stateArrs.size
	}

	top(i?: number) {
		return this.stateArrs.last(i)
	}

	pushNew() {
		const newId = this.listId.inc()
		const newArr = StateArray.pool.create(newId)
		this.stateArrs.push(newArr)
		return newArr
	}

	clear() {
		for (const arr of this.stateArrs) arr.free()
		this.stateArrs.clear()
	}

	constructor(private readonly listId: OverflowCounter) {}
}

export class StateArray<T = any> extends Poolable<[number]> {
	static readonly pool = Pools.Internal.add(new ObjectPool(StateArray))

	private listId: number
	private _matchState: MatchState | null = null
	readonly states = new ArrayCollection<BoundState<T>>()

	private set matchState(newMatchState: MatchState) {
		this._matchState = newMatchState
	}

	private newIdAdd(state: State<T>, keeper: PeekKeeper) {
		state.markSeen(this.listId)
		state.forgetAllKeepers()
		this.commonAdd(state, keeper)
	}

	private commonAdd(state: State, keeper: PeekKeeper) {
		state.register(keeper)
		state.addTo(this, keeper)
	}

	private resetMatchState() {
		this._matchState = null
	}

	private clearStates() {
		for (const boundState of this.states) boundState.free()
		this.states.clear()
	}

	private clear() {
		this.clearStates()
		this.resetMatchState()
	}

	protected get pool() {
		return StateArray.pool as ObjectPool<this, [number]>
	}

	hasMatch() {
		return !isNull(this.matchState)
	}

	isEmpty() {
		return this.states.isEmpty()
	}

	override postFree(): void {
		this.clear()
	}

	init(listId?: number) {
		if (listId) {
			this.listId = listId
			this.clear()
		}
		return this
	}

	verifiedPriorTo(state: State) {
		return this.states.filter(
			(x) => x.wasVerified && x.state.next() === state
		)
	}

	add(state: State, keeper: PeekKeeper) {
		if (!state.beenSeen(this.listId)) return this.newIdAdd(state, keeper)
		if (!state.beenSeenWith(keeper)) return this.commonAdd(state, keeper)
	}

	setMatchState(state: MatchState) {
		this.matchState = state
	}

	get matchState() {
		assert(this._matchState)
		return this._matchState
	}

	*[Symbol.iterator]() {
		yield* this.states
	}

	constructor(listId: number = -1) {
		super(listId)
	}
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

	constructor(
		readonly inState: State,
		readonly outArrows: StateArrow[]
	) {}
}

export class StateArrow<T = any> {
	private _to: State<T>

	get to() {
		return this._to
	}

	set(out: State<T>) {
		this._to = out
	}
}

export abstract class State<T = any> {
	private static readonly Unseen = -1

	abstract addTo(list: StateArray, keeper: PeekKeeper<T>): void
	abstract verify(keeper: PeekKeeper<T>): boolean
	abstract advance(keeper: PeekKeeper<T>): void

	private readonly keeperIds = new ArrayCollection<number>()

	private seenTimes = State.Unseen

	resetSeenTimes() {
		this.seenTimes = State.Unseen
	}

	beenSeenWith(keeper: PeekKeeper<T>): boolean {
		return this.keeperIds.has(keeper.id)
	}

	register(keeper: PeekKeeper<T>) {
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

	getCaptured(keeper: PeekKeeper<T>): T | string {
		return ""
	}

	get isMatch() {
		return false
	}
}

export abstract class ArrowState<T = any> extends State<T> {
	readonly arrow = new StateArrow<T>()

	override resetSeenTimes(): void {
		super.resetSeenTimes()
		this.next().resetSeenTimes()
	}

	with(keeper: PeekKeeper) {
		return BoundState.pool.create(this, keeper)
	}

	advance(keeper: PeekKeeper<T>) {
		keeper.advance()
	}

	addTo(list: StateArray<T>, keeper: PeekKeeper<T>): void {
		list.states.push(this.with(keeper))
	}

	next() {
		return this.arrow.to
	}
}

abstract class SingleCapturingState<T = any> extends ArrowState<T> {
	override getCaptured(keeper: PeekKeeper<T>): T | string {
		return this.extensions.get("noCapture") ? "" : keeper.curr
	}

	constructor(protected readonly extensions: Regex.ExtensionMap) {
		super()
	}
}

class MultVerifier {
	static verifySome(options: State[], keeper: PeekKeeper): boolean {
		for (const option of options) if (option.verify(keeper)) return true
		return false
	}
}

export class EitherState extends State {
	override resetSeenTimes(): void {
		super.resetSeenTimes()
		for (const option of this.options) option.resetSeenTimes()
	}

	advance(keeper: PeekKeeper): void {}

	// * note: we allow optional `verify` because depending on the
	// * context in which `EitherState` is used, it serves DIFFERENT
	// * PURPOSES. The reason it's represented by the same object is
	// * because they are so semantically close.
	verify(keeper: PeekKeeper): boolean {
		return MultVerifier.verifySome(this.options, keeper)
	}

	addTo(list: StateArray, keeper: PeekKeeper): void {
		for (const option of this.options) option.addTo(list, keeper)
	}

	constructor(private readonly options: State[]) {
		super()
	}
}

abstract class LocaleSensitiveState<T = any> extends SingleCapturingState<T> {
	protected abstract baseVerify(x: string): boolean

	private ignoreCaseVerify(item: string): boolean {
		return (
			this.baseVerify(toLowerCase(item)) ||
			this.baseVerify(toUpperCase(item))
		)
	}

	verify({ curr }: PeekKeeper): boolean {
		if (!isString(curr)) return false
		return this.extensions.get("ignoreCase")
			? this.ignoreCaseVerify(curr)
			: this.baseVerify(curr)
	}
}

export class CharState<T = any> extends LocaleSensitiveState<T> {
	protected baseVerify(item: string): boolean {
		return item === this.char
	}

	constructor(
		private readonly char: string,
		extensions: Regex.ExtensionMap
	) {
		super(extensions)
	}
}

export class CodeRangeState<T = any> extends LocaleSensitiveState<T> {
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
export class AnythingState<T = any> extends SingleCapturingState<T> {
	verify(keeper: PeekKeeper<T>): boolean {
		return true
	}
}

// ! pre-doc: an empty state - always matches - NO ADVANCEMENT OF POSITION
export class EmptyState<T = any> extends ArrowState<T> {
	override addTo(list: StateArray, keeper: PeekKeeper): void {
		this.next().addTo(list, keeper)
	}

	verify(keeper: PeekKeeper): boolean {
		return this.next().verify(keeper)
	}

	override getCaptured(keeper: PeekKeeper<T>): string | T {
		return this.next().getCaptured(keeper)
	}
}

// ! pre-doc: this checks a given item for: 1. being an `ITyped`; 2. having the correct `type` (use `utils.Node.isType` for this...)
export class TokenState<T = any> extends SingleCapturingState<T> {
	verify(keeper: PeekKeeper<T>): boolean {
		const currItem = keeper.curr
		return isTyped(currItem) && currItem.type === this.type
	}

	constructor(
		private readonly type: IValidNodeType,
		extensions: Regex.ExtensionMap
	) {
		super(extensions)
	}
}

export class NoneOfState<T = any> extends SingleCapturingState<T> {
	verify(keeper: PeekKeeper): boolean {
		return !MultVerifier.verifySome(this.options, keeper)
	}

	constructor(
		private readonly options: State[],
		extensions: Regex.ExtensionMap
	) {
		super(extensions)
	}
}

export class BoundaryState<T = any> extends ArrowState<T> {
	private verifySimple(keeper: PeekKeeper) {
		return MultVerifier.verifySome(this.options, keeper)
	}

	protected verifyCommon(keeper: PeekKeeper) {
		keeper.behind()
		const isLastMatch = this.verifySimple(keeper)
		keeper.advance()
		const isCurrMatch = this.verifySimple(keeper)
		return isCurrMatch !== isLastMatch
	}

	verify(keeper: PeekKeeper<T>): boolean {
		return keeper.isFirst() || this.verifyCommon(keeper)
	}

	// * IMPORTANT. This is what enables one to put boundary
	// * classes *in between* other patterns like '\w+\b{\w}.'
	// * (matches word followed by anything that isn't a word, equiv. of '\w+^[\W]')
	// (in fact, this line is pretty much the reason that
	// `advance` was even originally added to the `State`)
	override advance(keeper: PeekKeeper): void {}

	constructor(private readonly options: State[]) {
		super()
	}
}

export class NonBoundaryState<T = any> extends BoundaryState<T> {
	protected override verifyCommon(keeper: PeekKeeper<T>): boolean {
		return !super.verifyCommon(keeper)
	}
}

export class MatchState<T = any> extends State<T> {
	advance(keeper: PeekKeeper): void {}

	addTo(list: StateArray): void {
		list.setMatchState(this)
	}

	verify(keeper: PeekKeeper) {
		return true
	}

	override beenSeen(i: number): boolean {
		return false
	}

	override get isMatch() {
		return true
	}
}

abstract class BaseUnicodePropertyState<
	T = any
> extends LocaleSensitiveState<T> {
	private delegate: RegExp | null = null

	protected override baseVerify(x: string): boolean {
		if (!this.delegate) this.delegate = this.getDelegate()
		return this.delegate.test(x)
	}

	protected abstract getDelegate(): RegExp

	constructor(extensions: Regex.ExtensionMap) {
		super(extensions)
	}
}

export class UnicodePropertyAliasState<
	T = any
> extends BaseUnicodePropertyState<T> {
	protected override getDelegate(): RegExp {
		return new RegExp(`^\\p{${this.propName}}$`, "v")
	}

	constructor(
		private readonly propName: string,
		extensions: Regex.ExtensionMap
	) {
		super(extensions)
	}
}

export class UnicodePropertyState<T = any> extends BaseUnicodePropertyState<T> {
	protected override getDelegate(): RegExp {
		return new RegExp(`^\\p{${this.propName}=${this.value}}$`, "v")
	}

	constructor(
		private readonly propName: string,
		private readonly value: string,
		extensions: Regex.ExtensionMap
	) {
		super(extensions)
	}
}
