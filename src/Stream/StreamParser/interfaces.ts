import type {
	EndableStream,
	StreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"
import type { StreamHandler } from "../TableMap/interfaces.js"
import type { Superable } from "../../Stream/StreamClass/interfaces.js"
import type { Pattern } from "src/Pattern/interfaces.js"

export interface StreamTokenizer<InType = any, OutType = any>
	extends Pattern<EndableStream<InType>>,
		StreamClassInstance<OutType>,
		Superable {
	handler: StreamHandler<OutType>
}
