import type { IOwnerSettable, IResourceSettable } from "../../interfaces/StreamInitializer.js"

export const ownerInitializer = {
	init(owner: IResourceSettable, resource: IOwnerSettable) {
		owner.setResource(resource)
		resource.setOwner(owner)
	}
}
