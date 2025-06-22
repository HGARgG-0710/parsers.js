import type { IParseState, IStateful } from "../../../interfaces.js"

/**
 * This is an abstract class implementing `IStateful<IParseState>`.
 * It simply encapsulates a `.state: IParseState` property, together
 * with the `.setState(newState: IParseState): void` public method.
 *
 * It is intended to be used in combination with `mixin`s, for the
 * purpose of a more fine-grained and flexible refactoring of a
 * given `IStream`-implementing class.
 */
export abstract class StatefulStream implements IStateful<IParseState> {
	private _state: IParseState

	private set state(newState: IParseState) {
		this.state = newState
	}

	get state() {
		return this._state
	}

	setState(newState: IParseState) {
		this.state = newState
	}
}
