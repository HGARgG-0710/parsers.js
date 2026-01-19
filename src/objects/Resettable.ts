import type { IOwnedStream, IOwningStream } from "../interfaces.js"

export abstract class OwnerResettable {
	protected abstract set owner(newOwner: IOwningStream | null)

	protected resetOwner() {
		this.owner = null
	}
}

export abstract class ResourceResettable {
	protected abstract set resource(newResource: IOwnedStream | null)

	protected resetResource() {
		this.resource = null
	}
}
