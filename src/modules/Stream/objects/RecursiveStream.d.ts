import type {
	IDepthMark,
	IRecursiveProxyStreamFactory,
	IRecursiveProxyStreamInstantiator
} from "../../../interfaces.ts"
import type { LimitStream } from "./LimitStream.ts"

export declare function RecursiveProxyStream<T = any>(
	depthMarks: readonly IDepthMark[]
): IRecursiveProxyStreamFactory<T>

export declare class LimitDepthMarks {
	readonly mainMark: IDepthMark
	readonly restMarks: IDepthMark[]
	get(): IDepthMark[]
	constructor(mainMark: IDepthMark, restMarks: IDepthMark[])
}

export declare function RecursiveLimitStream<T = any>(
	depthMarks: LimitDepthMarks,
	limits: LimitStream.Limits<T>
): IRecursiveProxyStreamInstantiator<T>
