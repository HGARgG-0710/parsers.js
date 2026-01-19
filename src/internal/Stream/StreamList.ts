import { type } from "@hgargg-0710/one"
import { Pools } from "../../../main.js"
import type { ILinkedStream, IOwnedStream } from "../../interfaces.js"
import type {
	ICompositeStream,
	IRawStream,
	IRawStreamArray,
	IStatelessStreamChooser,
	IStreamChooser
} from "../../modules/Stream/interfaces/CompositeStream.js"
import { StatefulStreamChooser } from "../../modules/Stream/objects/Chooser.js"
import { ObjectPool } from "../../objects.js"
import { isStateful } from "../../utils/Stream.js"
import { RecursiveList, RecursiveListArgs } from "./RecursiveList.js"

const { isFunction } = type

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

	protected override renewer: StreamList.StreamRenewer

	protected reclaim(): void {
		StreamList.pool.free(this)
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
		protected override renewer: StreamRenewer

		createList(streams: IRawStreamArray) {
			return StreamList.pool.create(
				RecursiveListArgs.build()
					.setRenewer(this.renewer)
					.setItems(streams)
					.setDeepList(this.asDeep)
					.setDepthMap(this.globalDepth)
					.build()
			)
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
			readonly topStream: ICompositeStream
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

		private rawEvaluateStateless(
			chooser: IStatelessStreamChooser,
			last: IOwnedStream
		) {
			return chooser.call(this.topStream, last) as IRawStreamArray
		}

		private rawEvaluateStateful(
			chooser: StatefulStreamChooser,
			last: IOwnedStream
		) {
			return chooser.choose(last)
		}

		private isStatelessChooser(
			chooser: any
		): chooser is IStatelessStreamChooser {
			return isFunction(chooser)
		}

		private isStatefulChooser(chooser: any) {
			return chooser instanceof StatefulStreamChooser
		}

		private rawEvaluate(currRec: IStreamChooser, last: IOwnedStream) {
			return this.isStatelessChooser(currRec)
				? this.rawEvaluateStateless(currRec, last)
				: this.rawEvaluateStateful(currRec, last)
		}

		private distributeState(rawStreams: IRawStreamArray) {
			const globalState = this.topStream.state
			for (const x of rawStreams)
				if (isStateful(x)) x.setState(globalState)
		}

		evaluate(currRec: IStreamChooser, last: IOwnedStream) {
			const rawStreams = this.rawEvaluate(currRec, last)
			this.distributeState(rawStreams)
			return this.fromStreams(rawStreams)
		}

		isOld(terminal: ILinkedStream): boolean {
			return terminal.isEnd
		}

		init(topStream?: ICompositeStream) {
			if (topStream) this.topStream = topStream
			return this
		}

		isRecursive(x: IRawStream): x is IStreamChooser {
			return this.isStatefulChooser(x) || this.isStatelessChooser(x)
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
