import type { BasicStream } from "../../Stream/interfaces.js"
import type { Resulting } from "../../Pattern/interfaces.js"
import type { Collection } from "../..//Pattern/Collection/interfaces.js"
import type { ParserFunction } from "../TableMap/interfaces.js"

export interface ParsingState<
	StreamType extends BasicStream = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> extends Resulting<ResultType> {
	streams?: StreamType[]
	state?: object
	parser?: ParserFunction<ParsingState<StreamType, ResultType, TempType>, TempType>
	finished?: boolean
	change?: (x: TempType) => void
}
