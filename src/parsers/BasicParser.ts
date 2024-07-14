import type { ParserMap } from "./ParserMap.js"
import { GeneralParser, type ParsingState } from "./GeneralParser.js"
import { ArrayCollection } from "src/types/Collection.js"
import { push } from "main.js"

// * note: doesn't do iteration - leaves it to the user...
export function BasicParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, OutType[]>
) {
	return GeneralParser({
		parser,
		finished: ({ streams }) => streams[0].isEnd(),
		change: push,
		result: ArrayCollection()
	})
}
