import type {
	IInitializer,
	IResourceConnectable
} from "../../../interfaces/Initializer.js"

/**
 * This is an `IInitializer` purposed to be used with `IResourceConnectable`
 * `target`s. It has a `resource` of uknown nature, and, if the `resource`
 * is non-`null`, it is added via the `target.connectResource(resource)` method call.
 */
export const resourceInitializer: IInitializer<[any]> = {
	init(resourceHaving: IResourceConnectable, resource?: unknown) {
		if (resource) {
			resourceHaving.connectResource(resource)
			resourceHaving.baseInit()
		}
	}
}
