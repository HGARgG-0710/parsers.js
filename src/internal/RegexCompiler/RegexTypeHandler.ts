import type { IValidNodeType } from "../../interfaces.js"
import { TableHandler } from "../../objects.js"
import { CurrentHash, TokenHash } from "../../objects/HashMap.js"
import { BasicMap } from "../../samples/TerminalMap.js"
import type {
	IRegexCompilerErrorHandler,
	IRegexCompilerFunction
} from "./Compiler.js"

export function RegexTypeHandler(
	map: [IValidNodeType, IRegexCompilerFunction][],
	errHandler: IRegexCompilerErrorHandler
) {
	return TableHandler(
		new CurrentHash(new TokenHash(BasicMap(map, errHandler)))
	)
}
