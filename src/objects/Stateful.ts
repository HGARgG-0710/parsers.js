import type { IParseState, IStateful } from "../interfaces.js"

export abstract class Stateful implements IStateful<IParseState> {
	private _state: IParseState | null = null

	private set state(newState: IParseState) {
		this.state = newState
	}

	get state() {
		return this._state!
	}

	protected resetState(): void {
		this._state = null
	}

	setState(newState: IParseState) {
		this.state = newState
	}
}
