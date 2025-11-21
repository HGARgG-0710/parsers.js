import type { INodeTypeFactory } from "../../interfaces.js"
import { AutoCache } from "../../objects.js"
import { BasicHash } from "../../objects/HashMap.js"
import { BasicMap } from "../../samples/TerminalMap.js"

/**
 * This is a function for wrapping an `INodeTypeFactory<T, Args>`
 * into an `Autocache` using `new BasicHash(samples.TerminalMap.BasicMap())`.
 * It allows the user to ensure that is a relatively "nice"/simple
 * `T` (number, string, etc) is used, then it will be possible
 * to recover existing `INodeType`s instead of completely
 * re-creating them. The user thus should NOT employ `instanceof`
 * as an alternative to `.is` IF `NodeFactory` [or an equivalent
 * class-caching technique] is utilized.
 */

export function NodeFactory<
	Args extends any[] = any[],
	K extends INodeTypeFactory<Args> = INodeTypeFactory<Args>
>(preFactory: K): K {
	return AutoCache(new BasicHash(BasicMap()), preFactory) as K
}
