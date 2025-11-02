// ! NEED MORE `State` classes:
// * 1. for `CodePoint` - one that defines a (quick) check for 'from <= x.codePointAt(0) && x.codePointAt(0) <= to'
// * 2. for `UnicodeProperty` - one that (quickly/simply) defines a specific unicode property supported by the library's `Regex` syntax

export abstract class State {
	get isMatch() {
		return false
	}
}

export class CharState extends State {
	constructor(private readonly char: string) {
		super()
	}
}

export class EitherState extends State {}

export class MatchState extends State {
	get isMatch() {
		return true
	}
}
