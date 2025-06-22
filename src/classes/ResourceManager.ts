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
export class ResourceManager<
	T extends IResource = any,
	Args extends any[] = any[]
> {
	private readonly resources = new Map<Args[0], T>()

	get(...args: [Args[0]] | Args) {
		const key: Args[0] = args[0]
		if (!this.resources.has(key))
			this.resources.set(
				key,
				new this.resourceConstructor(...(args as Args))
			)
		return this.resources.get(key)!
	}

	cleanup(key: Args[0]) {
		const resource = this.resources.get(key)
		if (resource) {
			resource.cleanup()
			this.resources.delete(key)
		}
	}

	cleanupAll() {
		for (const x of this.resources.keys()) this.cleanup(x)
	}

	constructor(
		private readonly resourceConstructor: new (...args: Args) => T
	) {}
}
