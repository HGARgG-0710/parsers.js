import type { IParseState, IStateHaving } from "../../../../interfaces.ts"
import type { ProxyStream } from "../templates.ts"

export declare abstract class StatefulProxyStream<T = any>
	extends ProxyStream<T>
	implements IStateHaving<IParseState>
{
	setState(state: IParseState): void
	get state(): IParseState
}
