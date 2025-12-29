import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPropertiesGetterState, StateList } from "./StateList.js"

export class PropertiesGetter {
	private currState: IPropertiesGetterState

	get() {
		const properties = this.currState.get()
		this.currState = this.currState.nextState(this.states)
		this.states.advance()
		return properties
	}

	constructor(private readonly states: StateList) {
		this.currState = states.readCurr()
	}
}

abstract class CommonPropertiesGetterState implements IPropertiesGetterState {
	get(): Summat {
		return this.propGetter()
	}

	abstract nextState(states: StateList): IPropertiesGetterState

	constructor(private readonly propGetter: () => Summat) {}
}

export class LoopPropertiesGetterState extends CommonPropertiesGetterState {
	nextState(): IPropertiesGetterState {
		return this
	}
}

export class NextPropertiesGetterState extends CommonPropertiesGetterState {
	nextState(states: StateList): IPropertiesGetterState {
		return states.readNext()
	}
}
