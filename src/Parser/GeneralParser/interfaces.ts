import type { BasicStream } from "src/Stream/interfaces.js"
import type { Resulting } from "../../Pattern/interfaces.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParserMap, ParserFunction } from "../ParserMap/interfaces.js"

export interface ParsingState<
	StreamType extends BasicStream = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> extends Resulting<ResultType> {
	streams?: StreamType[]
	state?: object
	parser?:
		| ParserMap<TempType, ParsingState<StreamType, ResultType, TempType>>
		| ParserFunction<ParsingState<StreamType, ResultType, TempType>, TempType>
	finished?: boolean
	change?: (x: TempType) => void
}
