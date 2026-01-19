import type { IOwningStream } from "../../interfaces/OwnedStream.js"

export abstract class OwnerResettable {
	protected abstract set owner(newOwner: IOwningStream | null)

	protected resetOwner() {
		this.owner = null
	}
}
