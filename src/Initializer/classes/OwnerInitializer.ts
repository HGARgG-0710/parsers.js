import type {
	IInitializer,
	IOwnerSettable,
	IResourceSettable
} from "../../interfaces/Initializer.js"

export const ownerInitializer: IInitializer<[IOwnerSettable, ...any[]]> = {
	init(owner: IResourceSettable, resource?: IOwnerSettable, ...rest: any[]) {
		if (resource) {
			owner.setResource(resource)
			resource.setOwner(owner)
		}
	}
}
