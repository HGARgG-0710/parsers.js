import { Pools } from "../../../../../main.js"
import type { IPoolKeeping } from "../../../../interfaces.js"
import type {
	ICommandStream,
	ICommonStream,
	IControlStream,
	ILinkedStream,
	IOwnedStream
} from "../../../../interfaces/Stream.js"
import { mixin } from "../../../../mixin.js"
import { ObjectPool, Poolable, Stateful } from "../../../../objects.js"
import type { IHandler } from "../../interfaces/HandlerStream.js"
import { BasicResourceStream } from "../templates.js"

function BuildBeforeHandlerStream<In = any, Out = any>(
	handler: IHandler<In, Out>
) {
	abstract class BeforeHandlerStream extends BasicResourceStream<Out> {
		protected ["constructor"]: new (resource?: IOwnedStream<In>) => this

		private handler: IHandler<In, Out>

		private handleCurr() {
			return this.handler(this.resource!)
		}

		protected baseNextIter(): Out {
			let lastReceived: Out | undefined
			do lastReceived = this.handleCurr()
			while (lastReceived === HandlerStream.SkippedItem)
			return lastReceived
		}

		protected initGetter() {
			return this.baseNextIter()
		}

		protected postInit() {
			if (this.resource) super.postInit()
		}

		isCurrEnd() {
			return this.resource!.isCurrEnd()
		}

		constructor(resource?: IOwnedStream<In>) {
			super()
			this.handler = handler
			this.init(resource)
		}
	}

	return BeforeHandlerStream
}

function BuildHandlerStream<In = any, Out = any>(handler: IHandler<In, Out>) {
	return new mixin(
		{
			name: "HandlerStream",
			static: {
				pool: (classObj) =>
					Pools.Stream.add(
						new ObjectPool(
							classObj as new (
								resource?: IOwnedStream<In>
							) => ILinkedStream<Out>
						)
					)
			},
			properties: {
				get pool() {
					return this.constructor.pool
				}
			},
			constructor(...args: any[]) {
				this.super.BeforeHandlerStream.constructor.call(this, ...args)
			}
		},
		[BuildBeforeHandlerStream(handler), Stateful, Poolable]
	).toClass() as unknown as IPoolKeeping<
		IControlStream<Out> & ICommonStream<Out>
	>
}

/**
 * This is a function for creation of factories of objects implementing `IControlStream<Out>`.
 * It extends `BasicResourceStream`.
 *
 * It uses the `handler` to define its output by means of calling it on the
 * underlying `.resource: IOwnedStream<In>`, like `this.handler(this.resource)`.
 * Whenever the return value is equal to `Handler.SkippedItem`, one skips the
 * call, and proceeds to the next one. The underlying `handler` is intended
 * to change the state of the `.resource` and/or `this.state`.
 */
export function HandlerStream<In = any, Out = any>(
	handler: (stream: IOwnedStream<In>) => Out
) {
	const handlerStream = BuildHandlerStream(handler)

	function H(resource?: IOwnedStream<In>): ICommandStream<Out> {
		return handlerStream.pool.create(resource)
	}

	H.pool = handlerStream.pool

	return H
}

export namespace HandlerStream {
	/**
	 * The value to be returned from the `.handler` on
	 * `HandlerStream`, if the current item of the underlying
	 * `.value`-`Stream` is to be skipped
	 *
	 * When encountered during the `.next()` call, `HandlerStream`
	 * will continue calling `.handler` until the return value of
	 * it differs from `SkippedItem`.
	 */
	export const SkippedItem = undefined
}
