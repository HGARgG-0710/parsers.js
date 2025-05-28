import type { IResource } from "../interfaces.js"

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
