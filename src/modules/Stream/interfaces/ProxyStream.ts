import type {
	ICommonStream,
	IDepthMark,
	IDepthMarked,
	IParseState,
	IStateful,
	IStateHaving,
	IStateSettable
} from "../../../interfaces.js"
import type { ILinkedStream, IOwnedStream } from "./OwnedStream.js"

export type IProxyStream<T = any> = ICommonStream<T> &
	IStateSettable<IParseState> &
	ISubProxyStream<T>

export interface ISubProxyStream<T = any>
	extends ILinkedStream<T>,
		Partial<IStateful<IParseState>>,
		Partial<IDepthMarked> {}

export type IRecursiveProxyStream<T = any> = IProxyStream<T> &
	IStateHaving<IParseState> &
	IDepthMarked & {
		isSameGlobalDepth(mark: IDepthMark): boolean
		localDepthFor(mark: IDepthMark): number
	}

export type IRecursiveProxyStreamFactory<T = any> = new (
	delegate: ISubProxyStream<T>
) => IRecursiveProxyStream<T>

export type IRecursiveProxyStreamInstantiator<T = any> = (
	resource?: IOwnedStream<T>
) => IRecursiveProxyStream<T>
