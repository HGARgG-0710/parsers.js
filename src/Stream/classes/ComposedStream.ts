import { array } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { MissingArgument } from "../../constants.js"
import type {
	IComposedStream,
	IOwnedStream,
	IRawStreamArray
} from "../../interfaces/Stream.js"
import { StreamList } from "../../internal/StreamList.js"
import { ownerInitializer } from "./StreamInitializer.js"
import { WrapperStream } from "./WrapperStream.js"

// ! Design:
// 3. On `.state` keeping:
// 		1. This is part of the `DynamicParser`; Use util: 'attachState = (x: IStateful, state: Summat) => (x.state = state)'

class _ComposedStream<Type = any> extends WrapperStream<Type> {
	["constructor"]: new (
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray
	) => this

	protected get initializer() {
		return ownerInitializer
	}

	private streamList: StreamList
	private lowStream: IOwnedStream

	get streams() {
		return this.streamList.items
	}

	resource: IOwnedStream
	state: Summat

	private updateResource() {
		this.resource = this.streamList.firstItemDeep()
	}

	private initStreams(rawStreams: IRawStreamArray) {
		this.streamList = new StreamList(rawStreams, this)
		return this
	}

	private evaluateStreams() {
		this.streamList.evaluate(this.lowStream)
		this.updateResource()
	}

	setResource(lowStream: IOwnedStream) {
		this.lowStream = lowStream
	}

	init(lowStream?: IOwnedStream, rawStreams?: IRawStreamArray) {
		if (lowStream) this.initializer.init(this, lowStream)
		if (rawStreams) this.initStreams(rawStreams)
		if (this.streamList && this.lowStream) this.evaluateStreams()
		return this
	}

	isCurrEnd(): boolean {
		const anyMoreItems = this.streamList.reEvaluate(this.lowStream)
		if (anyMoreItems) this.updateResource()
		return !anyMoreItems
	}

	copy() {
		return new this.constructor(
			this.lowStream.copy(),
			this.rawStreams ? array.copy(this.rawStreams) : MissingArgument
		)
	}

	setState(state: Summat) {
		this.state = state
	}

	constructor(
		lowStream?: IOwnedStream,
		private readonly rawStreams?: IRawStreamArray
	) {
		super()
		this.init(lowStream, rawStreams)
	}
}

export function ComposedStream<Type = any>(...streams: IRawStreamArray) {
	return function (resource?: IOwnedStream): IComposedStream<Type> {
		return new _ComposedStream<Type>(resource, streams)
	}
}
