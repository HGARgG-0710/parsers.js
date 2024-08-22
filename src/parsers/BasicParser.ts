import type { ParserMap } from "./ParserMap.js"
import { GeneralParser } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"
import { type BasicStream } from "src/types/Stream/BasicStream.js"
import { firstFinished, push } from "../aliases.js"

// * note: doesn't do iteration - leaves it to the user...
export function BasicParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, OutType[]>
) {
	return GeneralParser<BasicStream, Collection, Iterable<any>>({
		parser,
		finished: firstFinished,
		change: push,
		result: ArrayCollection()
	})
}
