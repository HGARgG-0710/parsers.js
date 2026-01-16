import { array } from "@hgargg-0710/one"
import type {
	ICopiable,
	IOwningStream,
	IStreamAction
} from "../../../interfaces.js"

export class StreamActionList<T = any> implements ICopiable {
	private ["constructor"]: new (actions: IStreamAction<T>[]) => this

	performOn(target: IOwningStream<T>) {
		for (const action of this.actions) action(target.resource!)
	}

	copy() {
		return new this.constructor(array.copy(this.actions))
	}

	constructor(private readonly actions: IStreamAction<T>[]) {}
}
