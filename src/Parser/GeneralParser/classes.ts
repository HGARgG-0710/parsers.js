import type { BaseParsingState } from "../interfaces.js"
import type { ParsingState } from "./interfaces.js"

export function GeneralParser<T extends BaseParsingState>(initState?: T) {
	return function (state: T) {
		if (initState) state = { ...initState, ...state }
		while (!state.finished)
			(state.change as Function)((state.parser as Function)(state))
		return state
	}
}

export function DefineFinished<T extends BaseParsingState = ParsingState>(
	x: T,
	finished: () => boolean
) {
	return Object.defineProperty(x, "finished", {
		get: finished
	})
}
