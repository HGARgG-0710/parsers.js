import type { ParserMap } from "../ParserMap/interfaces.js"
import { ArrayCollection } from "../../Pattern/Collection/classes.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import { firstFinished } from "../utils.js"
import type { BasicState } from "./interfaces.js"
import { basicParserChange } from "./methods.js"

// * note: doesn't do iteration - leaves it to the user...

export function BasicParser<OutType = any>(
	parser: ParserMap<Iterable<OutType>, BasicState<OutType>>
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
