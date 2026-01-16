import { StreamActionList } from "../ActionList.js"
import type { IOwnedStream } from "../../interfaces/OwnedStream.js"
import { BasicResourceStream } from "./BasicResourceStream.js"

export abstract class EndActionStream<
	T = any,
	Args extends any[] = []
> extends BasicResourceStream<T, [IOwnedStream<T>, ...(Args | [])]> {
	private readonly afterEnd: StreamActionList<T>

	protected abstract getAfterEndActions(): StreamActionList<T>

	protected override postEnd(): void {
		this.afterEnd.performOn(this)
	}

	constructor(resource?: IOwnedStream<T>) {
		super()
		this.afterEnd = this.getAfterEndActions()
		this.init(resource)
	}
}
