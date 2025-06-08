import { Initializable } from "../../../classes/Initializer.js"
import type { IInitializer } from "../../../interfaces.js"
import { StreamAnnotation } from "../../../internal/StreamAnnotation.js"
import { mixin } from "../../../mixin.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.js"

export abstract class OwningStreamAnnotation<T = any, Args extends any[] = []>
	extends StreamAnnotation<T, [IOwnedStream, ...(Args | [])]>
	implements IOwningStream<T>
{
	protected get initializer() {
		return null as unknown as IInitializer<[IOwnedStream, ...(Args | [])]>
	}

	protected set resource(resource: IOwnedStream | undefined) {}

	get resource() {
		return null as any
	}

	setResource(resource?: IOwnedStream): void {}
}

const OwningStreamMixin = new mixin<IOwningStream>(
	{
		name: "OwningStream",
		properties: {
			_resource: null,

			set resource(newResource: IOwnedStream | undefined) {
				this._resource = newResource
			},

			get resource() {
				return this._resource
			},

			setResource(newResource: IOwnedStream) {
				this.resource = newResource
			},

			get initializer() {
				return ownerInitializer
			}
		}
	},
	[],
	[Initializable]
)

function PreOwningStream<T = any, Args extends any[] = any[]>() {
	return OwningStreamMixin.toClass() as typeof OwningStreamAnnotation<T, Args>
}

export const OwningStream: ReturnType<typeof PreOwningStream> & {
	generic?: typeof PreOwningStream
} = PreOwningStream()

OwningStream.generic = PreOwningStream
