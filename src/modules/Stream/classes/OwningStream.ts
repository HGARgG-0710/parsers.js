import { Initializable } from "../../../classes/Initializer.js"
import type { IResourcefulStream } from "../../../interfaces.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"

export abstract class OwningStream<T = any, Args extends any[] = []>
	extends Initializable<[IOwnedStream, ...(Args | [])]>
	implements IResourcefulStream<T>
{
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

	abstract isEnd: boolean
	abstract isStart: boolean
	abstract curr: T

	abstract isCurrEnd(): boolean

	abstract next(): void

	abstract copy(): this

	abstract [Symbol.iterator](): Generator<T>

	constructor(resource?: IOwnedStream, ...args: [] | Partial<Args>) {
		super(resource, ...args)
	}
}
