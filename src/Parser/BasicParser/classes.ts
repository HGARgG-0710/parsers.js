import type { ParserMap } from "_src/parsers.js"
import { ArrayCollection } from "src/Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import { firstFinished } from "../utils.js"
import type { BasicState } from "./interfaces.js"
import { basicParserChange } from "./methods.js"

// * note: doesn't do iteration - leaves it to the user...

export function BasicParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, Iterable<OutType>, BasicState<KeyType, OutType>>
) {
	return GeneralParser<BasicState<KeyType, OutType>>(
		DefineFinished(
			{
				parser,
				change: basicParserChange,
				result: ArrayCollection()
			},
			firstFinished<BasicState<KeyType>>
		)
	)
}
