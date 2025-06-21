import { Initializable } from "../../../classes/Initializer.js"
import type { IResourcefulStream } from "../../../interfaces.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"

/**
 * This is an abstract class implementing the `IResourcefulStream<T>`, and extending 
 * `Initializable<[IOwnedStream, ...(Args | [])]`. It allows being 
 * `.init(resource: IOwnedStream, ...args: Args)`-ialized by setting its 
 * `readonly .resource: IOwnedStream` property, which can also be modified directly 
 * by its descendant-classes. 
 * 
 * Besides `.initializer`, `.init`, `.setResource` and `.resource`, 
 * it provides no concrete methods/properties. 
*/
export abstract class OwningStream<T = any, Args extends any[] = []>
	extends Initializable<[IOwnedStream, ...(Args | [])]>
	implements IResourcefulStream<T>
{
	abstract readonly isEnd: boolean
	abstract readonly isStart: boolean
	abstract readonly curr: T

	private _resource?: IOwnedStream

	protected set resource(newResource: IOwnedStream | undefined) {
		this._resource = newResource
	}

	protected get initializer() {
		return ownerInitializer
	}

	get resource() {
		return this._resource
	}

	setResource(newResource: IOwnedStream) {
		this.resource = newResource
	}

	abstract isCurrEnd(): boolean

	abstract next(): void

	abstract copy(): this

	abstract [Symbol.iterator](): Generator<T>

	constructor(resource?: IOwnedStream, ...args: [] | Partial<Args>) {
		super(resource, ...args)
	}
}
