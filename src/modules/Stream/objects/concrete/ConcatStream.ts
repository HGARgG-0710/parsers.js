import type { IStream } from "../../../../interfaces.js"
import { ArrayStream } from "../templates.js"

import { array } from "@hgargg-0710/one"
const { lastIndex } = array

class LazilyInitializedStream<StreamType extends IStream = IStream> {
	private readonly ready: LazilyInitializedStreamReady<StreamType>
	private state: ILazilyInitializedStreamState<StreamType>

	get() {
		const newStream = this.state.get()
		this.state = this.state.nextState()
		return newStream
	}

	get isReady(): boolean {
		return this.state === this.ready
	}

	constructor(streamMaker: () => StreamType) {
		this.ready = new LazilyInitializedStreamReady<StreamType>()
		this.state = new LazilyInitializedStreamNotReady<StreamType>(
			streamMaker,
			this.ready
		)
	}
}

interface ILazilyInitializedStreamState<StreamType extends IStream = IStream> {
	get(): StreamType
	nextState(): ILazilyInitializedStreamState<StreamType>
}

class LazilyInitializedStreamReady<StreamType extends IStream = IStream>
	implements ILazilyInitializedStreamState<StreamType>
{
	private stream: StreamType

	set(stream: StreamType) {
		this.stream = stream
	}

	get(): StreamType {
		return this.stream
	}

	nextState(): ILazilyInitializedStreamState<StreamType> {
		return this
	}

	constructor() {}
}

class LazilyInitializedStreamNotReady<StreamType extends IStream = IStream>
	implements ILazilyInitializedStreamState<StreamType>
{
	get() {
		const newStream = this.streamMaker()
		this.asReady.set(newStream)
		return newStream
	}

	nextState(): ILazilyInitializedStreamState<StreamType> {
		return this.asReady
	}

	constructor(
		private readonly streamMaker: () => StreamType,
		private readonly asReady: LazilyInitializedStreamReady<StreamType>
	) {}
}

/**
 * This is a class that extends `ArrayStream<any, IStream>`.
 * It contains elements of unknown type, which are obtained from
 * the `.items: IStream[]`. More specifically, the stream sequentially
 * concatenates outputs from each one of the given `IStream`s,
 * taking their precise combined time to finish.
 */
export class ConcatStream<
	T = any,
	StreamType extends IStream<T> = IStream<T>
> extends ArrayStream<T, LazilyInitializedStream<StreamType>> {
	private streamIndex: number = 0

	private currStream() {
		return this.rawStreamAt(0)
	}

	private noMoreStreamsLeft() {
		return lastIndex(this.items) === this.streamIndex
	}

	private currStreamDone() {
		return this.currStream().isEnd
	}

	private nextStream() {
		++this.streamIndex
	}

	private nextItem() {
		this.currStream().next()
	}

	private moveOneItemForward() {
		if (this.currStreamDone()) this.nextStream()
		else this.nextItem()
	}

	private currItem() {
		return this.currStream().curr
	}

	protected baseNextIter() {
		this.moveOneItemForward()
		return this.currItem()
	}

	protected rawStreamAt(i: number) {
		return this.items[this.streamIndex + i].get()
	}

	isCurrEnd(): boolean {
		return this.currStreamDone() && this.noMoreStreamsLeft()
	}

	constructor(...elements: (() => StreamType)[]) {
		super(
			...elements.map(
				(maker) => new LazilyInitializedStream<StreamType>(maker)
			)
		)
	}
}
