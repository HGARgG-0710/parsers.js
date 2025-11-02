import type { IResource } from "../interfaces.js"

export class ResourceCollection<T extends IResource = any> {
	private readonly resources = new Set<T>()

	add(resource: T) {
		this.resources.add(resource)
		return resource
	}

	clear() {
		for (const x of this.resources) x.cleanup()
		this.resources.clear()
	}
}
