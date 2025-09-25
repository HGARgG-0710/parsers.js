import { array, inplace } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { ownerInitializer } from "../../../../classes/Initializer.js"
import { MissingArgument } from "../../../../constants.js"
import type { IStateSettable } from "../../../../interfaces.js"
import type { IParseState } from "../../../../interfaces/DynamicParser.js"
import type {
	ICompositeStream,
	ILinkedStream,
	IOwnedStream,
	IRawStreamArray
} from "../../../../interfaces/Stream.js"
import { StreamList } from "../../../../internal/StreamList.js"
import { tryCopy } from "../../../../utils.js"
import { rawStreamCopy } from "../../../../utils/Stream.js"
import { IdentityStream } from "../IdentityStream.js"

const { mutate } = inplace

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

export abstract class BeforeCompositeStream<T = any>
	extends IdentityStream<T, [IRawStreamArray, IParseState]>
	implements ICompositeStream<T>
{
	protected ["constructor"]: new (
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray,
		state?: IParseState
	) => this

	protected rawStreams?: IRawStreamArray
	private streamList?: StreamList.StreamRootList
	private lowStream?: IOwnedStream

	abstract state: IParseState
	abstract setState(state: Summat): void

	private renewIfPossible() {
		return this.streamList!.renewAll(this.lowStream!)
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
		this.streamList = new StreamList.StreamRootList(rawStreams, this)
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
		return this.renewIfPossible() ? this.fixRenewed() : this.nonRenewable()
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

	free(): void {}

	renewStream(stream: ILinkedStream) {
		this.streamList!.renewItem(stream)
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
			tryCopy(this.lowStream),
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
