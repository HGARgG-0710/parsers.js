import type { ParserFunction } from "../TableMap/interfaces.js"
import type { BasicState } from "./interfaces.js"

import { ArrayCollection } from "../../Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import { firstFinished } from "../utils.js"
import { basicParserChange } from "./methods.js"

// * note: doesn't do iteration - leaves it to the user...

export function BasicParser<OutType = any>(
	parser: ParserFunction<BasicState<OutType>, Iterable<OutType>>
) {
	return GeneralParser<BasicState<OutType>>(
		DefineFinished(
			{
				parser,
				change: basicParserChange,
				result: ArrayCollection()
			},
			firstFinished<BasicState<OutType>>
		)
	)
}
