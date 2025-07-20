import { array, inplace } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { ownerInitializer } from "../../../classes/Initializer.js"
import { MissingArgument } from "../../../constants.js"
import type { IStateSettable } from "../../../interfaces.js"
import type { IParseState } from "../../../interfaces/DynamicParser.js"
import type {
	ICompositeStream,
	IOwnedStream,
	IRawStreamArray
} from "../../../interfaces/Stream.js"
import { StreamList, streamListPool } from "../../../internal/StreamList.js"
import { isStateful } from "../../../is/Stream.js"
import { mixin } from "../../../mixin.js"
import { rawStreamCopy } from "../../../utils/Stream.js"
import { StatefulStream } from "./StatefulStream.js"
import { IdentityStream } from "./IdentityStream.js"

const { mutate } = inplace

type ICompositeStreamConstructor<T = any> = new (
	lowStream?: IOwnedStream,
	rawStreams?: IRawStreamArray,
	state?: IParseState
) => ICompositeStream<T>

interface ICompositeStreamLike extends IStateSettable {
	setRawStreams(rawStreams: IRawStreamArray): void
	isEvaluationReady(): boolean
	evaluateStreams(): void
}

const compositeStreamInitializer = {
	init(
		target: ICompositeStreamLike,
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray,
		state?: IParseState
	) {
		ownerInitializer.init(target, lowStream)
		if (rawStreams) target.setRawStreams(rawStreams)
		if (state) target.setState(state)
		if (target.isEvaluationReady()) target.evaluateStreams()
	}
}

function BuildBeforeCompositeStream<T = any>() {
	abstract class BeforeCompositeStream
		extends IdentityStream.generic!<T, [IRawStreamArray, IParseState]>()
		implements ICompositeStream<T>
	{
		protected ["constructor"]: new (
			lowStream?: IOwnedStream,
			rawStreams?: IRawStreamArray,
			state?: IParseState
		) => this

		protected rawStreams?: IRawStreamArray
		private streamList?: StreamList
		private lowStream?: IOwnedStream

		abstract state: IParseState
		abstract setState(state: Summat): void

		private renewIfPossible() {
			return this.streamList!.reevaluate(this.lowStream!)
		}

		private fixRenewed() {
			this.updateResource()
			return true
		}

		private nonRenewable() {
			return false
		}

		private updateResource() {
			this.resource = this.streamList!.firstItemDeep()
		}

		protected get initializer() {
			return compositeStreamInitializer
		}

		get streams() {
			return this.streamList!.items
		}

		setResource(lowStream: IOwnedStream) {
			this.lowStream = lowStream
		}

		setRawStreams(rawStreams: IRawStreamArray) {
			this.rawStreams = rawStreams
			this.streamList = streamListPool.create(
				MissingArgument,
				rawStreams,
				this
			)
			return this
		}

		isEvaluationReady() {
			return !!this.streamList && !!this.lowStream
		}

		evaluateStreams() {
			this.streamList!.evaluate(this.lowStream!)
			this.updateResource()
		}

		renewResource() {
			return this.renewIfPossible()
				? this.fixRenewed()
				: this.nonRenewable()
		}

		init(
			lowStream?: IOwnedStream,
			rawStreams?: IRawStreamArray,
			state?: IParseState
		) {
			super.init(lowStream, rawStreams, state)
			return this
		}

		isCurrEnd(): boolean {
			return (
				this.resource!.isCurrEnd() ||
				(this.resource!.isEnd && !this.renewResource())
			)
		}

		// ! [pre-doc]: WARNING - this thing, unlike other IStream-implementing classes' '.copy()' methods, DOESN'T "copy dynamically" [with preservation of parsing properties]
		// * Reasons:
		// 		1. [minor turnoff] that would require [somewhat] complex recursion [the 'StateDistributor', previously - a poorly written closure that ought to have been a class instead]
		//		2. [justification] it's a rare feature [the user is highly unlikely to ever want to use that at all in any "normal" parsing scenario]
		// 		3. [deal-breaker] would require altering the `.constuctor` signature:
		// 			* 1. the format REQUIRED to perform the "post-initialization" '.setState' calls DEMANDS that we INITIALIZE the thing first
		// 			* 2. problem is - we MAY require the state IN ORDER to initialize them; This becomes INCREASINGLY tangled
		copy() {
			return new this.constructor(
				this.lowStream?.copy(),
				this.rawStreams
					? mutate(array.copy(this.rawStreams), rawStreamCopy)
					: MissingArgument,
				this.state
			)
		}

		constructor(
			lowStream?: IOwnedStream,
			rawStreams?: IRawStreamArray,
			state?: IParseState
		) {
			super()
			this.init(lowStream, rawStreams, state)
		}
	}

	return BeforeCompositeStream
}

function BuildCompositeStream<T = any>() {
	return new mixin<
		ICompositeStream<T>,
		[
			lowStream?: IOwnedStream,
			rawStreams?: IRawStreamArray,
			state?: IParseState
		]
	>(
		{
			name: "CompositeStream",
			properties: {
				distributeState() {
					for (const x of this.rawStreams!)
						if (isStateful(x)) x.setState(this.state)
				},

				get initializer() {
					return compositeStreamInitializer
				},

				setState(state: IParseState) {
					this.super.StatefulStream.setState(state)
					this.distributeState()
				}
			},
			constructor(
				lowStream?: IOwnedStream,
				rawStreams?: IRawStreamArray,
				state?: IParseState
			) {
				this.super.BeforeCompositeStream.constructor.call(
					this,
					lowStream,
					rawStreams,
					state
				)
			}
		},
		[],
		[BuildBeforeCompositeStream<T>(), StatefulStream]
	).toClass() as ICompositeStreamConstructor<T>
}

let compositeStream: ICompositeStreamConstructor | null = null

function PreCompositeStream<T = any>(): ICompositeStreamConstructor<T> {
	return compositeStream
		? compositeStream
		: (compositeStream = BuildCompositeStream<T>())
}

/**
 * This is a factory for creation of `ICompositeStream<T>` implementations
 * using the given `IRawStreamArray` input to define their composition
 * [which is being attached element-by-element via `.init()`
 * from the *last* index towards 0].
 *
 * After initialization, it will call the topmost of its streams on each `.next()`
 * call, and (after every step) verify it being non-over. In the event that
 * it is, however, a "re-evaluation procedure" will be used. This procedure
 * walks (backwards) through the structure of the `CompositeStream`,
 * re-initializing the necessary `ILinkedStream`s, and re-running the
 * "obsolete" `IStreamChooser`-s. If an obsolete non-`IStreamChooser`
 * element is met before any `IStreamChooser`, the `CompositeStream`
 * is considered over, since, there is no more work to be accomplished
 * in lower streams. Thus, the stream successfully returns the
 * composition of the user-provided 'stream's.
 *
 * It can also store state (as can all `ICompositeStream`s),
 * which can be set at the beginning via `.setState`, and then
 * used inside of `IStreamChooser`s via `this.state` [with `this` being
 * the current owning `ICompositeStream`], and other "static" 'IControlStream's
 * also sharing the `.state` of their parent `ICompositeStream`.
 */
export function CompositeStream<T = any>(...streams: IRawStreamArray) {
	const compositeStream = PreCompositeStream<T>()
	return function (
		resource?: IOwnedStream,
		state?: IParseState
	): ICompositeStream<T> {
		return new compositeStream(resource, streams, state)
	}
}
