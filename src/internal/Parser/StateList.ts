import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"

export interface IPropertiesGetterState {
	get(): Summat
	nextState(states: StateList): IPropertiesGetterState
}

export class StateList {
	private readonly states: IPropertiesGetterState[]
	private i = 0

	private withinBounds(index: number) {
		return index % this.states.length
	}

	private read(at: number) {
		return this.states[this.withinBounds(at)]
	}

	advance() {
		++this.i
	}

	readCurr() {
		return this.read(this.i)
	}

	readNext() {
		return this.read(this.i + 1)
	}

	constructor(...states: IPropertiesGetterState[]) {
		assert(states.length)
		this.states = states
	}
}
