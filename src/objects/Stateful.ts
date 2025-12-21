import type { IParseState, IStateful } from "../interfaces.js"

export abstract class Stateful implements IStateful<IParseState> {
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
