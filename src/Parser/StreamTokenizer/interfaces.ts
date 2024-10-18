import type { Inputted } from "../../Stream/StreamClass/interfaces.js"
import type {
	EndableStream,
	StreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"
import type { StreamHandler } from "../TableMap/interfaces.js"
import type { Superable } from "../../Stream/StreamClass/interfaces.js"

export interface StreamTokenizer<InType = any, OutType = any>
	extends Inputted<EndableStream<InType>>,
		StreamClassInstance<OutType>,
		Superable {
	handler: StreamHandler<OutType>
}
