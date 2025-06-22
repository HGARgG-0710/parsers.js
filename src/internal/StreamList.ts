import { type } from "@hgargg-0710/one"
import { ObjectPool } from "../classes.js"
import { MissingArgument } from "../constants.js"
import type {
	IInitializer,
	ILinkedStream,
	IOwnedStream
} from "../interfaces.js"
import type {
	ICompositeStream,
	IRawStreamArray,
	IStreamChoice,
	IStreamChooser
} from "../modules/Stream/interfaces/CompositeStream.js"
import {
	itemsInitializer,
	PoolableRecursiveList,
	RecursiveRenewer,
	renewerInitializer
} from "./RecursiveList.js"

const { isFunction, isArray } = type

/**
 * This is the `StreamRenewer` employed by the library's `CompositeStream` 
 * implementation. It is the sole definition that makes the `StreamList` 
 * operate the way it actually does. 
*/
class StreamRenewer extends RecursiveRenewer<ILinkedStream, IStreamChooser> {
	private topStream: ICompositeStream
	readonly evaluator = this.evaluate.bind(this)

	private fromStreams(streams: IRawStreamArray) {
		return streamListPool.create(MissingArgument, streams, this.topStream)
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

const topStreamInitializer: IInitializer<[ICompositeStream]> = {
	init(target: StreamList, topStream?: ICompositeStream) {
		if (topStream) target.setTopStream(topStream)
	}
}

const streamListInitializer: IInitializer<
	[RecursiveRenewer, any[], ICompositeStream]
> = {
	init(
		target: StreamList,
		renewer?: RecursiveRenewer,
		items?: any[],
		topStream?: ICompositeStream
	) {
		renewerInitializer.init(target, renewer)
		topStreamInitializer.init(target, topStream)
		itemsInitializer.init(target, items)
	}
}

const globalStreamRenewer = new StreamRenewer()

/**
 * This is the `PoolableRecursiveList` actually employed 
 * by the `CompositeStream` implementation. It uses the 
 * `globalStreamRenewer` as the default renewer (which is 
 * referenced across all the `StreamList`s)
*/
export class StreamList extends PoolableRecursiveList<
	ILinkedStream,
	IStreamChooser,
	IOwnedStream,
	[ICompositeStream]
> {
	protected renewer: StreamRenewer

	protected get initializer(): IInitializer<
		[RecursiveRenewer<any, any>, any[]]
	> {
		return streamListInitializer
	}

	protected reclaim(): void {
		streamListPool.free(this)
	}

	setTopStream(topStream: ICompositeStream) {
		this.renewer.init(topStream)
	}

	constructor(
		renewer: StreamRenewer = globalStreamRenewer,
		origItems?: IRawStreamArray,
		topStream?: ICompositeStream
	) {
		super()
		this.init(renewer, origItems, topStream)
	}
}

export const streamListPool = new ObjectPool(StreamList)
