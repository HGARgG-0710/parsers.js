import type {
	IInitializer,
	IOwnerConnectable,
	IResourceConnectable
} from "../../../interfaces/Initializer.js"

/**
 * This is an `IInitializer` purposed to be used with `IResourceConnectable`
 * `target`s, and a `resource?: IOwnerConnectable` argument. If `resource` is
 * non-`null`, then `target.connectResource(resource)` is called, followed by
 * `resource.connectOwner(target)`.
 */
export const ownerInitializer: IInitializer<[IOwnerConnectable, ...any[]]> = {
	init(
		owner: IResourceConnectable,
		resource?: IOwnerConnectable,
		...rest: any[]
	) {
		if (resource) {
			resource.connectOwner(owner)
			owner.connectResource(resource)
			owner.baseInit()
		}
	}
}
