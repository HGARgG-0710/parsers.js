import type {
	IInitializer,
	IOwnerSettable,
	IResourceSettable
} from "../../../interfaces/Initializer.js"

/**
 * This is an `IInitializer` purposed to be used with `IResourceSettable`
 * `target`s, and a `resource?: IOwnerSettable` argument. If `resource` is
 * non-`null`, then `target.setResource(resource)` is called, followed by
 * `resource.setOwner(target)`.
 */
export const ownerInitializer: IInitializer<[IOwnerSettable, ...any[]]> = {
	init(owner: IResourceSettable, resource?: IOwnerSettable, ...rest: any[]) {
		if (resource) {
			owner.setResource(resource)
			resource.setOwner(owner)
		}
	}
}
