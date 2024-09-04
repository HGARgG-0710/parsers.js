import type { BasicStream } from "_src/types.js"
import type { Resulting } from "../../Pattern/interfaces.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParserMap, ParserFunction } from "../ParserMap/interfaces.js"

export interface ParsingState<
	StreamType extends BasicStream = BasicStream,
	ResultType = Collection,
	TempType = ResultType,
	KeyType = any
> extends Resulting<ResultType> {
	streams?: StreamType[]
	state?: object
	parser?:
		| ParserMap<
				KeyType,
				TempType,
				ParsingState<StreamType, ResultType, TempType, KeyType>
		  >
		| ParserFunction<
				ParsingState<StreamType, ResultType, TempType, KeyType>,
				TempType
		  >
	finished?: boolean
	change?: (x: TempType) => void
}
