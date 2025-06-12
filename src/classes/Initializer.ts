import type { IInitializable, IInitializer } from "../interfaces.js"

/**
 * This is an abstract class, children of which can be made 
 * poolable via `ObjectPool`. This is achieved by providing 
 * the `.init(...x: Partial<Args> | [])`, which calls the 
 * value of the `protected abstract readonly` property 
 * `.initializer: IInitializer<Args>`, which is to be provided 
 * by the children-classes.
*/
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
