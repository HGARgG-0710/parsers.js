import type { Inputted } from "src/Stream/UnderStream/interfaces.js"
import type {
	EndableStream,
	StreamClassInstance
} from "src/Stream/StreamClass/interfaces.js"
import type { StreamMap } from "../ParserMap/interfaces.js"

export interface StreamTokenizer<OutType = any>
	extends Inputted<EndableStream>,
		StreamClassInstance<OutType> {
	tokenMap: StreamMap<OutType>
}
