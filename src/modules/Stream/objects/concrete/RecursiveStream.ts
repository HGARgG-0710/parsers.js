import type {
	IDepthMark,
	ILimitableStream,
	IOwnedStream,
	IRecursiveProxyStream,
	IRecursiveProxyStreamFactory,
	IRecursiveProxyStreamInstantiator
} from "../../../../interfaces.js"
import { StatefulProxyStream } from "../templates.js"
import { LimitStream } from "./LimitStream.js"

export function RecursiveProxyStream<T = any>(
	depthMarks: readonly IDepthMark[]
): IRecursiveProxyStreamFactory<T> {
	return class _RecursiveProxyStream
		extends StatefulProxyStream<T>
		implements IRecursiveProxyStream<T>
	{
		private depthMap: Map<IDepthMark, number>

		init(resource?: IOwnedStream) {
			this.depthMap = this.getCurrDepthMap()
			return super.init(resource)
		}

		get depthMarks() {
			return depthMarks
		}

		private getCurrDepthMap() {
			const map = new Map<IDepthMark, number>()
			for (const mark of this.depthMarks)
				map.set(mark, this.currGlobalDepthFor(mark))
			return map
		}

		private currGlobalDepthFor(mark: IDepthMark) {
			return this.state.parse.getDepth(mark)
		}

		localDepthFor(mark: IDepthMark): number {
			return this.depthMap.get(mark)!
		}

		isSameGlobalDepth(mark: IDepthMark) {
			return this.localDepthFor(mark) === this.currGlobalDepthFor(mark)
		}
	}
}

export class LimitDepthMarks {
	get(): IDepthMark[] {
		return [this.mainMark, ...this.restMarks]
	}

	constructor(
		readonly mainMark: IDepthMark,
		readonly restMarks: IDepthMark[] = []
	) {}
}

export function RecursiveLimitStream<T = any>(
	depthMarks: LimitDepthMarks,
	limits: LimitStream.Limits<T>
): IRecursiveProxyStreamInstantiator<T> {
	const { mainMark } = depthMarks

	const delegateStream = LimitStream(
		limits.wrapLongAs(
			(longAs) =>
				function (resource) {
					const proxyStream = this.owner
					return (
						!proxyStream.isSameGlobalDepthFor(mainMark) ||
						// * Explanation: one doesn't use `longAs.call(this, resource)`
						// because `longAs` is already bound to `this`
						longAs(resource)
					)
				}
		)
	)

	const recursiveProxyStream = RecursiveProxyStream(depthMarks.get())

	function R(resource: ILimitableStream<T>) {
		return new recursiveProxyStream(delegateStream(resource))
	}

	return R
}
