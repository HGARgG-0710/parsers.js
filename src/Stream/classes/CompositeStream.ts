import { inplace } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { ownerInitializer } from "../../classes/Initializer.js"
import type { IParseState } from "../../interfaces/DynamicParser.js"
import type {
	ICompositeStream,
	ILinkedStream,
	IOwnedStream,
	IRawStreamArray,
	IStreamChooser
} from "../../interfaces/Stream.js"
import {
	isRecursiveInitList,
	isSwitch,
	type IDerivable,
	type IRecursivelySwitchable
} from "../../internal/RecursiveInitList.js"
import { StreamList, streamListPool } from "../../internal/StreamList.js"
import { isStateful } from "../../utils.js"
import { rawStreamCopy } from "../../utils/Stream.js"
import { WrapperStream } from "./WrapperStream.js"

const { mutate } = inplace

function recursiveStateSetter(state: Summat) {
	function setStateDerivable(
		maybeList: IDerivable<ILinkedStream, IStreamChooser>
	) {
		if (isRecursiveInitList(maybeList))
			for (const maybeSwitch of maybeList) setStateSwitchable(maybeSwitch)
		else setStateSwitchable(maybeList)
	}

	function setStateSwitchable(
		maybeSwitch: IRecursivelySwitchable<ILinkedStream, IStreamChooser>
	) {
		if (isSwitch(maybeSwitch))
			return setStateDerivable(maybeSwitch.derivable)
		if (isStateful(maybeSwitch)) maybeSwitch.setState(state)
	}

	return setStateSwitchable
}

class _CompositeStream<Type = any> extends WrapperStream<Type> {
	protected ["constructor"]: new (
		lowStream?: IOwnedStream,
		rawStreams?: IRawStreamArray
	) => this

	protected get initializer() {
		return ownerInitializer
	}

	private streamList: StreamList
	private lowStream: IOwnedStream

	private get rawStreams() {
		return this.streams.raw()
	}

	get streams() {
		return this.streamList.items
	}

	resource: IOwnedStream
	state: Summat

	private renewIfPossible() {
		return this.streamList.reEvaluate(this.lowStream)
	}

	private fixRenewed() {
		this.updateResource()
		return true
	}

	private nonRenewable() {
		return false
	}

	private updateResource() {
		this.resource = this.streamList.firstItemDeep()
	}

	private initStreams(rawStreams: IRawStreamArray) {
		this.streamList = streamListPool.create(rawStreams, this)
		return this
	}

	private evaluateStreams() {
		this.streamList.evaluate(this.lowStream)
		this.updateResource()
	}

	private distribute(state: IParseState) {
		const setStateSwitchable = recursiveStateSetter(state)
		for (const x of this.streams) setStateSwitchable(x)
	}

	renewResource() {
		return this.renewIfPossible() ? this.fixRenewed() : this.nonRenewable()
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
		return (
			this.resource.isCurrEnd() ||
			(this.resource.isEnd && !this.renewResource())
		)
	}

	copy() {
		return new this.constructor(
			this.lowStream.copy(),
			mutate(this.rawStreams, rawStreamCopy)
		)
	}

	setState(state: IParseState) {
		this.distribute(state)
		this.state = state
	}

	constructor(lowStream?: IOwnedStream, rawStreams?: IRawStreamArray) {
		super()
		this.init(lowStream, rawStreams)
	}
}

export function CompositeStream<Type = any>(...streams: IRawStreamArray) {
	return function (resource?: IOwnedStream): ICompositeStream<Type> {
		return new _CompositeStream<Type>(resource, streams)
	}
}
