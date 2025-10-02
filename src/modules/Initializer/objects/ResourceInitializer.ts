import type {
	IInitializer,
	IResourceSettable
} from "../../../interfaces/Initializer.js"

/**
 * This is an `IInitializer` purposed to be used with `IResourceSettable`
 * `target`s. It has a `resource` of uknown nature, and, if the `resource`
 * is non-`null`, it is added via the `target.setResource(resource)` method call.
 */
export const resourceInitializer: IInitializer<[any]> = {
	init(resourceHaving: IResourceSettable, resource?: unknown) {
		if (resource) resourceHaving.setResource(resource)
	}
}
