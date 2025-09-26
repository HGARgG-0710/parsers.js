import type { IResource } from "../interfaces.js"

/**
 * This is a class for managing objects of type `T extends IResource`.
 * More specifically, it is an object enabling one to:
 *
 * 1. get/create the needed resource using the "primary key"
 * `Args[0]` (ex: typically, when working with files - a filename)
 * 2. cleanup a resource at a given "primary key"
 * 3. cleanup all the currently used resources
 *
 * The reason for the object's existence is that it may
 * (often) in multi-file workflows be desireable to have a
 * centralized storage for the various `IResource` objects.
 * Likewise, it may be highly inopportune to store
 * (and have to keep track of) several global variables
 * of connections. Instead, one can maintain a single
 * container that interacts organically with the
 * `IResource` interface.
 */
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
