import { array } from "@hgargg-0710/one"
import { StreamList } from "../../internal/StreamList.js"
import type { IOwnedStream, IStreamArray } from "../interfaces.js"
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
	["constructor"]: new (lowStream?: IOwnedStream) => this

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
		this.resource = this.streams.firstNonRecursive()
	}

	private evaluateStreams() {
		this.streams.evaluate(this.lowStream)
		this.updateResource()
	}

	isCurrEnd(): boolean {
		const anyMoreItems = this.streams.reEvaluate(this.lowStream)
		if (anyMoreItems) this.updateResource()
		return !anyMoreItems
	}

	init(lowStream: IOwnedStream) {
		this.lowStream = lowStream
		lowStream.claimBy(this)
		if (this.streams) this.evaluateStreams()
		return this
	}

	initStreams(rawStreams: IStreamArray) {
		this.streams = new StreamList(rawStreams)
		if (this.lowStream) this.evaluateStreams()
		return this
	}

	copy() {
		const copied = new this.constructor(this.lowStream)
		return this.rawStreams
			? copied.initStreams(array.copy(this.rawStreams))
			: copied
	}

	constructor(
		lowStream?: IOwnedStream,
		private readonly rawStreams?: IStreamArray
	) {
		super()
		if (lowStream) this.init(lowStream)
	}
}

export function ComposedStream<Type = any>(...streams: IOwnedStream[]) {
	return function (resource?: IOwnedStream): IOwnedStream<Type> {
		return new _ComposedStream<Type>(resource).initStreams(streams)
	}
}
