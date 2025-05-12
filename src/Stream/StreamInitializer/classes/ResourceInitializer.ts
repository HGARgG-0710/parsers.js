import type { IResourceSettable } from "../../interfaces/StreamInitializer.js"

export const resourceInitializer = {
	init(resourceHaving: IResourceSettable, resource?: unknown) {
		resourceHaving.setResource(resource)
	}
}
