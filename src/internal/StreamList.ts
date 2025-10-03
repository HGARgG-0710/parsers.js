import { type } from "@hgargg-0710/one"
import { ObjectPool } from "../objects.js"
import type {
	IInitializer,
	ILinkedStream,
	IOwnedStream
} from "../interfaces.js"
import type {
	ICompositeStream,
	IRawStreamArray,
	IStreamChooser
} from "../modules/Stream/interfaces/CompositeStream.js"
import {
	DeepList,
	deepListInitializer,
	itemsInitializer,
	RecursiveList,
	renewerInitializer
} from "./RecursiveList.js"
import { Pools } from "../../main.js"

const { isFunction } = type

type StreamDeepList = DeepList<ILinkedStream, IStreamChooser>

const streamListInitializer: IInitializer<
	[RecursiveList.Renewer, any[], StreamDeepList]
> = {
	init(
		target: StreamList,
		renewer?: RecursiveList.Renewer,
		items?: any[],
		deepList?: StreamDeepList
	) {
		deepListInitializer.init(target, deepList)
		renewerInitializer.init(target, renewer)
		itemsInitializer.init(target, items)
	}
}

/**
 * This is the `PoolableRecursiveList` actually employed
 * by the `CompositeStream` implementation. It uses the
 * `globalStreamRenewer` as the default renewer (which is
 * referenced across all the `StreamList`s)
 */
export class StreamList extends RecursiveList.Poolable<
	ILinkedStream,
	IStreamChooser,
	IOwnedStream
> {
	static readonly pool = Pools.Internal.add(new ObjectPool(StreamList))

	protected renewer: StreamList.StreamRenewer

	protected get initializer() {
		return streamListInitializer
	}

	protected reclaim(): void {
		StreamList.pool.free(this)
	}

	constructor(
		renewer?: StreamList.StreamRenewer,
		origItems?: IRawStreamArray,
		deepList?: StreamDeepList
	) {
		super(renewer, origItems, deepList)
	}
}

export namespace StreamList {
	/**
	 * This is a concrete child class of `RecursiveList.RootList`, 
	 * implemented to be compatible with `StreamList` and `StreamRenewer`, 
	 * employed for the specific usecase of `RecursiveList` involving 
	 * `IRawStream`s. 
	*/
	export class StreamRootList extends RecursiveList.RootList<
		ILinkedStream,
		IStreamChooser,
		IOwnedStream,
		[ICompositeStream]
	> {
		protected renewer: StreamRenewer

		createList(streams: IRawStreamArray) {
			return StreamList.pool.create(this.renewer, streams, this.asDeep)
		}

		protected getList(): RecursiveList<
			ILinkedStream,
			IStreamChooser,
			IOwnedStream,
			[ICompositeStream]
		> {
			return StreamList.pool.create()
		}

		protected getRenewer(): RecursiveList.Renewer<
			ILinkedStream,
			IStreamChooser,
			IOwnedStream
		> {
			return new StreamRenewer(this)
		}

		constructor(
			streams: IRawStreamArray,
			public readonly topStream: ICompositeStream
		) {
			super(streams, topStream)
		}
	}

	/**
	 * This is the `Renewer` employed by the library's `CompositeStream`
	 * implementation. It is the sole definition that makes the `StreamList`
	 * operate the way it actually does.
	 */
	export class StreamRenewer extends RecursiveList.Renewer<
		ILinkedStream,
		IStreamChooser,
		IOwnedStream
	> {
		private topStream: ICompositeStream

		private fromStreams(streams: IRawStreamArray) {
			return this.parent.createList(streams)
		}

		evaluate(currRec: IStreamChooser, last: IOwnedStream) {
			return this.fromStreams(
				currRec.call(this.topStream, last) as IRawStreamArray
			)
		}

		isOld(terminal: ILinkedStream): boolean {
			return terminal.isEnd
		}

		init(topStream?: ICompositeStream) {
			if (topStream) this.topStream = topStream
			return this
		}

		isRecursive(x: any): x is IStreamChooser {
			return isFunction(x)
		}

		nextItem(after: ILinkedStream): ILinkedStream {
			return after.resource! as ILinkedStream
		}

		prevItem(to: ILinkedStream): ILinkedStream {
			return to.owner! as ILinkedStream
		}

		constructor(private readonly parent: StreamList.StreamRootList) {
			super()
		}
	}
}
