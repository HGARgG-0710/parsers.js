import type { ParserMap } from "../parsers/ParserMap.js"
import type { BasicStream } from "../types.js"
import { GeneralParser } from "../parsers/GeneralParser.js"

export function StreamValidator<KeyType = any>(validator: ParserMap<KeyType, boolean>) {
	return GeneralParser<BasicStream<KeyType>, boolean, any>({
		finished: ({ streams, result }) => streams[0].isEnd() || !result,
		change: function (_current, next) {
			this.result = next && next(this.streams[0])
			if (this.result) this.streams[0].next()
		},
		parser: validator,
		result: true
	})
}
