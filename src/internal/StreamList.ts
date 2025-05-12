import { type } from "@hgargg-0710/one"
import type { ILinkedStream, IOwnedStream } from "../interfaces.js"
import type {
	IComposedStream,
	IRawStreamArray,
	IStreamChoice,
	IStreamChooser
} from "../Stream/interfaces/ComposedStream.js"
import { RecursiveInitList } from "./RecursiveInitList.js"
import { ObjectPool } from "../classes.js"

const { isFunction, isArray } = type

export class StreamList extends RecursiveInitList<
	ILinkedStream,
	IStreamChooser,
	IOwnedStream
> {
	private topStream: IComposedStream

	private fromStreams(streams: IRawStreamArray) {
		return streamListPool.create(streams, this.topStream)
	}

	private fromChoice(choice: IStreamChoice) {
		return isArray(choice) ? this.fromStreams(choice) : choice
	}

	protected isOld(terminal: ILinkedStream): boolean {
		return terminal.isEnd
	}

	protected evaluator(currRec: IStreamChooser, last: IOwnedStream) {
		return this.fromChoice(
			currRec.call(this.topStream, last) as IStreamChoice
		)
	}

	protected reclaim(): void {
		streamListPool.free(this)
	}

	isRecursive(x: any): x is IStreamChooser {
		return isFunction(x)
	}

	init(
		origItems: (ILinkedStream | IStreamChooser)[],
		topStream?: IComposedStream
	): this {
		if (topStream) this.topStream = topStream
		return super.init(origItems)
	}

	constructor(origItems: IRawStreamArray, topStream: IComposedStream) {
		super()
		this.init(origItems, topStream)
	}
}

const streamListPool = new ObjectPool(StreamList)
