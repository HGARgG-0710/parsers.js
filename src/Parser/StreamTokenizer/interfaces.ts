import type { Inputted } from "src/Stream/StreamClass/interfaces.js"
import type {
	EndableStream,
	StreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"
import type { StreamMap } from "../ParserMap/interfaces.js"
import type { Superable } from "src/Stream/StreamClass/interfaces.js"

export interface StreamTokenizer<InType = any, OutType = any>
	extends Inputted<EndableStream<InType>>,
		StreamClassInstance<OutType>,
		Superable,
		Iterable<OutType> {
	tokenMap: StreamMap<OutType>
}
