import type { IResourceSettable } from "../interfaces.js"

export const resourceInitializer = {
	init(resourceHaving: IResourceSettable, resource?: unknown) {
		resourceHaving.setResource(resource)
	}
}
