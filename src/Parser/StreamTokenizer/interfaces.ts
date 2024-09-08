import type { Inputted } from "src/Stream/UnderStream/interfaces.js"
import type {
	BaseStream,
	EssentialStream
} from "src/Stream/BasicStream/interfaces.js"
import type { StreamMap } from "../ParserMap/interfaces.js"

export interface StreamTokenizer<OutType = any>
	extends Inputted<BaseStream>,
		EssentialStream<OutType> {
	tokenMap: StreamMap<OutType>
}
