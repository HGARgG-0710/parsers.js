import type { ILinkedStream, IOwnedStream } from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import type { ISingletonHandler } from "../interfaces/SingletonStream.js"
import { OwningStream } from "./OwningStream.js"
import { TrivialStream, TrivialStreamAnnotation } from "./TrivialStream.js"

class SingletonStreamAnnotation<In = any, Out = any>
	extends TrivialStreamAnnotation<Out, [IOwnedStream]>
	implements ILinkedStream<Out>
{
	protected ["constructor"]: new (resource?: IOwnedStream<In>) => this

	protected get initializer() {
		return ownerInitializer
	}

	protected set resource(newResource: IOwnedStream<In> | undefined) {}

	get resource() {
		return null as any
	}

	setResource(resource: IOwnedStream) {}

	next(): void {}

	isCurrEnd(): boolean {
		return false
	}

	copy(): this {
		return this
	}

	setHandler(handler: ISingletonHandler<In, Out>): this {
		return this
	}

	init(resource?: IOwnedStream | undefined): this {
		return this
	}
}

const SingletonStreamMixin = new mixin<ILinkedStream>(
	{
		name: "SingletonStream",
		properties: {
			handler: null,

			setResource(resource: IOwnedStream) {
				!this.super.OwningStream.setResource.call(this, resource)
				this.curr = this.handler(resource)
			},

			copy() {
				return new this.constructor(this.resource?.copy())
			},

			setHandler(handler: ISingletonHandler) {
				this.handler = handler
				return this
			}
		},
		constructor: function (resource?: IOwnedStream) {
			this.super.OwningStream.constructor.call(this, resource)
		}
	},
	[],
	[TrivialStream, OwningStream]
)

function PreSingletonStream<T = any>() {
	return SingletonStreamMixin.toClass() as typeof SingletonStreamAnnotation<T>
}

const _SingletonStream = PreSingletonStream()

export function SingletonStream<In = any, Out = any>(
	handler: ISingletonHandler<In, Out>
) {
	return function (resource?: IOwnedStream<In>): ILinkedStream<Out> {
		return new _SingletonStream().setHandler(handler).init(resource)
	}
}
