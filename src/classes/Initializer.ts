import type { IInitializable, IInitializer } from "../interfaces.js"

export abstract class Initializable<Args extends any[] = any[]>
	implements IInitializable<Args>
{
	protected abstract readonly initializer: IInitializer<Args>

	init(...x: Partial<Args> | []) {
		this.initializer.init(this, ...x)
		return this
	}

	constructor(...args: Partial<Args> | []) {
		this.init(...args)
	}
}

export * from "../modules/Initializer/classes/OwnerInitializer.js"
export * from "../modules/Initializer/classes/ResourceInitializer.js"
