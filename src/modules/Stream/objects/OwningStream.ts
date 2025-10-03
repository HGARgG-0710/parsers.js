import { Initializable } from "../../../objects/Initializer.js"
import type { IResourcefulStream } from "../../../interfaces.js"
import { ownerInitializer } from "../../Initializer/objects/OwnerInitializer.js"
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
	extends Initializable<[IOwnedStream, ...Args]>
	implements IResourcefulStream<T>
{
	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract isCurrEnd(): boolean
	abstract next(): void

	private _resource?: IOwnedStream

	protected set resource(resource: IOwnedStream | undefined) {
		this._resource = resource
	}

	protected get initializer() {
		return ownerInitializer
	}

	get resource() {
		return this._resource
	}

	setResource(resource: IOwnedStream) {
		this.resource = resource
	}

	constructor(resource?: IOwnedStream, ...args: [] | Partial<Args>) {
		super(resource, ...args)
	}
}
