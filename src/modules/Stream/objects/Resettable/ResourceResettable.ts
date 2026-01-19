import type { IOwnedStream } from "../../interfaces/OwnedStream.js";


export abstract class ResourceResettable {
	protected abstract set resource(newResource: IOwnedStream | null)

	protected resetResource() {
		this.resource = null
	}
}
