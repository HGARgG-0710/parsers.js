import type { Summat } from "@hgargg-0710/summat.ts"
import type { IParseState } from "../../../interfaces.js"
import type {
	IControlStream,
	IOwnedStream
} from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import type { IHandler } from "../interfaces/HandlerStream.js"
import {
	BasicResourceStream,
	BasicResourceStreamAnnotation
} from "./BasicResourceStream.js"
import { StatefulStream } from "./StatefulStream.js"

class HandlerStreamAnnotation<
	In = any,
	Out = any
> extends BasicResourceStreamAnnotation<Out, []> {
	protected ["constructor"]: new (resource?: IOwnedStream<In>) => this

	readonly state: IParseState

	protected baseNextIter(): Out {
		return null as Out
	}

	protected initGetter() {
		return null as any
	}

	protected postInit() {}

	get resource(): IOwnedStream<In> {
		return null as any
	}

	isCurrEnd() {
		return false
	}

	setState(state: Summat) {}

	setHandler(handler: (stream: IOwnedStream<In>) => Out) {
		return this
	}
}

function BuildBeforeHandlerStream<In = any, Out = any>() {
	abstract class BeforeHandlerStream extends BasicResourceStream.generic!<Out>() {
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

		setHandler(handler: IHandler<In, Out>) {
			this.handler = handler
			return this
		}
	}

	return BeforeHandlerStream
}

function BuildHandlerStream<In = any, Out = any>() {
	return new mixin(
		{
			name: "HandlerStream",
			properties: {},
			constructor(...args: any[]) {
				this.super.BeforeHandlerStream.constructor.call(this, ...args)
			}
		},
		[],
		[BuildBeforeHandlerStream(), StatefulStream]
	).toClass() as unknown as typeof HandlerStreamAnnotation<In, Out>
}

const _HandlerStream = BuildHandlerStream()

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
	return function (
		resource?: IOwnedStream<In>
	): IControlStream<Out> & Iterable<Out> {
		return new _HandlerStream().setHandler(handler).init(resource)
	}
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
