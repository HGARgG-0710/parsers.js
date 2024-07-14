import { GeneralParser } from "src/parsers/GeneralParser.js"
import type { ParserMap } from "../parsers.js"
import type { Position, PositionalStream } from "../types.js"

export function StreamLocator<KeyType = any>(locator: ParserMap<KeyType, boolean>) {
	return GeneralParser<PositionalStream, [boolean, number | Position], boolean>({
		finished: function ({ streams, result }) {
			return streams[0].isEnd() || result[0]
		},
		change: function (_lastRes, currRes) {
			this.result[0] = currRes
			this.result[1] = this.streams[0].pos
			if (!currRes) this.streams[0].next()
		},
		parser: locator,
		result: [false, 0]
	})
}
