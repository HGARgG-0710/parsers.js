import type {
	IDepthMark,
	IDepthMarked,
	IParseState,
	IStateHaving,
	IStateSettable
} from "../../../interfaces.js"
import type { ILinkedStream, IOwnedStream } from "./OwnedStream.js"

export type IProxyStream<T = any> = ILinkedStream<T> &
	IStateSettable &
	Partial<IStateHaving<IParseState>> &
	Iterable<T> &
	Partial<IDepthMarked>

export type IRecursiveProxyStream<T = any> = IProxyStream<T> &
	IStateHaving<IParseState> &
	IDepthMarked & {
		readonly depth: number
		currGlobalDepthFor(mark: IDepthMark): number
		isSameGlobalDepth(mark: IDepthMark): boolean
	}

export type IRecursiveProxyStreamFactory<T = any> = new (
	delegate: ILinkedStream<T>
) => IRecursiveProxyStream<T>

export type IRecursiveProxyStreamInstantiator<T = any> = (
	resource?: IOwnedStream<T>
) => IRecursiveProxyStream<T>
