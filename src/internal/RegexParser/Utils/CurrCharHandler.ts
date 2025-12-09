import type { IOwnedStream } from "../../../interfaces.js"
import { TableHandler } from "../../../objects.js"
import { CurrentHash } from "../../../objects/HashMap.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"

export function CurrCharHandler<Out = any>(
	charMap: Record<string, (input: IOwnedStream) => Out>,
	_default?: any
) {
	return TableHandler<IOwnedStream<string>, Out>(
		new CurrentHash(ObjectMap(charMap, _default))
	)
}
