import { type INode, type IValidNodeType } from "../../interfaces.js"
import { Regex, TableHandler } from "../../objects.js"
import { CurrentHash, TokenHash } from "../../objects/HashMap.js"
import type { TreeStream } from "../../objects/Stream.js"
import { BasicMap } from "../../samples/TerminalMap.js"
import type {
	IRegexCompilerErrorHandler,
	IRegexCompilerFunction
} from "./Compiler.js"

export function RegexTypeHandler<Out = Regex.Raw>(
	map: [IValidNodeType, IRegexCompilerFunction<Out>][],
	errHandler: IRegexCompilerErrorHandler<Out>
) {
	return TableHandler<TreeStream<INode>, Out>(
		new CurrentHash(new TokenHash(BasicMap(map, errHandler)))
	)
}
