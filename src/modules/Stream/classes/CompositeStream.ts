import { array, inplace } from "@hgargg-0710/one"
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
import { rawStreamCopy } from "../../../utils/Stream.js"
import { WrapperStream } from "./WrapperStream.js"

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

const compositeStreamInitializers = {
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

function BuildCompositeStream<T = any>() {
	return class extends WrapperStream.generic!<
		T,
		[IRawStreamArray, IParseState]
	>() {
		protected ["constructor"]: new (
			lowStream?: IOwnedStream,
			rawStreams?: IRawStreamArray,
			state?: IParseState
		) => this

		private rawStreams?: IRawStreamArray
		private streamList?: StreamList
		private lowStream?: IOwnedStream
		private _state: IParseState

		private set state(newState: IParseState) {
			this._state = newState
		}

		private renewIfPossible() {
			return this.streamList!.reEvaluate(this.lowStream!)
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

		private distributeState() {
			for (const x of this.rawStreams!)
				if (isStateful(x)) x.setState(this.state)
		}

		protected get initializer() {
			return compositeStreamInitializers
		}

		get streams() {
			return this.streamList!.items
		}

		get state() {
			return this._state
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

		setState(state: IParseState) {
			this.state = state
			this.distributeState()
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
}

let compositeStream: ICompositeStreamConstructor | null = null

function PreCompositeStream<T = any>(): ICompositeStreamConstructor<T> {
	return compositeStream
		? compositeStream
		: (compositeStream = BuildCompositeStream<T>())
}

export function CompositeStream<T = any>(...streams: IRawStreamArray) {
	const compositeStream = PreCompositeStream<T>()
	return function (
		resource?: IOwnedStream,
		state?: IParseState
	): ICompositeStream<T> {
		return new compositeStream(resource, streams, state)
	}
}
