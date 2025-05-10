import { array } from "@hgargg-0710/one"
import { MissingArgument } from "../../constants.js"
import { StreamList } from "../../internal/StreamList.js"
import type {
	IComposedStream,
	IOwnedStream,
	IStreamArray
} from "../interfaces.js"
import { ownerInitializer } from "../StreamInitializer/classes.js"
import { WrapperStream } from "./WrapperStream.js"

// * Design:
// 2. the class ITSELF:
// 		2. keeps private variables:
// 					4. MODIFICATION [big one]:
// ! 					0. ADD LATER; [First prototype - without it...];
// 						1. For self-modification purposes (usable with DynamicParser, WHICH refernces + exposes the public interface for the thing)
// 3. On `.state` keeping:
// 		1. This is part of the `DynamicParser`; Use util: 'attachState = (x: IStateful, state: Summat) => (x.state = state)'

class _ComposedStream<Type = any> extends WrapperStream<Type> {
	["constructor"]: new (
		lowStream?: IOwnedStream,
		rawStreams?: IStreamArray
	) => this

	protected get initializer() {
		return ownerInitializer
	}

	private _streams: StreamList
	private lowStream: IOwnedStream

	resource: IOwnedStream

	private set streams(newStreams: StreamList) {
		this._streams = newStreams
	}

	get streams() {
		return this._streams
	}

	private updateResource() {
		this.resource = this.streams.firstItemDeep()
	}

	private initStreams(rawStreams: IStreamArray) {
		this.streams = new StreamList(rawStreams)
		return this
	}

	private evaluateStreams() {
		this.streams.evaluate(this.lowStream)
		this.updateResource()
	}

	setResource(lowStream: IOwnedStream) {
		this.lowStream = lowStream
	}

	init(lowStream?: IOwnedStream, rawStreams?: IStreamArray) {
		if (lowStream) this.initializer.init(this, lowStream)
		if (rawStreams) this.initStreams(rawStreams)
		if (this.streams && this.lowStream) this.evaluateStreams()
		return this
	}

	isCurrEnd(): boolean {
		const anyMoreItems = this.streams.reEvaluate(this.lowStream)
		if (anyMoreItems) this.updateResource()
		return !anyMoreItems
	}

	copy() {
		return new this.constructor(
			this.lowStream.copy(),
			this.rawStreams ? array.copy(this.rawStreams) : MissingArgument
		)
	}

	constructor(
		lowStream?: IOwnedStream,
		private readonly rawStreams?: IStreamArray
	) {
		super()
		this.init(lowStream, rawStreams)
	}
}

export function ComposedStream<Type = any>(...streams: IStreamArray) {
	return function (resource?: IOwnedStream): IComposedStream<Type> {
		return new _ComposedStream<Type>(resource, streams)
	}
}
