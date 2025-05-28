import { type } from "@hgargg-0710/one"
import { ObjectPool } from "../classes.js"
import type { ILinkedStream, IOwnedStream } from "../interfaces.js"
import type {
	ICompositeStream,
	IRawStreamArray,
	IStreamChoice,
	IStreamChooser
} from "../modules/Stream/interfaces/CompositeStream.js"
import { RecursiveInitList, RecursiveRenewer } from "./RecursiveInitList.js"

const { isFunction, isArray } = type

class StreamRenewer extends RecursiveRenewer<ILinkedStream, IStreamChooser> {
	private topStream: ICompositeStream
	readonly evaluator = this.evaluate.bind(this)

	private fromStreams(streams: IRawStreamArray) {
		return streamListPool.create(streams, this.topStream)
	}

	private fromChoice(choice: IStreamChoice) {
		return isArray(choice) ? this.fromStreams(choice) : choice
	}

	private evaluate(currRec: IStreamChooser, last: IOwnedStream) {
		return this.fromChoice(
			currRec.call(this.topStream, last) as IStreamChoice
		)
	}

	isOld(terminal: ILinkedStream): boolean {
		return terminal.isEnd
	}

	init(topStream?: ICompositeStream) {
		if (topStream) this.topStream = topStream
	}

	isRecursive(x: any): x is IStreamChooser {
		return isFunction(x)
	}
}

export class StreamList extends RecursiveInitList<
	ILinkedStream,
	IStreamChooser,
	IOwnedStream
> {
	private readonly _renewer = new StreamRenewer()

	protected renewer() {
		return this._renewer
	}

	protected reclaim(): void {
		streamListPool.free(this)
	}

	init(origItems?: IRawStreamArray, topStream?: ICompositeStream): this {
		this.renewer().init(topStream)
		super.init(origItems)
		return this
	}

	constructor(origItems?: IRawStreamArray, topStream?: ICompositeStream) {
		super()
		this.init(origItems, topStream)
	}
}

export const streamListPool = new ObjectPool(StreamList)
