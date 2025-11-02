// ! NEED MORE `State` classes:
// * 1. for `CodePoint` - one that defines a (quick) check for 'from <= x.codePointAt(0) && x.codePointAt(0) <= to'
// * 2. for `UnicodeProperty` - one that (quickly/simply) defines a specific unicode property supported by the library's `Regex` syntax
// ? 3. EitherState - for representing `Either`?

import type { IValidNodeType } from "../../interfaces.js"

export class Fragment {
	patch(outState: State) {
		for (const outArrow of this.outArrows) outArrow.set(outState)
	}

	append(...frags: Fragment[]) {
		for (const frag of frags) this.outArrows.push(...frag.outArrows)
		return this
	}

	constructor(readonly inState: State, readonly outArrows: StateArrow[]) {}
}

export class StateArrow {
	private to: State

	set(out: State) {
		this.to = out
	}
}

export abstract class State {
	get isMatch() {
		return false
	}
}

export abstract class ArrowState extends State {
	readonly arrow = new StateArrow()
}

export class CharState extends ArrowState {
	constructor(private readonly char: string) {
		super()
	}
}

export class EitherState extends State {
	constructor(readonly options: State[]) {
		super()
	}
}

// ! pre-doc: a state that matches a SINGLE character/token. Only requirement is that the `IStream` be not-yet-finished...
export class AnythingState extends ArrowState {}

export class CodeRangeState extends ArrowState {
	constructor(private readonly from: number, private readonly to: number) {
		super()
	}
}

// ! pre-doc: an empty state - always matches
export class EmptyState extends ArrowState {}

// ! pre-doc: this checks a given item for: 1. being an `ITyped`; 2. having the correct `type` (use `utils.Node.isType` for this...)
export class TokenState extends ArrowState {
	constructor(private readonly type: IValidNodeType) {
		super()
	}
}

export class MatchState extends State {
	get isMatch() {
		return true
	}
}
