import type {
	IInitializer,
	IResourceSettable
} from "../../../interfaces/Initializer.js"

export const resourceInitializer: IInitializer<[any]> = {
	init(resourceHaving: IResourceSettable, resource?: unknown) {
		if (resource) resourceHaving.setResource(resource)
	}
}
