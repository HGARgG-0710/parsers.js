import {
	type INode,
	type IRegexCompilerFunction,
	type ITyped
} from "../../../interfaces.js"
import { Regex, TableHandler } from "../../../objects.js"
import { CurrentHash, TokenHash } from "../../../objects/HashMap.js"
import type { TreeStream } from "../../../objects/Stream.js"
import { BasicMap } from "../../../samples/TerminalMap.js"
import { mapTypes } from "../../../utils/Node.js"
import type { IRegexCompilerErrorHandler } from "./Compiler.js"

export function RegexTypeHandler<Out = Regex.Raw>(
	map: [ITyped, IRegexCompilerFunction<Out>][],
	errHandler: IRegexCompilerErrorHandler<any>
) {
	return TableHandler<TreeStream<INode>, Out>(
		new CurrentHash(new TokenHash(BasicMap(mapTypes(map), errHandler)))
	)
}
